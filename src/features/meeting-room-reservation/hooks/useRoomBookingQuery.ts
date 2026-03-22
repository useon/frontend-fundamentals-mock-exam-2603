import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { getReservations, getRooms } from '../api/remotes';
import { isValidDateParam } from '../lib/time';

export function useRoomBookingQuery(date: string) {
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

  return {
    rooms,
    reservations,
  };
}
