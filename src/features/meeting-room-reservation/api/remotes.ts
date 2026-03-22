import { http } from './http';
import {
  CreateReservationRequest,
  CreateReservationResponse,
  Reservation,
  Room,
} from '../model/types';

export function getRooms() {
  return http.get<Room[]>('/api/rooms');
}

export function getReservations(date: string) {
  return http.get<Reservation[]>(`/api/reservations?date=${date}`);
}

export function createReservation(data: CreateReservationRequest) {
  return http.post<CreateReservationRequest, CreateReservationResponse>('/api/reservations', data);
}

export function getMyReservations() {
  return http.get<Reservation[]>('/api/my-reservations');
}

export function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}
