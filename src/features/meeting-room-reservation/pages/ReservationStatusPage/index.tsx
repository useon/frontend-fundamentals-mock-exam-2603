import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { useToast } from '../../../../app/ToastProvider';
import { colors } from '_tosslib/constants/colors';
import { meetingRoomReservationQueryKeys } from 'features/meeting-room-reservation/api/queryKeys';
import { cancelReservation } from 'features/meeting-room-reservation/api/remotes';
import { useReservationStatusQuery } from 'features/meeting-room-reservation/hooks/useReservationStatusQuery';
import { formatDate } from 'features/meeting-room-reservation/lib/time';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const {
    date,
    setDate,
    rooms,
    reservations,
    myReservationList,
    activeReservationId,
    toggleActiveReservation,
    getRoomName,
  } = useReservationStatusQuery();

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.reservations());
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.myReservations());
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      showToast({ type: 'success', message: '예약이 취소되었습니다.' });
    } catch {
      showToast({ type: 'error', message: '취소에 실패했습니다.' });
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
          <input
            type="date"
            value={date}
            min={formatDate(new Date())}
            onChange={e => setDate(e.target.value)}
            aria-label="날짜"
            css={css`
              box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
              background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
              width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
              transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
            `}
          />
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <ReservationTimeline
        rooms={rooms}
        reservations={reservations}
        activeReservationId={activeReservationId}
        onToggleReservation={toggleActiveReservation}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <MyReservationList
        reservations={myReservationList}
        getRoomName={getRoomName}
        onCancelReservation={handleCancel}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={css`padding: 0 24px;`}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
