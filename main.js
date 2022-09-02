"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BookingService_1 = require("./modules/BookingService");
const Guest_1 = require("./modules/Guest");
const fs = __importStar(require("fs"));
const fileName = "input.txt";
class Command {
    name;
    params;
    constructor(name, params) {
        this.name = name;
        this.params = params;
        this.name = name;
        this.params = params;
    }
}
function getCommandFromFileName(fileName) {
    const file = fs.readFileSync(fileName, "utf-8");
    return file
        .split("\n")
        .map(line => line.split(" "))
        .map(([commandName, ...params]) => new Command(commandName, params.map(param => {
        const parsedParam = parseInt(param, 10);
        return Number.isNaN(parsedParam) ? param : parsedParam;
    })))
        .reduce(function (allElement, element) {
        return allElement.concat(element);
    }, []);
}
function main() {
    var bookingService;
    const commands = getCommandFromFileName(fileName);
    commands.forEach(command => {
        switch (command.name) {
            case "create_hotel": {
                const [floor, roomPerFloor] = command.params;
                bookingService = new BookingService_1.BookingService(floor, roomPerFloor);
                console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
                return;
            }
            case "book": {
                const [roomNo, guestName, guestAge] = command.params;
                const guest = new Guest_1.Guest(guestName, guestAge);
                try {
                    const confirmationInfo = bookingService.bookingApplication(roomNo, guest);
                    console.log(`Room ${roomNo} is booked by ${guest.name} with keycard number ${confirmationInfo.checkInHistory.keyCard.no}.`);
                }
                catch (error) {
                    console.log(error.message);
                }
                return;
            }
            case "checkout": {
                const [keyCardNo, guestName] = command.params;
                try {
                    const confirmationInfo = bookingService.checkOutRoom(guestName, keyCardNo);
                    console.log(`Room ${confirmationInfo.room.no} is checkout.`);
                }
                catch (error) {
                    console.log(error.message);
                }
                return;
            }
            case "list_available_rooms": {
                const rooms = bookingService.listAvailableRooms();
                console.log(rooms.map(room => room.no).join(", "));
                return;
            }
            case "list_guest": {
                const guests = bookingService.listGuest();
                console.log(guests.map(guest => guest.name).join(", "));
                return;
            }
            case "get_guest_in_room": {
                const [roomNo] = command.params;
                const guest = bookingService.getGuestInRoom(roomNo);
                console.log(guest.name);
                return;
            }
            case "list_guest_by_age": {
                const [condition, age] = command.params;
                const guests = bookingService.listGuestByAge(condition, age);
                console.log(guests.map(guest => guest.name).join(", "));
                return;
            }
            case "list_guest_by_floor": {
                const [floor] = command.params;
                const guests = bookingService.listGuestByFloor(floor);
                console.log(guests.map(guest => guest.name).join(", "));
                return;
            }
            case "checkout_guest_by_floor": {
                const [floor] = command.params;
                try {
                    const confirmationInfo = bookingService.checkOutGuestByFloor(floor);
                    console.log(`Room ${confirmationInfo
                        .map(room => room.no)
                        .join(", ")} are checkout.`);
                }
                catch (error) {
                    console.log(error.message);
                }
                return;
            }
            case "book_by_floor": {
                const [floor, guestName, guestAge] = command.params;
                const guest = new Guest_1.Guest(guestName, guestAge);
                try {
                    const confirmationInfo = bookingService.bookingByFloorApplication(floor, guest);
                    console.log(`Room ${confirmationInfo.checkInHistories
                        .map(checkInHistory => checkInHistory.room.no)
                        .join(", ")} is booked by ${guest.name} with keycard number ${confirmationInfo.checkInHistories
                        .map(checkInHistory => checkInHistory.keyCard.no)
                        .sort()
                        .join(", ")}.`);
                }
                catch (error) {
                    console.log(error.message);
                }
                return;
            }
            default:
                return;
        }
    });
}
main();
