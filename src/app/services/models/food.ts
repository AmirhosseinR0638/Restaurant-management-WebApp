export class Food {
  id: string;
  foodId: string;
  name: string;
  category: string;
  price: number;
  discountPercentage: number;
  remindNumber: number;
  numberOfDailyServe: number;
  numberOfOrdered: number;
  constructor(
    name: string,
    category: string,
    price: number,
    discountPercentage: number = 0,
    numberOfDailyServe: number
  ) {
    this.foodId = this.idMaker();
    this.name = name;
    this.category = category;
    this.price = price;
    this.discountPercentage = discountPercentage;
    this.numberOfDailyServe = numberOfDailyServe;
    this.remindNumber = numberOfDailyServe;
    this.numberOfOrdered = 0;
  }
  private idMaker() {
    // create a random ID  for every foods
    return 'F' + Math.floor(Math.random() * 999);
  }
}
