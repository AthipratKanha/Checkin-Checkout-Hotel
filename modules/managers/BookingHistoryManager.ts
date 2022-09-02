import { BookingHistory } from "../BookingHistory";
import { Room } from "../Room";
import { Guest } from "../Guest";

export class BookingHistoryManager {
  constructor(private bookingHistories: BookingHistory[] = []) {}

  public createBookingHistories(rooms: Room[], guest: Guest): BookingHistory[] {
    const bookingHistories: BookingHistory[] = [];
    rooms.map(room => {
      const bookingHistory = this.createBookingHistory(room, guest);
      bookingHistories.push(bookingHistory);
    });

    return bookingHistories;
  }

  public getBookingHistoryByRoomNo(roomNo: number): BookingHistory | undefined {
    return this.bookingHistories.find(
      book => book.room.no === roomNo.toString()
    );
  }

  public getBookingHistoriesByFloor(floor: number): BookingHistory[] {
    return this.bookingHistories.filter(
      bookingHistory => bookingHistory.room.floor === floor.toString()
    );
  }

  public createBookingHistory(room: Room, guest: Guest): BookingHistory {
    const bookingHistory = new BookingHistory(guest.name, guest.age, room);
    this.bookingHistories.push(bookingHistory);
    return bookingHistory;
  }
}
