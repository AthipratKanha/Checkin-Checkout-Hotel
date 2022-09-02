import { CheckInHistory } from "./../CheckInHistory";
import { KeyCardManager } from "./KeyCardManager";
import { KeyCard } from "./../KeyCard";
import { Room } from "../Room";
import { BookingHistory } from "../BookingHistory";
import { Guest } from "../Guest";
export class CheckInHistoryManager {
  constructor(public checkInHistories: CheckInHistory[] = []) {}
  public get listCheckInHistories(): CheckInHistory[] {
    return this.checkInHistories;
  }

  public get getGuestInCheckInHistories(): Guest[] {
    return this.checkInHistories.map(checkInHistory => checkInHistory.guest);
  }

  public updateCheckInHistories(
    checkInHistories: CheckInHistory[] | CheckInHistory
  ): CheckInHistory[] {
    return (this.checkInHistories = this.checkInHistories.concat(
      checkInHistories
    ));
  }

  public clearCheckInHistoryByKeyCardNo(keyCardNo: number): CheckInHistory[] {
    this.checkInHistories = this.checkInHistories.filter(checkInHistory => {
      return checkInHistory.keyCard.no !== keyCardNo;
    });
    return this.checkInHistories;
  }

  public getCheckInHistoryByKeycard(
    checkInHistory: CheckInHistory[],
    keyCardNo: number
  ): CheckInHistory | undefined {
    return checkInHistory.find(
      checkInHistory => checkInHistory.keyCard.no === keyCardNo
    );
  }

  public getCheckInHistoriesByKeyCardNo(
    keyCardNo: number
  ): CheckInHistory | undefined {
    return this.checkInHistories.find(
      checkInHistory => checkInHistory.keyCard.no === keyCardNo
    );
  }

  public getCheckInHistoriesByGuestName(guestName: string): CheckInHistory[] {
    return this.checkInHistories.filter(
      checkInHistory => checkInHistory.guest.name === guestName
    );
  }

  public getCheckInHistoriesByFloor(floor: number): CheckInHistory[] {
    return this.checkInHistories.filter(
      checkInHistory => checkInHistory.room.floor === floor.toString()
    );
  }

  public getRoomsFromCheckInHistories(
    checkInHistories: CheckInHistory[]
  ): Room[] {
    return checkInHistories.map(checkInHistory => checkInHistory.room);
  }

  public getGuestByRoomNo(roomNo: number): Guest {
    return this.getGuestByCondition(
      checkInHistory => checkInHistory.room.no === roomNo.toString()
    )[0];
  }

  public getGuestByCondition(
    condition: (checkInHistory: CheckInHistory) => boolean | undefined
  ): Guest[] {
    return this.checkInHistories
      .filter(condition)
      .map(checkInHistory => checkInHistory.guest);
  }

  public createCheckInHistory(
    bookingHistory: BookingHistory,
    guest: Guest,
    keyCard: KeyCard
  ): CheckInHistory {
    const checkInHistory = new CheckInHistory(
      guest.name,
      guest.age,
      bookingHistory.room,
      keyCard
    );

    return checkInHistory;
  }

  public createCheckInHistories(
    bookingHistories: BookingHistory[],
    guest: Guest,
    keyCardManager: KeyCardManager
  ): CheckInHistory[] {
    const checkInHistories: CheckInHistory[] = [];

    bookingHistories.map(bookingHistory => {
      bookingHistory.checkedIn();
      const guestBorrowKeyCard = keyCardManager.borrowKeyCard() as KeyCard;
      const checkInHistory: CheckInHistory = this.createCheckInHistory(
        bookingHistory,
        guest,
        guestBorrowKeyCard
      );
      checkInHistories.push(checkInHistory);
    });
    return checkInHistories;
  }

  public isGuestCheckedIn(
    checkInHistory: CheckInHistory[] | CheckInHistory | undefined
  ): boolean {
    return checkInHistory !== undefined;
  }
}
