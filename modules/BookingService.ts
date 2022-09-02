import { KeyCard } from "./KeyCard";
import { CheckInHistory } from "./CheckInHistory";
import { Guest } from "./Guest";
import { BookingHistory } from "./BookingHistory";
import { BookingHistoryManager } from "./managers/BookingHistoryManager";
import { CheckInHistoryManager } from "./managers/CheckInHistoryManager";
import { KeyCardManager } from "./managers/KeyCardManager";
import { RoomManager } from "./managers/RoomManager";
import { Room } from "./Room";
import { confirmationInfo, confirmationInfos } from "./interface/Information";

export class BookingService {
  private keyCardManager: KeyCardManager;
  private roomManager: RoomManager;
  private bookingHistoryManager: BookingHistoryManager = new BookingHistoryManager();
  private checkInHistoryManager: CheckInHistoryManager = new CheckInHistoryManager();

  constructor(floorCount: number, roomPerFloorCount: number) {
    this.keyCardManager = new KeyCardManager(floorCount * roomPerFloorCount);
    this.roomManager = new RoomManager(floorCount, roomPerFloorCount);
  }

  public bookingApplication(roomNo: number, guest: Guest): confirmationInfo {
    const room = this.roomManager.getRoomByNo(roomNo) as Room;

    if (room.isBooked) {
      const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(
        roomNo
      ) as BookingHistory;

      throw new Error(
        `Cannot book room ${roomNo} for ${
          guest.name
        }, The room is currently booked by ${bookingHistory.guest.name}`
      );
    }

    this.roomManager.book(room);
    const bookingHistory = this.bookingHistoryManager.createBookingHistory(
      room,
      guest
    );

    if (bookingHistory.isCheckIn) {
      throw new Error(`Guest already checked in in checkin history.`);
    }

    bookingHistory.checkedIn();
    const borrowedKeyCard = this.keyCardManager.borrowKeyCard() as KeyCard;
    const checkInHistory: CheckInHistory = this.checkInHistoryManager.createCheckInHistory(
      bookingHistory,
      guest,
      borrowedKeyCard
    );
    this.checkInHistoryManager.updateCheckInHistories(checkInHistory);

    return { bookingHistory, checkInHistory };
  }

  public bookingByFloorApplication(
    floor: number,
    guest: Guest
  ): confirmationInfos {
    const roomsInFloor: Room[] = this.getRoomByFloor(floor);
    const isRoomsAllAvaliable: boolean = roomsInFloor.every(
      room => !room.isBooked
    );

    if (!isRoomsAllAvaliable) {
      throw new Error(`Cannot book floor ${floor} for ${guest.name}.`);
    }

    this.roomManager.book(roomsInFloor);
    const bookingHistories: BookingHistory[] = this.bookingHistoryManager.createBookingHistories(
      roomsInFloor,
      guest
    );

    const customerNotCheckIn: BookingHistory[] = bookingHistories.filter(
      bookingHistory => !bookingHistory.isCheckIn
    );
    const isAllRoomsBooked: boolean = customerNotCheckIn.every(
      bookingHistory => bookingHistory.isCheckIn
    );

    if (isAllRoomsBooked) {
      throw new Error(`Guest already booked all rooms in floor.`);
    }

    const checkInHistories: CheckInHistory[] = this.checkInHistoryManager.createCheckInHistories(
      customerNotCheckIn,
      guest,
      this.keyCardManager
    );
    this.checkInHistoryManager.updateCheckInHistories(checkInHistories);

    return { bookingHistories, checkInHistories };
  }

  public bookingConfirmation(roomNo: number, guest: Guest) {
    const bookingHistory: BookingHistory = this.bookRoom(roomNo, guest);
    const checkInHistory: CheckInHistory = this.checkInRoom(roomNo, guest);

    return { bookingHistory, checkInHistory };
  }

  public bookingByFloorConfirmation(
    floor: number,
    guest: Guest
  ): confirmationInfos {
    const bookingHistories: BookingHistory[] = this.bookByFloor(floor, guest);
    const checkInHistories: CheckInHistory[] = this.checkInByFloor(
      floor,
      guest
    );

    return { bookingHistories, checkInHistories };
  }

  public checkOutGuestByFloor(floor: number): Room[] {
    const checkInHistoryByFloor: CheckInHistory[] = this.checkInHistoryManager.getCheckInHistoriesByFloor(
      floor
    );

    if (!this.checkInHistoryManager.isGuestCheckedIn(checkInHistoryByFloor)) {
      throw new Error("Guest can't checkout rooms by floor");
    }

    checkInHistoryByFloor.map(checkInHistory => {
      this.clearRoom(checkInHistory.room, checkInHistory.keyCard);
    });

    return this.checkInHistoryManager.getRoomsFromCheckInHistories(
      checkInHistoryByFloor
    );
  }

