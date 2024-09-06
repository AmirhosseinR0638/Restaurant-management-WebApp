export class Client {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  amountOfOrders: number = 0;
  constructor(
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }
}
