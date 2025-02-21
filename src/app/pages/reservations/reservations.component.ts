import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalComponent } from "../../components/modal/modal.component";
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import moment from 'moment';
import { GuestService } from '../../services/guest.service';
import { Guest } from '../../model/guest';
import { AlertComponent } from '../../components/alert/alert.component';
import { Reservation } from '../../model/reservation';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { SearchBarService } from '../../services/search-bar.service';
import { TableComponent } from "../../components/table/table.component";
import { Alert } from '../../model/alert';
import { BadgeComponent } from "../../components/badge/badge.component";
import { RouterLink } from '@angular/router';
import { ElementState } from '../../model/elementState';

/**
 * Componente criado para informacoes de reservas.
 * O componente exibe formularios e listagem do CRUD.
 */
@Component({
  selector: 'app-reservations',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ModalComponent, CommonButtonComponent, AlertComponent, SearchBarComponent, TableComponent, BadgeComponent, RouterLink, DatePipe],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit, AfterViewInit {

  reservationList: Array<Reservation> = new Array<Reservation>;
  guestList: Array<Guest> = new Array<Guest>;
  formReservations: FormGroup;
  maxRooms: boolean = false;
  maxCapacity: boolean = false;
  alertAll: boolean = false;
  alert: Alert = { value: false, type: "", message: "" };
  deletedReservation: string = "";
  updatedReservation: Reservation | null = null;

  checkboxStates = {
    checkIn: false,
    checkOut: false,
    roomType: false,
    status: false
  };

  filterStates: Array<ElementState> = [
    { name: "checkIn", value: false },
    { name: "checkOut", value: false },
    { name: "roomType", value: false },
    { name: "status", value: false }
  ];

  constructor (
    private reservationService: ReservationService,
    private guestService: GuestService,
    private searchBarService: SearchBarService
  ) {
    this.formReservations = new FormGroup({
      guest: new FormControl('', [Validators.required]),
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
      numberOfGuests: new FormControl('', [Validators.required]),
      status: new FormControl('pending', [Validators.required]),
      remarks: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.loadGuests();
  }

  ngAfterViewInit(): void {
    this.searchBarService.searchBarSubject$.subscribe({
      next: (searchValue) => {
        if (searchValue !== "") {
          const newReservationList = new Array<Reservation>;
          this.reservationList.forEach((reservation) => {
            const checkIn = String(new DatePipe('pt-BR').transform(reservation.checkIn, 'shortDate'));
            const checkOut = String(new DatePipe('pt-BR').transform(reservation.checkOut, 'shortDate'));  
            if (
              (checkIn.includes(searchValue.toLowerCase()) && this.checkboxStates.checkIn) ||
              (checkOut.includes(searchValue.toLowerCase()) && this.checkboxStates.checkOut) ||
              (reservation.roomType.toLowerCase().includes(searchValue.toLowerCase()) && this.checkboxStates.roomType) ||
              (reservation.status.toLowerCase().includes(searchValue.toLowerCase()) && this.checkboxStates.status)
            ) {
              newReservationList.push(reservation);
            }
          });
          this.reservationList = newReservationList;
        }
        else {
          this.loadReservations();
        }
      }
    });
  }

  onSubmit(): void {
    if (this.formReservations.valid && this.validCheckInAndCheckOut()) {
      const reservation = {
        guestId: this.formReservations.value.guest,
        checkIn: this.formReservations.value.checkIn,
        checkOut: this.formReservations.value.checkOut,
        roomType: this.formReservations.value.roomType,
        numberOfGuests: this.formReservations.value.numberOfGuests,
        status: this.formReservations.value.status,
        remarks: this.formReservations.value.remarks,
      }

      if (this.updatedReservation) {
        const reservationWithId = { 
          id: this.updatedReservation.id,
          ...reservation
        }
        this.reservationService.updateReservation(reservationWithId).subscribe({
          next: () => {
            this.formReservations.reset();
            this.maxRooms = false;
            this.maxCapacity = false;
  
            this.setAlert("success", "Reserva Atualizada");
            this.loadReservations();
          },
          error: (error) => {
            this.maxRooms = error.room;
            this.maxCapacity = error.capacity;

            this.setAlert("error", "Erro ao Atualizar Reserva");
          }
        });
      }
      else {
        this.reservationService.createReservation(reservation).subscribe({
          next: () => {
            this.formReservations.reset();
            this.maxRooms = false;
            this.maxCapacity = false;
  
            this.setAlert("success", "Reserva Adicionada");
            this.loadReservations();
          },
          error: (error) => {
            this.maxRooms = error.room;
            this.maxCapacity = error.capacity;

            this.setAlert("error", "Erro ao Adicionar Reserva");
          }
        });
      }
      
      this.alertAll = false;
    } 
    else {
      this.alertAll = true;
    }
  }

  validCheckInAndCheckOut(): boolean {
    const checkIn = moment(this.formReservations.value.checkIn);
    const checkOut = moment(this.formReservations.value.checkOut);
    return checkIn.isBefore(checkOut);
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => this.reservationList = reservations 
    });
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => this.guestList = guests
    });
  }

  findGuest(id: string): Guest | undefined {
    if (id) return this.guestList.find((guest) => guest.id === id);
    return undefined;
  }

  setDeletedReservation(id: string): void {
    this.deletedReservation = id;
  }

  deleteReservation(): void {
    this.reservationService.deleteReservation(this.deletedReservation).subscribe({
      next: () => {
        this.loadReservations();
        this.deletedReservation = "";
      }
    });
  }

  toggleUpdatedReservation(reservation?: Reservation): void {
    if (reservation) {
      this.updatedReservation = reservation;
      this.formReservations.setValue({
        guest: reservation.guestId,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        roomType: reservation.roomType,
        numberOfGuests: reservation.numberOfGuests,
        status: reservation.status,
        remarks: reservation.remarks
      });
    } else {
      this.updatedReservation = null;
      this.formReservations.reset();
    }
  }

  setAlert(type: string, message: string): void {
    this.alert.value = true;
    this.alert.type = type;
    this.alert.message = message;
    setTimeout(() => {
      this.alert.value = false;
      this.maxRooms = false;
      this.maxCapacity = false;
    }, 2000);
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