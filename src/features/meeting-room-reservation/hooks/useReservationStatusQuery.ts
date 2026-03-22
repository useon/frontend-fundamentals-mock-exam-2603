import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { getMyReservations, getReservations, getRooms } from '../api/remotes';
 
export function useReservationStatusQuery(date: string) {
  const hasValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const { data: rooms } = useSuspenseQuery({
    queryKey: meetingRoomReservationQueryKeys.rooms(),
    queryFn: getRooms,
  });
  const { data: reservations = [] } = useQuery({
    queryKey: meetingRoomReservationQueryKeys.reservations(date),
    queryFn: () => getReservations(date),
    enabled: hasValidDate,
    suspense: true,
    useErrorBoundary: true,
  });
  const { data: myReservationList } = useSuspenseQuery({
    queryKey: meetingRoomReservationQueryKeys.myReservations(),
    queryFn: getMyReservations,
  });

  return {
    rooms,
    reservations,
    myReservationList,
  };
}
