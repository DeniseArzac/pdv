import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [ReactiveFormsModule,
      CommonModule, FormsModule,
      NgbDatepickerModule,
      NgbModalModule],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})
export class ActividadComponent {

  activityForm: FormGroup = new FormGroup({
    name: new FormControl(null),
    dateFrom: new FormControl(null),
    import: new FormControl(null),
    address: new FormControl(null)
  })

  constructor(private router: Router){}

  goToHome(){
    this.router.navigate(['/itinerary']);
  }

}
