"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
class Hotel {
    floorCount;
    roomPerFloorCount;
    roomCount;
    constructor(floorCount, roomPerFloorCount) {
        this.floorCount = floorCount;
        this.roomPerFloorCount = roomPerFloorCount;
        this.roomCount = floorCount * roomPerFloorCount;
    }
}
exports.Hotel = Hotel;
