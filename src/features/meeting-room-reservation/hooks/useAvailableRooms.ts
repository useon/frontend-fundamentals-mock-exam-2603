import {
  getAvailableFloors,
  getAvailableRooms,
  isBookingFilterComplete,
  validateBookingFilters,
} from '../model/filters';
import { BookingFilters, Reservation, Room } from '../model/types';

export function useAvailableRooms({
  rooms,
  reservations,
  filters,
}: {
  rooms: Room[];
  reservations: Reservation[];
  filters: BookingFilters;
}) {
  const validationError = validateBookingFilters(filters);
  const isFilterComplete = isBookingFilterComplete(filters) && !validationError;
  const floors = getAvailableFloors(rooms);
  const availableRooms = isFilterComplete ? getAvailableRooms(rooms, reservations, filters) : [];

  return {
    validationError,
    isFilterComplete,
    floors,
    availableRooms,
  };
}
