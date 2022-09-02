import { Guest } from "./Guest";
import { Room } from "./Room";

export class Document {
  public guest: Guest;

  constructor(name: string, age: number, public room: Room) {
    this.guest = new Guest(name, age);
    this.room = room;
  }
}
