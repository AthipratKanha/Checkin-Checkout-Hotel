import { Document } from "./Document";
import { Room } from "./Room";

export class BookingHistory extends Document {
  public isCheckIn: boolean;

  constructor(name: string, age: number, room: Room) {
    super(name, age, room);
    this.isCheckIn = false;
  }

  public checkedIn(): void {
    this.isCheckIn = true;
  }
}
