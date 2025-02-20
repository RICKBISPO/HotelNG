import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';
import { map, Observable, switchMap } from 'rxjs';
import moment from 'moment';
import { MaxRoomsAndCapacityError } from '../../errors/MaxRoomsAndCapacityError';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) { }

  public getReservationById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.apiUrl}/${id}`
    );
  }

  public getReservations(guestId?: string): Observable<Array<Reservation>> {
    if (guestId) {
      return this.http.get<Array<Reservation>>(
        `${this.apiUrl}/?guestId=${guestId}`
      );
    }
    return this.http.get<Array<Reservation>>(
      `${this.apiUrl}`
    );
  }

  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.checkRoomAvailability(reservation.roomType, reservation.checkIn, reservation.checkOut)
    .pipe(
      switchMap(room => {
        const capacity = this.checkMaxCapacityRoom(reservation.roomType, reservation.numberOfGuests);
        if (capacity && room) {
          return this.http.put<Reservation>(
            `${this.apiUrl}/${reservation.id}`, {...reservation}
          );
        } else {
          throw new MaxRoomsAndCapacityError(
            !room, 
            !capacity
          );
        }
      })
    );
  }

  public createReservation(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this.checkRoomAvailability(reservation.roomType, reservation.checkIn, reservation.checkOut)
    .pipe(
      switchMap(room => {
        const capacity = this.checkMaxCapacityRoom(reservation.roomType, reservation.numberOfGuests);
        if (capacity && room) {
          reservation.status = "pending";
          return this.http.post<Reservation>(
            `${this.apiUrl}`, {...reservation}
          );
        } else {
          throw new MaxRoomsAndCapacityError(
            !room, 
            !capacity
          );
        }
      })
    );
  }

  public deleteReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.apiUrl}/${id}`
    ).pipe(
      switchMap(reservation => {
        reservation.status = "cancelled";
        return this.http.put<Reservation>(
          `${this.apiUrl}/${id}`, {...reservation}
        );
      })
    );
  }

  private checkRoomAvailability(roomType: string, checkIn: string, checkOut: string): Observable<boolean> {
    return this.http.get<Array<Reservation>>(
      `${this.apiUrl}/?roomType=${roomType}`
    ).pipe(
      map(res => {
        const reservations = res.filter((r) => {
          moment(r.checkOut).isAfter(moment(checkIn)) &&
          moment(r.checkIn).isBefore(moment(checkOut))
        })

        let isValid = true;
        switch (roomType) {
          case 'Standard':
            if (reservations.length >= 10) isValid = false;
            break;
          case 'Deluxe':
            if (reservations.length >= 5) isValid = false;
            break;
          case 'Suite':
            if (reservations.length >= 3) isValid = false;
            break;
        }
        return isValid;
      })
    );
  }
  
  private checkMaxCapacityRoom(roomType: string, numberOfGuests: number): boolean {
    let isValid = true;
    switch (roomType) {
      case 'Standard':
        if (numberOfGuests > 2) isValid = false;
        break;
      case 'Deluxe':
        if (numberOfGuests > 4) isValid = false;
        break;
      case 'Suite':
        if (numberOfGuests > 6) isValid = false;
        break;
    }
    return isValid;
  }

}
