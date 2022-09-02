import { BookingService } from "./modules/BookingService";
import { Guest } from "./modules/Guest";
import { Room } from "./modules/Room";

import * as fs from "fs";
const fileName: string = "input.txt";

class Command {
  constructor(public name: string, public params: (string | number)[]) {
    this.name = name;
    this.params = params;
  }
}

function getCommandFromFileName(fileName: string) {
  const file: string = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map(line => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map(param => {
            const parsedParam: number = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    )
    .reduce(function(allElement: Command[], element) {
      return allElement.concat(element);
    }, []);
}

function main() {
  var bookingService: BookingService;
  const commands: Command[] = getCommandFromFileName(fileName);

  commands.forEach(command => {
    switch (command.name) {
      case "create_hotel": {
        const [floor, roomPerFloor] = command.params as [number, number];

        bookingService = new BookingService(floor, roomPerFloor);

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      }
      case "book": {
        const [roomNo, guestName, guestAge] = command.params as [
          number,
          string,
          number
        ];
        const guest = new Guest(guestName, guestAge);

        try {
          const confirmationInfo = bookingService.bookingApplication(
            roomNo,
            guest
          );

          console.log(
            `Room ${roomNo} is booked by ${guest.name} with keycard number ${
              confirmationInfo.checkInHistory.keyCard.no
            }.`
          );
        } catch (error) {
          console.log(error.message);
        }

        return;
      }
      case "checkout": {
        const [keyCardNo, guestName] = command.params as [number, string];

        try {
          const confirmationInfo = bookingService.checkOutRoom(
            guestName,
            keyCardNo
          );

          console.log(`Room ${confirmationInfo.room.no} is checkout.`);
        } catch (error) {
          console.log(error.message);
        }

        return;
      }
      case "list_available_rooms": {
        const rooms = bookingService.listAvailableRooms() as Room[];

        console.log(rooms.map(room => room.no).join(", "));
        return;
      }
      case "list_guest": {
        const guests = bookingService.listGuest();

        console.log(guests.map(guest => guest.name).join(", "));
        return;
      }
      case "get_guest_in_room": {
        const [roomNo] = command.params as [number];

        const guest = bookingService.getGuestInRoom(roomNo);

        console.log(guest.name);
        return;
      }
      case "list_guest_by_age": {
        const [condition, age] = command.params as [string, number];

        const guests = bookingService.listGuestByAge(condition, age);

        console.log(guests.map(guest => guest.name).join(", "));
        return;
      }
      case "list_guest_by_floor": {
        const [floor] = command.params as [number];

        const guests = bookingService.listGuestByFloor(floor);

        console.log(guests.map(guest => guest.name).join(", "));
        return;
      }
      case "checkout_guest_by_floor": {
        const [floor] = command.params as [number];

        try {
          const confirmationInfo = bookingService.checkOutGuestByFloor(floor);
          console.log(
            `Room ${confirmationInfo
              .map(room => room.no)
              .join(", ")} are checkout.`
          );
        } catch (error) {
          console.log(error.message);
        }
        return;
      }
      case "book_by_floor": {
        const [floor, guestName, guestAge] = command.params as [
          number,
          string,
          number
        ];
        const guest = new Guest(guestName, guestAge);

        try {
          const confirmationInfo = bookingService.bookingByFloorApplication(
            floor,
            guest
          );

          console.log(
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
