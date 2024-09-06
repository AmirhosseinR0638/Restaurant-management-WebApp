export class Table {
  id: string;
  number: number;
  capacity: number;
  isReserved: boolean = false;
  constructor(number: number, capacity: number) {
    this.number = number;
    this.capacity = capacity;
  }
}