  public checkOutRoom(guestName: string, keyCardNo: number): { room: Room } {
    const checkInHistory = this.checkInHistoryManager.getCheckInHistoryByKeycard(
      this.checkInHistoryManager.getCheckInHistoriesByGuestName(guestName),
      keyCardNo
    ) as CheckInHistory;

    if (!this.checkInHistoryManager.isGuestCheckedIn(checkInHistory)) {
      const currentGuestBookedRoom = this.checkInHistoryManager.getCheckInHistoriesByKeyCardNo(
        keyCardNo
      ) as CheckInHistory;

      throw new Error(
        `Only ${
          currentGuestBookedRoom.guest.name
        } can checkout with keycard number ${
          currentGuestBookedRoom.keyCard.no
        }.`
      );
    }

    this.clearRoom(checkInHistory.room, checkInHistory.keyCard);
    return { room: checkInHistory.room };
  }

  public listAvailableRooms(): Room[] | Room {
    return this.roomManager.availableRooms;
  }

  public listCheckInGuest(): Guest[] {
    return this.checkInHistoryManager.getGuestInCheckInHistories;
  }

  public listGuestByAge(condition: string, age: number): Guest[] {
    return this.checkInHistoryManager.getGuestByCondition(checkInHistory => {
      switch (condition) {
        case "<":
          return checkInHistory.guest.age < age;
        case ">":
          return checkInHistory.guest.age > age;
        case "=":
          return checkInHistory.guest.age === age;
        default:
          return;
      }
    });
  }

  public getGuestInRoom(roomNo: number): Guest {
    return this.checkInHistoryManager.getGuestByRoomNo(roomNo);
  }

  public listGuest(): Guest[] {
    return this.listCheckInGuest();
  }

  public listGuestByFloor(floor: number): Guest[] {
    return this.checkInHistoryManager.getGuestByCondition(
      checkInHistory => checkInHistory.room.floor === floor.toString()
    );
  }

  private bookRoom(roomNo: number, guest: Guest): BookingHistory {
    const room = this.roomManager.getRoomByNo(roomNo) as Room;

    if (room.isBooked) {
      const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(
        roomNo
      ) as BookingHistory;

      throw new Error(
        `Cannot book room ${roomNo} for ${
          guest.name
        }, The room is currently booked by ${bookingHistory.guest.name}`
      );
    }

    this.roomManager.book(room);
    const bookingHistory: BookingHistory = this.bookingHistoryManager.createBookingHistory(
      room,
      guest
    );

    return bookingHistory;
  }

  private bookByFloor(floor: number, guest: Guest): BookingHistory[] {
    const roomsInFloor: Room[] = this.getRoomByFloor(floor);
    const isRoomsAllAvaliable: boolean = roomsInFloor.every(
      room => !room.isBooked
    );

    if (!isRoomsAllAvaliable) {
      throw new Error(`Cannot book floor ${floor} for ${guest.name}.`);
    }

    this.roomManager.book(roomsInFloor);
    const bookingHistories: BookingHistory[] = this.bookingHistoryManager.createBookingHistories(
      roomsInFloor,
      guest
    );

    return bookingHistories;
  }

  private checkInByFloor(floor: number, guest: Guest): CheckInHistory[] {
    const bookingHistories: BookingHistory[] = this.bookingHistoryManager.getBookingHistoriesByFloor(
      floor
    );
    const customerNotCheckIn: BookingHistory[] = bookingHistories.filter(
      bookingHistory => !bookingHistory.isCheckIn
    );
    const isAllRoomsBooked: boolean = customerNotCheckIn.every(
      bookingHistory => bookingHistory.isCheckIn
    );

    if (isAllRoomsBooked) {
      throw new Error(`Guest already booked all rooms in floor.`);
    }

    const checkInHistories: CheckInHistory[] = this.checkInHistoryManager.createCheckInHistories(
      customerNotCheckIn,
      guest,
      this.keyCardManager
    );
    this.checkInHistoryManager.updateCheckInHistories(checkInHistories);

    return checkInHistories;
  }

  private checkInRoom(roomNo: number, guest: Guest): CheckInHistory {
    const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(
      roomNo
    ) as BookingHistory;

    if (bookingHistory.isCheckIn) {
      throw new Error(`Guest already checked in in checkin history.`);
    }

    bookingHistory.checkedIn();
    const borrowedKeyCard = this.keyCardManager.borrowKeyCard() as KeyCard;
    const checkInHistory = this.checkInHistoryManager.createCheckInHistory(
      bookingHistory,
      guest,
      borrowedKeyCard
    );
    this.checkInHistoryManager.updateCheckInHistories(checkInHistory);

    return checkInHistory;
  }

  private clearRoom(room: Room, keyCard: KeyCard): Room {
    this.roomManager.makeAvaliable(room);
    this.keyCardManager.returnKeyCard(keyCard.no);
    this.checkInHistoryManager.clearCheckInHistoryByKeyCardNo(keyCard.no);

    return room;
  }

  private getRoomByFloor(floor: number): Room[] {
    return this.roomManager.getRoomByFloor(floor);
  }
}
