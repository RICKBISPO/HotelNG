import { Component, OnInit } from '@angular/core';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { GuestService } from '../../services/guest.service';
import { Reservation } from '../../model/reservation';
import { Guest } from '../../model/guest';
import moment from 'moment';
import { TableComponent } from '../../components/table/table.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ElementState } from '../../model/elementState';
import { DatePipe } from '@angular/common';

/**
 * Componente criado definir pagina inicial da aplicacao.
 * Tambem possui listagem das reservas do dia.
 */
@Component({
  selector: 'app-home',
  imports: [CommonButtonComponent, RouterLink, TableComponent, BadgeComponent, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  reservationList: Array<Reservation> = new Array<Reservation>;
  guestList: Array<Guest> = new Array<Guest>;

  filterStates: Array<ElementState> = [
    { name: "checkIn", value: false },
    { name: "checkOut", value: false },
    { name: "roomType", value: false },
    { name: "status", value: false }
  ];

  constructor (
    private reservationService: ReservationService,
    private guestService: GuestService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
    this.loadGuests();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        reservations.forEach((reservation) => {
          if (
            this.reservationOfTheDay(reservation.checkIn, reservation.checkOut)
          ) {
            this.reservationList.push(reservation);
          }
        })
      }
    });
  }

  findGuest(id: string): Guest | undefined {
    return this.guestList.find((guest) => guest.id === id);
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => this.guestList = guests
    });
  }

  reservationOfTheDay(checkIn: string, checkOut: string): boolean {
    return moment().isSame(moment(checkIn),'day') || moment().isSame(moment(checkOut),'day');
  }

  sortList(column: string): void {
    if (column === "checkIn") {
      this.reservationList.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    }
    else if (column === "checkOut") {
      this.reservationList.sort((a, b) => a.checkOut.localeCompare(b.checkOut));
    }
    else if (column === "roomType") {
      this.reservationList.sort((a, b) => a.roomType.localeCompare(b.roomType));
    }
    else if (column === "status") {
      this.reservationList.sort((a, b) => a.status.localeCompare(b.status));
    }
  }

  getFilterState(column: string): ElementState | undefined {
    return this.filterStates.find((filter) => filter.name === column && filter.value);
  }

  toggleFilterStates(column: string): void {
    this.filterStates.map((filter) => {
      if (filter.name === column) {
        filter.value = true;
      }
      else {
        filter.value = false;
      }
    });
  }

}
