import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public data: any;
  public all: any[] = [];
  public calculateDays: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.data = JSON.parse(localStorage.getItem('itineraryData') || '[]');
    }
  }

  getEstado(dateFrom: any): string {
    if (!dateFrom) return 'Sin fecha';

    const fecha = new Date(dateFrom.year, dateFrom.month - 1, dateFrom.day);
    fecha.setHours(0, 0, 0, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diffMs = fecha.getTime() - hoy.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return ` Hace ${Math.abs(diffDias)} días `;
    if (diffDias === 0) return '¡Preparate! Hoy comienza ';
    return `Faltan ${diffDias} días `;
  }


  getEstadoClass(dateFrom: any): string {
    if (!dateFrom) return '';

    const fecha = new Date(dateFrom.year, dateFrom.month - 1, dateFrom.day);
    fecha.setHours(0, 0, 0, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diffMs = fecha.getTime() - hoy.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return 'estado-rojo';        // Hace..
    if (diffDias < 15) return 'estado-verde';      // Falta menos de 15 días
    return 'estado-amarillo';                      // Falta 15 días o más
  }

  itinerary(mode: any, index?: number) {
    this.router.navigate(
      ['/itinerary'],
      { queryParams: { mode: mode, index: index } }
    );
  }

  setCardImage(item: any) {
    const dest = item?.itinerary?.destination;

    switch (dest) {
      case 'Orlando': return 'images/disney.jpg';
      case 'París': return 'images/paris.jpg';
      case 'Cancún': return 'images/cancun.jpg';
      default: return 'images/default.jpg';
    }
  }

}
