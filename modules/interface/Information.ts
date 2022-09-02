import { BookingHistory } from "../BookingHistory";
import { CheckInHistory } from "../CheckInHistory";

export interface confirmationInfo {
  bookingHistory: BookingHistory;
  checkInHistory: CheckInHistory;
}

export interface confirmationInfos {
  bookingHistories: BookingHistory[];
  checkInHistories: CheckInHistory[];
}
