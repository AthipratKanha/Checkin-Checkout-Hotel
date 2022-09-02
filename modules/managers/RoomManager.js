"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const Room_1 = require("./../Room");
class RoomManager {
    rooms;
    constructor(floorCount, roomPerFloorCount) {
        this.rooms = this.createRooms(floorCount, roomPerFloorCount);
    }
    get listRoom() {
        return this.rooms;
    }
    book(rooms) {
        try {
            rooms.map(room => room.book());
        }
        catch (error) {
            rooms.book();
        }
    }
    createRooms(floorCount, roomPerFloorCount) {
        return Array.from({ length: floorCount }, (_, indexFloor) => Array.from({ length: roomPerFloorCount }, (_, indexRoom) => {
            const roomNo = indexRoom + 1;
            const floorNo = indexFloor + 1;
            return new Room_1.Room(floorNo.toString() + roomNo.toString().padStart(2, "0"));
        })).flat();
    }
    getRoomByFloor(floor) {
        return this.rooms.filter(room => room.floor === floor.toString());
    }
    getRoomByNo(roomNo) {
        return this.rooms.find(room => room.no === roomNo.toString());
    }
    makeAvaliable(room) {
        return (room.isBooked = false);
    }
    get availableRooms() {
        return this.rooms.filter(room => !room.isBooked);
    }
}
exports.RoomManager = RoomManager;
