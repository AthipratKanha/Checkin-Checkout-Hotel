"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const BookingHistoryManager_1 = require("./managers/BookingHistoryManager");
const CheckInHistoryManager_1 = require("./managers/CheckInHistoryManager");
const KeyCardManager_1 = require("./managers/KeyCardManager");
const RoomManager_1 = require("./managers/RoomManager");
class BookingService {
    keyCardManager;
    roomManager;
    bookingHistoryManager = new BookingHistoryManager_1.BookingHistoryManager();
    checkInHistoryManager = new CheckInHistoryManager_1.CheckInHistoryManager();
    constructor(floorCount, roomPerFloorCount) {
        this.keyCardManager = new KeyCardManager_1.KeyCardManager(floorCount * roomPerFloorCount);
        this.roomManager = new RoomManager_1.RoomManager(floorCount, roomPerFloorCount);
    }
    bookingApplication(roomNo, guest) {
        const room = this.roomManager.getRoomByNo(roomNo);
        if (room.isBooked) {
            const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(roomNo);
            throw new Error(`Cannot book room ${roomNo} for ${guest.name}, The room is currently booked by ${bookingHistory.guest.name}`);
        }
        this.roomManager.book(room);
        const bookingHistory = this.bookingHistoryManager.createBookingHistory(room, guest);
        if (bookingHistory.isCheckIn) {
            throw new Error(`Guest already checked in in checkin history.`);
        }
        bookingHistory.checkedIn();
        const borrowedKeyCard = this.keyCardManager.borrowKeyCard();
        const checkInHistory = this.checkInHistoryManager.createCheckInHistory(bookingHistory, guest, borrowedKeyCard);
        this.checkInHistoryManager.updateCheckInHistories(checkInHistory);
        return { bookingHistory, checkInHistory };
    }
    bookingByFloorApplication(floor, guest) {
        const roomsInFloor = this.getRoomByFloor(floor);
        const isRoomsAllAvaliable = roomsInFloor.every(room => !room.isBooked);
        if (!isRoomsAllAvaliable) {
            throw new Error(`Cannot book floor ${floor} for ${guest.name}.`);
        }
        this.roomManager.book(roomsInFloor);
        const bookingHistories = this.bookingHistoryManager.createBookingHistories(roomsInFloor, guest);
        const customerNotCheckIn = bookingHistories.filter(bookingHistory => !bookingHistory.isCheckIn);
        const isAllRoomsBooked = customerNotCheckIn.every(bookingHistory => bookingHistory.isCheckIn);
        if (isAllRoomsBooked) {
            throw new Error(`Guest already booked all rooms in floor.`);
        }
        const checkInHistories = this.checkInHistoryManager.createCheckInHistories(customerNotCheckIn, guest, this.keyCardManager);
        this.checkInHistoryManager.updateCheckInHistories(checkInHistories);
        return { bookingHistories, checkInHistories };
    }
    bookingConfirmation(roomNo, guest) {
        const bookingHistory = this.bookRoom(roomNo, guest);
        const checkInHistory = this.checkInRoom(roomNo, guest);
        return { bookingHistory, checkInHistory };
    }
    bookingByFloorConfirmation(floor, guest) {
        const bookingHistories = this.bookByFloor(floor, guest);
        const checkInHistories = this.checkInByFloor(floor, guest);
        return { bookingHistories, checkInHistories };
    }
    checkOutGuestByFloor(floor) {
        const checkInHistoryByFloor = this.checkInHistoryManager.getCheckInHistoriesByFloor(floor);
        if (!this.checkInHistoryManager.isGuestCheckedIn(checkInHistoryByFloor)) {
            throw new Error("Guest can't checkout rooms by floor");
        }
        checkInHistoryByFloor.map(checkInHistory => {
            this.clearRoom(checkInHistory.room, checkInHistory.keyCard);
        });
        return this.checkInHistoryManager.getRoomsFromCheckInHistories(checkInHistoryByFloor);
    }
    checkOutRoom(guestName, keyCardNo) {
        const checkInHistory = this.checkInHistoryManager.getCheckInHistoryByKeycard(this.checkInHistoryManager.getCheckInHistoriesByGuestName(guestName), keyCardNo);
        if (!this.checkInHistoryManager.isGuestCheckedIn(checkInHistory)) {
            const currentGuestBookedRoom = this.checkInHistoryManager.getCheckInHistoriesByKeyCardNo(keyCardNo);
            throw new Error(`Only ${currentGuestBookedRoom.guest.name} can checkout with keycard number ${currentGuestBookedRoom.keyCard.no}.`);
        }
        this.clearRoom(checkInHistory.room, checkInHistory.keyCard);
        return { room: checkInHistory.room };
    }
    listAvailableRooms() {
        return this.roomManager.availableRooms;
    }
    listCheckInGuest() {
        return this.checkInHistoryManager.getGuestInCheckInHistories;
    }
    listGuestByAge(condition, age) {
        return this.checkInHistoryManager.getGuestByCondition(checkInHistory => {
            switch (condition) {
                case "<":
                    return checkInHistory.guest.age < age;
                case ">":
                    return checkInHistory.guest.age > age;
                case "=":
                    return checkInHistory.guest.age === age;
                default:
                    return;
            }
        });
    }
    getGuestInRoom(roomNo) {
        return this.checkInHistoryManager.getGuestByRoomNo(roomNo);
    }
    listGuest() {
        return this.listCheckInGuest();
    }
    listGuestByFloor(floor) {
        return this.checkInHistoryManager.getGuestByCondition(checkInHistory => checkInHistory.room.floor === floor.toString());
    }
    bookRoom(roomNo, guest) {
        const room = this.roomManager.getRoomByNo(roomNo);
        if (room.isBooked) {
            const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(roomNo);
            throw new Error(`Cannot book room ${roomNo} for ${guest.name}, The room is currently booked by ${bookingHistory.guest.name}`);
        }
        this.roomManager.book(room);
        const bookingHistory = this.bookingHistoryManager.createBookingHistory(room, guest);
        return bookingHistory;
    }
    bookByFloor(floor, guest) {
        const roomsInFloor = this.getRoomByFloor(floor);
        const isRoomsAllAvaliable = roomsInFloor.every(room => !room.isBooked);
        if (!isRoomsAllAvaliable) {
            throw new Error(`Cannot book floor ${floor} for ${guest.name}.`);
        }
        this.roomManager.book(roomsInFloor);
        const bookingHistories = this.bookingHistoryManager.createBookingHistories(roomsInFloor, guest);
        return bookingHistories;
    }
    checkInByFloor(floor, guest) {
        const bookingHistories = this.bookingHistoryManager.getBookingHistoriesByFloor(floor);
        const customerNotCheckIn = bookingHistories.filter(bookingHistory => !bookingHistory.isCheckIn);
        const isAllRoomsBooked = customerNotCheckIn.every(bookingHistory => bookingHistory.isCheckIn);
        if (isAllRoomsBooked) {
            throw new Error(`Guest already booked all rooms in floor.`);
        }
        const checkInHistories = this.checkInHistoryManager.createCheckInHistories(customerNotCheckIn, guest, this.keyCardManager);
        this.checkInHistoryManager.updateCheckInHistories(checkInHistories);
        return checkInHistories;
    }
    checkInRoom(roomNo, guest) {
        const bookingHistory = this.bookingHistoryManager.getBookingHistoryByRoomNo(roomNo);
        if (bookingHistory.isCheckIn) {
            throw new Error(`Guest already checked in in checkin history.`);
        }
        bookingHistory.checkedIn();
        const borrowedKeyCard = this.keyCardManager.borrowKeyCard();
        const checkInHistory = this.checkInHistoryManager.createCheckInHistory(bookingHistory, guest, borrowedKeyCard);
        this.checkInHistoryManager.updateCheckInHistories(checkInHistory);
        return checkInHistory;
    }
    clearRoom(room, keyCard) {
        this.roomManager.makeAvaliable(room);
        this.keyCardManager.returnKeyCard(keyCard.no);
        this.checkInHistoryManager.clearCheckInHistoryByKeyCardNo(keyCard.no);
        return room;
    }
    getRoomByFloor(floor) {
        return this.roomManager.getRoomByFloor(floor);
    }
}
exports.BookingService = BookingService;
