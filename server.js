"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const BookingService_1 = require("./modules/BookingService");
const Guest_1 = require("./modules/Guest");
const app = (0, express_1.default)();
const port = 3000;
var bookingService;
app.use(bodyParser.json());
app.get("/", (req, res) => res.send({ message: "Hello, welcome to booking service." }));
app.get("/hello/:test", (req, res) => {
    const { test: hello } = req.params;
    console.log(hello);
    res.send({ message: "Hello, welcome to booking service." });
});
app.get("/hello-test/:test", (req, res) => {
    const { ip: hello, pi: snow } = req.query;
    console.log(hello);
    console.log(snow);
    res.send({ message: "Hello, snow is coming" });
});
app.post("/create_hotel", (req, res) => {
    const { floor, roomPerFloor } = req.body;
    bookingService = new BookingService_1.BookingService(floor, roomPerFloor);
    res.send(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
});
//warning
app.post("/book", (req, res) => {
    const { roomNo, guestName, guestAge } = req.body;
    const guest = new Guest_1.Guest(guestName, guestAge);
    try {
        const confirmationInfo = bookingService.bookingApplication(roomNo, guest);
        res.send(`Room ${roomNo} is booked by ${guest.name} with keycard number ${confirmationInfo.checkInHistory.keyCard.no}.`);
    }
    catch (error) {
        res.send(error.message);
    }
});
app.post("/checkout", (req, res) => {
    const { keyCardNo, guestName } = req.body;
    try {
        const confirmationInfo = bookingService.checkOutRoom(guestName, keyCardNo);
        res.send(`Room ${confirmationInfo.room.no} is checkout.`);
    }
    catch (error) {
        res.send(error.message);
    }
});
app.get("/list_available_rooms", (req, res) => {
    const rooms = bookingService.listAvailableRooms();
    res.json(rooms);
});
app.get("/list_guest", (req, res) => {
    const guests = bookingService.listGuest();
    res.json(guests);
});
//warning
app.get("/get_guest_in_room/:roomNo", (req, res) => {
    const { roomNo } = req.params;
    const guest = bookingService.getGuestInRoom(roomNo);
    res.send(guest.name);
});
//warning
app.get("/list_guest_by_age/:condition/:age", (req, res) => {
    const { condition, age } = req.params;
    const guests = bookingService.listGuestByAge(condition, age);
    res.json(guests.map(guest => guest.name));
});
//warning
app.get("/list_guest_by_floor/:floor", (req, res) => {
    const { floor } = req.params;
    const guests = bookingService.listGuestByFloor(floor);
    res.json(guests);
});
//warning
app.get("/checkout_guest_by_floor/:floor", (req, res) => {
    const [floor] = req.params;
    try {
        const confirmationInfo = bookingService.checkOutGuestByFloor(floor);
        res.send(`Room ${confirmationInfo.map(room => room.no).join(", ")} are checkout.`);
    }
    catch (error) {
        res.send(error.message);
    }
});
//warning
app.get("/book_by_floor/:floor/:guestName/:guestAge", (req, res) => {
    const [floor, guestName, guestAge] = req.params;
    const guest = new Guest_1.Guest(guestName, guestAge);
    try {
        const confirmationInfo = bookingService.bookingByFloorApplication(floor, guest);
        res.send(`Room ${confirmationInfo.checkInHistories
            .map(checkInHistory => checkInHistory.room.no)
            .join(", ")} is booked by ${guest.name} with keycard number ${confirmationInfo.checkInHistories
            .map(checkInHistory => checkInHistory.keyCard.no)
            .sort()
            .join(", ")}.`);
    }
    catch (error) {
        res.send(error.message);
    }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
