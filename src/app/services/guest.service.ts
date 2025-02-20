import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Guest } from '../model/guest';
import { ExistingEmailAndDocumentError } from '../../errors/ExistingEmailAndDocumentError';
import { ReservationService } from './reservation.service';
import { ExistingReservationsError } from '../../errors/ExistingReservationsError';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private apiUrl = 'http://localhost:3000/guests';

  constructor(private http: HttpClient, private reservationService: ReservationService) { }

  public getGuestByReservationId(reservationId: string): Observable<Guest> {
    return this.reservationService.getReservationById(reservationId)
    .pipe(
      switchMap(res => {
        if (res) {
          return this.http.get<Guest>(
            `${this.apiUrl}/${res.guestId}`
          );
        } else {
          throw new Error("Reserva não encontrada");
        }
      })
    )
  }

  public getGuests(): Observable<Array<Guest>> {
    return this.http.get<Array<Guest>>(
      `${this.apiUrl}`
    );
  }

  public updateGuest(guest: Guest): Observable<Guest> {
    return forkJoin({
      email: this.checkExistingEmail(guest.email, guest.id),
      document: this.checkExistingDocument(guest.document, guest.id)
    }).pipe(
      switchMap(res => {
        if (!res.email && !res.document) {
          return this.http.put<Guest>(
            `${this.apiUrl}/${guest.id}`, {...guest}
          );
        } else {
          throw new ExistingEmailAndDocumentError(
            res.email, 
            res.document
          );
        }
      })
    );
  }

  public createGuest(guest: Omit<Guest, 'id'>): Observable<Guest> {
    return forkJoin({
      email: this.checkExistingEmail(guest.email),
      document: this.checkExistingDocument(guest.document)
    }).pipe(
      switchMap(res => {
        if (!res.email && !res.document) {
          return this.http.post<Guest>(
            `${this.apiUrl}`, {...guest}
          );
        } else {
          throw new ExistingEmailAndDocumentError(
            res.email, 
            res.document
          );
        }
      })
    );
  }

  public deleteGuest(id: string): Observable<Guest> {
    return this.reservationService.getReservations(id)
    .pipe(
      switchMap(res => {
        let isValid = true;
        res.forEach((reservation) => {
          if (reservation.status !== "cancelled") {
            isValid = false;
          }
        })
        if (isValid) {
          return this.http.delete<Guest>(
            `${this.apiUrl}/${id}`,
          );
        } else {
          throw new ExistingReservationsError(!isValid);
        }
      })
    );
    
  }

  private checkExistingEmail(email: string, id?: string): Observable<boolean> {
    if (id) {
      return this.http.get<Array<Guest>>(
        `${this.apiUrl}/?email=${email}&id=${id}`
      ).pipe(
        map(res => !(res.length > 0))
      );
    }
    return this.http.get<Array<Guest>>(
      `${this.apiUrl}/?email=${email}`
    ).pipe(
      map(res => res.length > 0)
    );
  }

  private checkExistingDocument(document: string, id?: string): Observable<boolean> {
    if (id) {
      return this.http.get<Array<Guest>>(
        `${this.apiUrl}/?document=${document}&id=${id}`
      ).pipe(
        map(res => !(res.length > 0))
      );
    }
    return this.http.get<Array<Guest>>(
      `${this.apiUrl}/?document=${document}`
    ).pipe(
      map(res => res.length > 0)
    );
  }

}
