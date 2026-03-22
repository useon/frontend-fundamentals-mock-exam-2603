import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { createReservation } from '../api/remotes';
import { CreateReservationRequest } from '../model/types';

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation((data: CreateReservationRequest) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.reservations(variables.date),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.myReservations(),
      });
    },
  });
}
