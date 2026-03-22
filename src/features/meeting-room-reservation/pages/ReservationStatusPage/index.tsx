import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useCancelReservationMutation } from 'features/meeting-room-reservation/hooks/useCancelReservationMutation';
import { useReservationStatusQuery } from 'features/meeting-room-reservation/hooks/useReservationStatusQuery';
import { formatDate } from 'features/meeting-room-reservation/lib/time';
import { Room } from 'features/meeting-room-reservation/model/types';
import { QueryAsyncBoundary } from '../../../../app/QueryAsyncBoundary';
import { DateFilter } from './components/DateFilter';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(formatDate(new Date()));
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);

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

      <QueryAsyncBoundary
        pendingMessage="예약 현황을 불러오고 있어요."
        rejectedMessage="예약 현황을 다시 불러와 주세요."
      >
        <ReservationStatusContent
          date={date}
          activeReservationId={activeReservationId}
          onToggleReservation={toggleActiveReservation}
        />
      </QueryAsyncBoundary>

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

type ReservationStatusContentProps = {
  date: string;
  activeReservationId: string | null;
  onToggleReservation: (reservationId: string) => void;
};

function ReservationStatusContent({
  date,
  activeReservationId,
  onToggleReservation,
}: ReservationStatusContentProps) {
  const { rooms, reservations, myReservationList } = useReservationStatusQuery(date);
  const cancelReservationMutation = useCancelReservationMutation();

  const handleCancel = async (id: string) => {
    await cancelReservationMutation.mutateAsync(id);
  };

  const getRoomName = (roomId: string) => rooms.find((room: Room) => room.id === roomId)?.name ?? roomId;

  return (
    <>
      <ReservationTimeline
        rooms={rooms}
        reservations={reservations}
        activeReservationId={activeReservationId}
        onToggleReservation={onToggleReservation}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <MyReservationList
        reservations={myReservationList}
        getRoomName={getRoomName}
        onCancelReservation={handleCancel}
      />
    </>
  );
}
