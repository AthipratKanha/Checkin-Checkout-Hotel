"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInHistoryManager = void 0;
const CheckInHistory_1 = require("./../CheckInHistory");
class CheckInHistoryManager {
    checkInHistories;
    constructor(checkInHistories = []) {
        this.checkInHistories = checkInHistories;
    }
    get listCheckInHistories() {
        return this.checkInHistories;
    }
    get getGuestInCheckInHistories() {
        return this.checkInHistories.map(checkInHistory => checkInHistory.guest);
    }
    updateCheckInHistories(checkInHistories) {
        return (this.checkInHistories = this.checkInHistories.concat(checkInHistories));
    }
    clearCheckInHistoryByKeyCardNo(keyCardNo) {
        this.checkInHistories = this.checkInHistories.filter(checkInHistory => {
            return checkInHistory.keyCard.no !== keyCardNo;
        });
        return this.checkInHistories;
    }
    getCheckInHistoryByKeycard(checkInHistory, keyCardNo) {
        return checkInHistory.find(checkInHistory => checkInHistory.keyCard.no === keyCardNo);
    }
    getCheckInHistoriesByKeyCardNo(keyCardNo) {
        return this.checkInHistories.find(checkInHistory => checkInHistory.keyCard.no === keyCardNo);
    }
    getCheckInHistoriesByGuestName(guestName) {
        return this.checkInHistories.filter(checkInHistory => checkInHistory.guest.name === guestName);
    }
    getCheckInHistoriesByFloor(floor) {
        return this.checkInHistories.filter(checkInHistory => checkInHistory.room.floor === floor.toString());
    }
    getRoomsFromCheckInHistories(checkInHistories) {
        return checkInHistories.map(checkInHistory => checkInHistory.room);
    }
    getGuestByRoomNo(roomNo) {
        return this.getGuestByCondition(checkInHistory => checkInHistory.room.no === roomNo.toString())[0];
    }
    getGuestByCondition(condition) {
        return this.checkInHistories
            .filter(condition)
            .map(checkInHistory => checkInHistory.guest);
    }
    createCheckInHistory(bookingHistory, guest, keyCard) {
        const checkInHistory = new CheckInHistory_1.CheckInHistory(guest.name, guest.age, bookingHistory.room, keyCard);
        return checkInHistory;
    }
    createCheckInHistories(bookingHistories, guest, keyCardManager) {
        const checkInHistories = [];
        bookingHistories.map(bookingHistory => {
            bookingHistory.checkedIn();
            const guestBorrowKeyCard = keyCardManager.borrowKeyCard();
            const checkInHistory = this.createCheckInHistory(bookingHistory, guest, guestBorrowKeyCard);
            checkInHistories.push(checkInHistory);
        });
        return checkInHistories;
    }
    isGuestCheckedIn(checkInHistory) {
        return checkInHistory !== undefined;
    }
}
exports.CheckInHistoryManager = CheckInHistoryManager;
