import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { getMyReservations, getReservations, getRooms } from '../api/remotes';
import { formatDate } from '../lib/time';
import { Room } from '../model/types';

export function useReservationStatusQuery() {
  const [date, setDate] = useState(formatDate(new Date()));
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(meetingRoomReservationQueryKeys.rooms(), getRooms);
  const { data: reservations = [] } = useQuery(
    meetingRoomReservationQueryKeys.reservations(date),
    () => getReservations(date),
    {
      enabled: !!date,
    }
  );
  const { data: myReservationList = [] } = useQuery(
    meetingRoomReservationQueryKeys.myReservations(),
    getMyReservations
  );

  const toggleActiveReservation = (reservationId: string) => {
    setActiveReservationId(currentReservationId =>
      currentReservationId === reservationId ? null : reservationId
    );
  };

  const getRoomName = (roomId: string) => rooms.find((room: Room) => room.id === roomId)?.name ?? roomId;

  return {
    date,
    setDate,
    rooms,
    reservations,
    myReservationList,
    activeReservationId,
    toggleActiveReservation,
    getRoomName,
  };
}
