import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { getMyReservations, getReservations, getRooms } from '../api/remotes';
import { isValidDateParam } from '../lib/time';
 
export function useReservationStatusQuery(date: string) {
  const hasValidDate = isValidDateParam(date);

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
