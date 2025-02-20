import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../services/guest.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../model/reservation';
import { Guest } from '../../model/guest';

/**
 * Componente criado para informacoes detalhadas de reserva.
 */
@Component({
  selector: 'app-reservations-details',
  imports: [],
  templateUrl: './reservations-details.component.html',
  styleUrl: './reservations-details.component.scss'
})
export class ReservationsDetailsComponent implements OnInit {

  reservation!: Reservation;
  guest!: Guest;

  constructor(
    private route: ActivatedRoute,
    private guestService: GuestService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    const reservationId = String(this.route.snapshot.paramMap.get('id'));
    this.loadReservation(reservationId);
    this.loadGuest(reservationId);
  }

  loadReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => this.reservation = reservation
    })
  }

  loadGuest(id: string): void {
    this.guestService.getGuestByReservationId(id).subscribe({
      next: (guest) => this.guest = guest
    })
  }


  
}
