export class ExistingReservationsError extends Error {
    
  reservations: boolean;

  constructor(reservations: boolean) {
    super('Reservas existentes relacionadas ao Hóspede');
    this.reservations = reservations;
  }

}