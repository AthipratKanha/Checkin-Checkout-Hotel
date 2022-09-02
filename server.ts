import express, { Request, Response } from "express";
import bodyParser = require("body-parser");
import { BookingService } from "./modules/BookingService";
import { Guest } from "./modules/Guest";

const app = express();
const port = 3000;

var bookingService: BookingService;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) =>
  res.send({ message: "Hello, welcome to booking service." })
);
app.get("/hello/:test", (req: Request, res: Response) => {
  const { test: hello } = req.params;
  console.log(hello);
  res.send({ message: "Hello, welcome to booking service." });
});
app.get("/hello-test/:test", (req: Request, res: Response) => {
  const { ip: hello, pi: snow } = req.query;
  console.log(hello);
  console.log(snow);
  res.send({ message: "Hello, snow is coming" });
});
app.post("/create_hotel", (req: Request, res: Response) => {
  const { floor, roomPerFloor } = req.body;
  bookingService = new BookingService(floor, roomPerFloor);

  res.send(
    `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
  );
});
//warning
app.post("/book", (req: Request, res: Response) => {
  const { roomNo, guestName, guestAge } = req.body;
  const guest = new Guest(<string>guestName, <number>guestAge);

  try {
    const confirmationInfo = bookingService.bookingApplication(
      <number>roomNo,
      guest
    );

    res.send(
      `Room ${roomNo} is booked by ${guest.name} with keycard number ${
        confirmationInfo.checkInHistory.keyCard.no
      }.`
    );
  } catch (error) {
    res.send(error.message);
  }
});
app.post("/checkout", (req: Request, res: Response) => {
  const { keyCardNo, guestName } = req.body;

  try {
    const confirmationInfo = bookingService.checkOutRoom(
      <string>guestName,
      <number>keyCardNo
    );

    res.send(`Room ${confirmationInfo.room.no} is checkout.`);
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/list_available_rooms", (req: Request, res: Response) => {
  const rooms = bookingService.listAvailableRooms();

  res.json(rooms);
});

app.get("/list_guest", (req: Request, res: Response) => {
  const guests = bookingService.listGuest();

  res.json(guests);
});
//warning
app.get("/get_guest_in_room/:roomNo", (req: Request, res: Response) => {
  const { roomNo } = req.params;

  const guest = bookingService.getGuestInRoom(<number>roomNo);

  res.send(guest.name);
});
//warning
app.get("/list_guest_by_age/:condition/:age", (req: Request, res: Response) => {
  const { condition, age } = req.params;

  const guests = bookingService.listGuestByAge(<string>condition, <number>age);

  res.json(guests.map(guest => guest.name));
});
//warning
app.get("/list_guest_by_floor/:floor", (req: Request, res: Response) => {
  const { floor } = req.params;

  const guests = bookingService.listGuestByFloor(<number>floor);

  res.json(guests);
});
//warning
app.get("/checkout_guest_by_floor/:floor", (req: Request, res: Response) => {
  const [floor] = req.params;

  try {
    const confirmationInfo = bookingService.checkOutGuestByFloor(<number>floor);
    res.send(
      `Room ${confirmationInfo.map(room => room.no).join(", ")} are checkout.`
    );
  } catch (error) {
    res.send(error.message);
  }
});
//warning
app.get(
  "/book_by_floor/:floor/:guestName/:guestAge",
  (req: Request, res: Response) => {
    const [floor, guestName, guestAge] = req.params;
    const guest = new Guest(<string>guestName, <number>guestAge);

    try {
      const confirmationInfo = bookingService.bookingByFloorApplication(
        <number>floor,
        guest
      );

      res.send(
        `Room ${confirmationInfo.checkInHistories
          .map(checkInHistory => checkInHistory.room.no)
          .join(", ")} is booked by ${
          guest.name
        } with keycard number ${confirmationInfo.checkInHistories
          .map(checkInHistory => checkInHistory.keyCard.no)
          .sort()
          .join(", ")}.`
      );
    } catch (error) {
      res.send(error.message);
    }
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
