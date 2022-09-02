export class Hotel {
  public roomCount: number;

  constructor(public floorCount: number, public roomPerFloorCount: number) {
    this.roomCount = floorCount * roomPerFloorCount;
  }
}
