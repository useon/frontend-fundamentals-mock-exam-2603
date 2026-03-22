import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { meetingRoomReservationQueryKeys } from 'features/meeting-room-reservation/api/queryKeys';
import {
  cancelReservation,
  getMyReservations,
  getReservations,
  getRooms,
} from 'features/meeting-room-reservation/api/remotes';
import { formatDate } from 'features/meeting-room-reservation/lib/time';
import { Reservation, Room } from 'features/meeting-room-reservation/model/types';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { data: rooms = [] } = useQuery(meetingRoomReservationQueryKeys.rooms(), getRooms);
  const { data: reservations = [] } = useQuery(meetingRoomReservationQueryKeys.reservations(date), () => getReservations(date), {
    enabled: !!date,
  });
  const { data: myReservationList = [] } = useQuery(
    meetingRoomReservationQueryKeys.myReservations(),
    getMyReservations
  );

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.reservations());
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.myReservations());
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const getRoomName = (roomId: string) => rooms.find((room: Room) => room.id === roomId)?.name ?? roomId;

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
        activeReservationId={activeReservation}
        onToggleReservation={(reservationId) =>
          setActiveReservation(currentReservationId => (currentReservationId === reservationId ? null : reservationId))
        }
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {message && (
        <div css={css`padding: 0 24px;`}>
          <div
            css={css`
              padding: 10px 14px; border-radius: 10px;
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
              display: flex; align-items: center; gap: 8px;
            `}
          >
            <Text
              typography="t7"
              fontWeight="medium"
              color={message.type === 'success' ? colors.blue600 : colors.red500}
            >
              {message.text}
            </Text>
          </div>
          <Spacing size={12} />
        </div>
      )}

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
