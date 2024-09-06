export class Cashier {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  userName: string;
  password: string;
  salary: number;
  isLoggedIn: boolean = false;
  constructor(
    firstName: string,
    lastName: string,
    gender: string,
    age: number,
    userName: string,
    password: string,
    salary: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.userName = userName;
    this.password = password;
    this.salary = salary;
  }
}
