import { Room } from "./../Room";

export class RoomManager {
  private rooms: Room[];

  constructor(floorCount: number, roomPerFloorCount: number) {
    this.rooms = this.createRooms(floorCount, roomPerFloorCount);
  }

  public get listRoom() {
    return this.rooms;
  }

  public book(rooms: Room[] | Room): void {
    try {
      (<Room[]>rooms).map(room => room.book());
    } catch (error) {
      (<Room>rooms).book();
    }
  }

  public createRooms(floorCount: number, roomPerFloorCount: number): Room[] {
    return Array.from({ length: floorCount }, (_, indexFloor) =>
      Array.from({ length: roomPerFloorCount }, (_, indexRoom) => {
        const roomNo = indexRoom + 1;
        const floorNo = indexFloor + 1;
        return new Room(
          floorNo.toString() + roomNo.toString().padStart(2, "0")
        );
      })
    ).flat();
  }

  public getRoomByFloor(floor: number): Room[] {
    return this.rooms.filter(room => room.floor === floor.toString());
  }

  public getRoomByNo(roomNo: number): Room | undefined {
    return this.rooms.find(room => room.no === roomNo.toString());
  }

  public makeAvaliable(room: Room): boolean {
    return (room.isBooked = false);
  }

  public get availableRooms(): Room[] {
    return this.rooms.filter(room => !room.isBooked);
  }
}
