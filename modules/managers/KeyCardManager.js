"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyCardManager = void 0;
const KeyCard_1 = require("../KeyCard");
class KeyCardManager {
    keyCards;
    constructor(keycardCount) {
        this.keyCards = this.createKeyCards(keycardCount);
    }
    get listKeyCard() {
        return this.keyCards;
    }
    createKeyCards(keycardCount) {
        return Array.from({ length: keycardCount }, (_, KeyCardindex) => {
            const KeyCardNo = KeyCardindex + 1;
            return new KeyCard_1.KeyCard(KeyCardNo);
        }).reverse();
    }
    borrowKeyCard() {
        return this.keyCards.pop();
    }
    returnKeyCard(keyCardNo) {
        return this.keyCards.push(new KeyCard_1.KeyCard(keyCardNo));
    }
}
exports.KeyCardManager = KeyCardManager;
