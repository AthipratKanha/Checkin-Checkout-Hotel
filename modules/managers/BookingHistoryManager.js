"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingHistoryManager = void 0;
const BookingHistory_1 = require("../BookingHistory");
class BookingHistoryManager {
    bookingHistories;
    constructor(bookingHistories = []) {
        this.bookingHistories = bookingHistories;
    }
    createBookingHistories(rooms, guest) {
        const bookingHistories = [];
        rooms.map(room => {
            const bookingHistory = this.createBookingHistory(room, guest);
            bookingHistories.push(bookingHistory);
        });
        return bookingHistories;
    }
    getBookingHistoryByRoomNo(roomNo) {
        return this.bookingHistories.find(book => book.room.no === roomNo.toString());
    }
    getBookingHistoriesByFloor(floor) {
        return this.bookingHistories.filter(bookingHistory => bookingHistory.room.floor === floor.toString());
    }
    createBookingHistory(room, guest) {
        const bookingHistory = new BookingHistory_1.BookingHistory(guest.name, guest.age, room);
        this.bookingHistories.push(bookingHistory);
        return bookingHistory;
    }
}
exports.BookingHistoryManager = BookingHistoryManager;
