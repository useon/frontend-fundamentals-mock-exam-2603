import { BookingFilters, Reservation, Room } from './types';

export function validateBookingFilters(filters: Pick<BookingFilters, 'startTime' | 'endTime' | 'attendees'>) {
  if (filters.startTime === '' || filters.endTime === '') {
    return null;
  }

  if (filters.endTime <= filters.startTime) {
    return '종료 시간은 시작 시간보다 늦어야 합니다.';
  }

  if (filters.attendees < 1) {
    return '참석 인원은 1명 이상이어야 합니다.';
  }

  return null;
}

export function isBookingFilterComplete(filters: Pick<BookingFilters, 'startTime' | 'endTime'>) {
  return filters.startTime !== '' && filters.endTime !== '';
}

export function sortRoomsByFloorAndName(rooms: Room[]) {
  return [...rooms].sort((a, b) => {
    if (a.floor !== b.floor) {
      return a.floor - b.floor;
    }

    return a.name.localeCompare(b.name);
  });
}

export function getAvailableRooms(rooms: Room[], reservations: Reservation[], filters: BookingFilters) {
  return sortRoomsByFloorAndName(
    rooms.filter(room => {
      if (room.capacity < filters.attendees) return false;
      if (!filters.equipment.every(equipment => room.equipment.includes(equipment))) return false;
      if (filters.preferredFloor !== null && room.floor !== filters.preferredFloor) return false;

      const hasConflict = reservations.some(
        reservation =>
          reservation.roomId === room.id &&
          reservation.date === filters.date &&
          reservation.start < filters.endTime &&
          reservation.end > filters.startTime
      );

      return !hasConflict;
    })
  );
}

export function getAvailableFloors(rooms: Room[]) {
  return [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);
}
