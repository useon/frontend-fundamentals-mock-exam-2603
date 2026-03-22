export type Equipment = 'tv' | 'whiteboard' | 'video' | 'speaker';

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export interface BookingFilters {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export interface CreateReservationRequest {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export interface CreateReservationSuccessResponse {
  ok: true;
  reservation: Reservation;
}

export interface CreateReservationErrorResponse {
  ok: false;
  code: 'CONFLICT' | 'INVALID' | 'NOT_FOUND';
  message: string;
}

export type CreateReservationResponse =
  | CreateReservationSuccessResponse
  | CreateReservationErrorResponse;
