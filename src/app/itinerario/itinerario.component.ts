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
  NgbAccordionModule],
  templateUrl: './itinerario.component.html',
  styleUrl: './itinerario.component.css'
})
export class ItinerarioComponent implements OnInit {

  itineraryForm: FormGroup = new FormGroup({
    destination: new FormControl (null),
    dateFrom: new FormControl (null),
    dateTo: new FormControl (null),
    budget: new FormControl(null),
    activity: new FormControl(null),
    transport: new FormControl (null)
  })

  transportForm: FormGroup = new FormGroup({
    mode: new FormControl(null),
    date: new FormControl (null),
    import: new FormControl (null),
    destination: new FormControl(null)
  })

   activityForm: FormGroup = new FormGroup({
      name: new FormControl(null),
      dateFrom: new FormControl(null),
      import: new FormControl(null),
      address: new FormControl(null)
    })

  constructor(private router: Router,
    private modalService: NgbModal
  ){}

  ngOnInit(){}

  addActivity(){
    this.router.navigate(['/activity']);
  }

   openTransporteModal(content: any) {
    this.modalService.open(content, { size: 'md' });
   }

   openActividadModal(content: any) {
    this.modalService.open(content, { size: 'md' });
   }

   goToHome(){
    this.router.navigate(['/']);
   }

   cancelActivity(content: any){
    this.modalService.dismissAll(content);

   }

   cancelTransport(content: any){
    this.modalService.dismissAll(content);
   }

}
