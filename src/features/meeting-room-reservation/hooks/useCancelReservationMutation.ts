import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../app/ToastProvider';
import { meetingRoomReservationQueryKeys } from '../api/queryKeys';
import { cancelReservation } from '../api/remotes';

export function useCancelReservationMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.reservations(),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomReservationQueryKeys.myReservations(),
      });
      showToast({ type: 'success', message: '예약이 취소되었습니다.' });
    },
    onError: () => {
      showToast({ type: 'error', message: '취소에 실패했습니다.' });
    },
  });
}
