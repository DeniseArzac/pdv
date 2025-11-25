import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionModule, NgbDatepickerModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-itinerario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, FormsModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbAccordionModule,
  ],
  templateUrl: './itinerario.component.html',
  styleUrl: './itinerario.component.css'
})
export class ItinerarioComponent implements OnInit {

  itineraryForm: FormGroup = new FormGroup({
    destination: new FormControl(null, Validators.required),
    dateFrom: new FormControl(null, Validators.required),
    dateTo: new FormControl(null, Validators.required),
    budget: new FormControl(null, Validators.required),
  });

  transportForm: FormGroup = new FormGroup({
    mode: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    import: new FormControl(null, Validators.required),
    destination: new FormControl(null, Validators.required)
  });

  activityForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    dateFrom: new FormControl(null, Validators.required),
    import: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required)
  });

  activities: any[] = [];
  transports: any[] = [];
  total: any;

  currentIndex: number | null = null;
  deleteModalRef: any;


  constructor(private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let mode = this.activatedRoute.snapshot.queryParamMap.get('mode');
    let index = this.activatedRoute.snapshot.queryParamMap.get('index');

    if (mode === 'view' && index !== null) {
      this.currentIndex = Number(index);

      const all = JSON.parse(localStorage.getItem('itineraryData') || '[]');
      const data = all[this.currentIndex];
      this.loadFromLocalStorage(data);
    }
  }

  loadFromLocalStorage(data: any) {
    if (data?.itinerary) {
      this.itineraryForm.patchValue(data.itinerary);
    }

    this.activities = data.activities || [];
    this.transports = data.transports || [];

    this.calculateTotal();
  }

  saveToLocalStorage() {
    this.calculateTotal();

    const newData = {
      itinerary: this.itineraryForm.value,
      activities: this.activities,
      transports: this.transports,
      total: this.total
    };

    let all = JSON.parse(localStorage.getItem('itineraryData') || '[]');

    // SI ESTOY EDITANDO
    if (this.currentIndex !== null) {
      all[this.currentIndex] = newData;
    } else {
      all.push(newData);
    }

    localStorage.setItem('itineraryData', JSON.stringify(all));
  }


  calculateTotal() {
    const budget = Number(this.itineraryForm.value.budget) || 0;

    const totalActivities = this.activities.reduce(
      (acc, a) => acc + (Number(a.import) || 0),
      0
    );

    const totalTransports = this.transports.reduce(
      (acc, t) => acc + (Number(t.import) || 0),
      0
    );

    this.total = budget - totalActivities - totalTransports;
  }

  // Actividad

  saveActivity(modal: any) {
    if (!this.activityForm.invalid) {
      this.activities.push(this.activityForm.value);
      this.calculateTotal();
      this.activityForm.reset();
      modal.close();
      this.toastr.success('Actividad agregada exitosamente');
    } else {
      this.toastr.error('Debe completar todos los campos del formulario.', 'Error');
    }
  }

  removeActivity(i: number) {
    this.activities.splice(i, 1);
    this.calculateTotal();
    this.saveToLocalStorage();
  }

  // Transporte

  saveTransport(modal: any) {
    if (!this.transportForm.invalid) {
      this.transports.push(this.transportForm.value);
      this.calculateTotal();
      this.transportForm.reset();
      modal.close();
      this.toastr.success('Transporte agregado exitosamente');

    } else {
      this.toastr.error('Debe completar todos los campos del formulario.', 'Error');
    }
  }

  removeTransport(i: number) {
    this.transports.splice(i, 1);
    this.calculateTotal();
    this.saveToLocalStorage();
  }

  delete() {
    const all = JSON.parse(localStorage.getItem('itineraryData') || '[]');

    if (this.currentIndex !== null && all[this.currentIndex]) {
      all.splice(this.currentIndex, 1);
      localStorage.setItem('itineraryData', JSON.stringify(all));
    }

    this.itineraryForm.reset();
    this.activityForm.reset();
    this.transportForm.reset();

    this.activities = [];
    this.transports = [];
    this.total = null;
    if (this.deleteModalRef) {
      this.deleteModalRef.close();
    }

    this.toastr.success('Itinerario eliminado exitosamente');

    this.router.navigate(['/']);
  }

  confirm() {
    if (this.itineraryForm.valid) {

      this.saveToLocalStorage();

      if (this.currentIndex !== null) {
        this.toastr.success('Itinerario actualizado exitosamente');
      } else {
        this.toastr.success('Itinerario creado exitosamente');
      }

      this.router.navigate(['/']);
    } else {
      this.toastr.error('Debe completar los campos del formulario.', 'Error');
    }
  }

  // Modales

  openTransporteModal(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  openActividadModal(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  openDeleteModal(content: any) {
    this.deleteModalRef = this.modalService.open(content, { size: 'md' });
  }

  cancelActivity(content: any) {
    this.modalService.dismissAll(content);
  }

  cancelTransport(content: any) {
    this.modalService.dismissAll(content);
  }

  cancelDelete(content: any) {
    this.modalService.dismissAll(content);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
