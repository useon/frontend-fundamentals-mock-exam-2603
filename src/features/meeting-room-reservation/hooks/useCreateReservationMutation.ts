import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../app/ToastProvider';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { createReservation } from '../api/remotes';
import { CreateReservationRequest } from '../model/types';

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation((data: CreateReservationRequest) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.reservations(variables.date),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.myReservations(),
      });
      showToast({ type: 'success', message: '예약이 완료되었습니다!' });
    },
  });
}
