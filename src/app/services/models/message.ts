export class Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  isDone: boolean = false;
  constructor(sender: string, message: string) {
    this.sender = sender;
    this.message = message;
    this.time = new Date().getHours() + ':' + new Date().getMinutes();
  }
}
