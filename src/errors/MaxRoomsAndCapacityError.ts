export class MaxRoomsAndCapacityError extends Error {
    
    room: boolean;
    capacity: boolean;
  
    constructor(room: boolean, capacity: boolean) {
      super('Quarto ou Capacidade maxima atingida');
      this.room = room;
      this.capacity = capacity;
    }

}