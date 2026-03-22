import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useCancelReservationMutation } from 'features/meeting-room-reservation/hooks/useCancelReservationMutation';
import { useReservationStatusQuery } from 'features/meeting-room-reservation/hooks/useReservationStatusQuery';
import { formatDate } from 'features/meeting-room-reservation/lib/time';
import { Room } from 'features/meeting-room-reservation/model/types';
import { DateFilter } from './components/DateFilter';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(formatDate(new Date()));
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);
  const { rooms, reservations, myReservationList } = useReservationStatusQuery(date);
  const cancelReservationMutation = useCancelReservationMutation();

  const handleCancel = async (id: string) => {
    await cancelReservationMutation.mutateAsync(id);
  };

  const getRoomName = (roomId: string) => rooms.find((room: Room) => room.id === roomId)?.name ?? roomId;

  const toggleActiveReservation = (reservationId: string) => {
    setActiveReservationId(currentReservationId =>
      currentReservationId === reservationId ? null : reservationId
    );
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <DateFilter date={date} onChangeDate={setDate} />

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
