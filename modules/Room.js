"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    no;
    floor;
    isBooked;
    constructor(roomNo) {
        this.no = roomNo;
        this.floor = roomNo.substr(0, 1);
        this.isBooked = false;
    }
    book() {
        this.isBooked = true;
    }
}
exports.Room = Room;
