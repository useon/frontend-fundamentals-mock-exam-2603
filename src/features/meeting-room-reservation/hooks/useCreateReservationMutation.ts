import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../app/ToastProvider';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { createReservation } from '../api/remotes';
import { CreateReservationRequest } from '../model/types';

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation((data: CreateReservationRequest) => createReservation(data), {
    onError: error => {
      showToast({
        type: 'error',
        message: error instanceof Error && error.message ? error.message : '예약에 실패했습니다.',
      });
    },
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
