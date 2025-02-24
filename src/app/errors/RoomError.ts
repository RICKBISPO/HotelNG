export class RoomError extends Error {
    
  room: boolean;
  capacity: boolean;

  constructor(room: boolean, capacity: boolean) {
    super('Quarto ou Capacidade maxima/minima atingida');
    this.room = room;
    this.capacity = capacity;
  }

}