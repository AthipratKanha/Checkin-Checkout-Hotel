import { KeyCard } from "./KeyCard";
import { Document } from "./Document";
import { Room } from "./Room";

export class CheckInHistory extends Document {
  constructor(name: string, age: number, room: Room, public keyCard: KeyCard) {
    super(name, age, room);
    this.keyCard = keyCard;
  }
}
