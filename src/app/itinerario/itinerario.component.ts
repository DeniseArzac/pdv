import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
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


  constructor(private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem('itineraryData');

    if (savedData) {
      const data = JSON.parse(savedData);

      if (data.itinerary) {
        this.itineraryForm.patchValue(data.itinerary);
      }

      this.activities = data.activities || [];
      this.transports = data.transports || [];

      this.calculateTotal();
    }
  }

  saveToLocalStorage() {
    // if(!this.itineraryForm.invalid){
    this.calculateTotal();

    const data = {
      itinerary: {
        destination: this.itineraryForm.value.destination,
        dateFrom: this.itineraryForm.value.dateFrom,
        dateTo: this.itineraryForm.value.dateTo,
        budget: this.itineraryForm.value.budget
      },
      activities: this.activities,
      transports: this.transports,
      total: this.total
    };

    localStorage.setItem('itineraryData', JSON.stringify(data));

    // this.toastr.success('Itinerario creado exitosamente');
    // }else{
    //   this.toastr.error('Debe completar los campos del formulario.', 'Error')
    // }
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
      this.saveToLocalStorage();
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
      this.saveToLocalStorage();
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
    localStorage.removeItem('itineraryData');

    // Limpia formularios
    this.itineraryForm.reset();
    this.activityForm.reset();
    this.transportForm.reset();

    this.activities = [];
    this.transports = [];
    this.total = null;
  }

  confirm() {
    if (this.itineraryForm.valid) {
      this.toastr.success('Itinerario creado exitosamente');
    } else {
      this.toastr.error('Debe completar los campos del formulario.', 'Error')
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
    this.modalService.open(content, { size: 'md' });
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
