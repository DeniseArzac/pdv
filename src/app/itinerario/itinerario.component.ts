import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbAccordionModule, NgbDatepickerModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-itinerario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, FormsModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbAccordionModule
  ],
  templateUrl: './itinerario.component.html',
  styleUrl: './itinerario.component.css'
})
export class ItinerarioComponent implements OnInit {

  itineraryForm: FormGroup = new FormGroup({
    destination: new FormControl(null),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null),
    budget: new FormControl(null)
  });

  transportForm: FormGroup = new FormGroup({
    mode: new FormControl(null),
    date: new FormControl(null),
    import: new FormControl(null),
    destination: new FormControl(null)
  });

  activityForm: FormGroup = new FormGroup({
    name: new FormControl(null),
    dateFrom: new FormControl(null),
    import: new FormControl(null),
    address: new FormControl(null)
  });

  activities: any[] = [];
  transports: any[] = [];

  constructor(private router: Router, private modalService: NgbModal) {}

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
    }
  }

  saveToLocalStorage() {
    const data = {
      itinerary: this.itineraryForm.value,
      activities: this.activities,
      transports: this.transports
    };
    debugger;

    localStorage.setItem('itineraryData', JSON.stringify(data));
  }

  // Actividad


  saveActivity(modal: any) {
    this.activities.push(this.activityForm.value);
    this.saveToLocalStorage();

    this.activityForm.reset();
    modal.close();
  }

  removeActivity(index: number) {
    this.activities.splice(index, 1);
    this.saveToLocalStorage();
  }

  // Transporte

  saveTransport(modal: any) {
    this.transports.push(this.transportForm.value);
    this.saveToLocalStorage();

    this.transportForm.reset();
    modal.close();
  }

  removeTransport(index: number) {
    this.transports.splice(index, 1);
    this.saveToLocalStorage();
  }

  // Modales

  openTransporteModal(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  openActividadModal(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  cancelActivity(content: any) {
    this.modalService.dismissAll(content);
  }

  cancelTransport(content: any) {
    this.modalService.dismissAll(content);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
