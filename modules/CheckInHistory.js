"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInHistory = void 0;
const Document_1 = require("./Document");
class CheckInHistory extends Document_1.Document {
    keyCard;
    constructor(name, age, room, keyCard) {
        super(name, age, room);
        this.keyCard = keyCard;
        this.keyCard = keyCard;
    }
}
exports.CheckInHistory = CheckInHistory;
