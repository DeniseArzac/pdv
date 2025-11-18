import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItinerarioComponent } from './itinerario/itinerario.component';
import { ActividadComponent } from './actividad/actividad.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'itinerary', component: ItinerarioComponent },
  { path: 'activity', component: ActividadComponent}
];
