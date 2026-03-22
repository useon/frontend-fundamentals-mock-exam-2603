import { useQuery } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { getMyReservations, getReservations, getRooms } from '../api/remotes';
 
export function useReservationStatusQuery(date: string) {
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

  return {
    rooms,
    reservations,
    myReservationList,
  };
}
