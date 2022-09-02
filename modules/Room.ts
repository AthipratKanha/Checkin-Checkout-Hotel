export class Room {
  public no: string;
  public floor: string;
  public isBooked: boolean;

  constructor(roomNo: string) {
    this.no = roomNo;
    this.floor = roomNo.substr(0, 1);
    this.isBooked = false;
  }

  public book(): void {
    this.isBooked = true;
  }
}
