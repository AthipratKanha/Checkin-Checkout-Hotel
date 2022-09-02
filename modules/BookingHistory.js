"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingHistory = void 0;
const Document_1 = require("./Document");
class BookingHistory extends Document_1.Document {
    isCheckIn;
    constructor(name, age, room) {
        super(name, age, room);
        this.isCheckIn = false;
    }
    checkedIn() {
        this.isCheckIn = true;
    }
}
exports.BookingHistory = BookingHistory;
