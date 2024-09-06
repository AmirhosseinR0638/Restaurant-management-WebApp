import { Food } from './food';

export class Order {
  id: string; // for firebase
  orderId: string;
  clientName: string;
  clientPhoneNumber: string;
  clientAddress: string;
  orderType: string;
  date: string;
  orders: Food[];
  totalPrice: number;
  isPaid: boolean;
  constructor(
    clientName: string,
    clientPhoneNumber: string,
    clientAddress: string,
    orderType: string,
    date: string,
    orders: Food[],
    totalPrice: number,
    isPaid: boolean
  ) {
    this.orderId = this.idMaker();
    this.clientName = clientName;
    this.clientPhoneNumber = clientPhoneNumber;
    this.clientAddress = clientAddress;
    this.orderType = orderType;
    this.date = date;
    this.orders = orders;
    this.totalPrice = totalPrice;
    this.isPaid = isPaid;
  }
  idMaker() {
    // create a random ID  for every foods
    return 'O' + Math.floor(Math.random() * 999);
  }
}
