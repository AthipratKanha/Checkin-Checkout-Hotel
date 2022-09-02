"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const Guest_1 = require("./Guest");
class Document {
    room;
    guest;
    constructor(name, age, room) {
        this.room = room;
        this.guest = new Guest_1.Guest(name, age);
        this.room = room;
    }
}
exports.Document = Document;
