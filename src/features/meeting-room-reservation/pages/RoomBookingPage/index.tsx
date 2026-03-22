import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { QueryAsyncBoundary } from '../../../../app/QueryAsyncBoundary';
import { useAvailableRooms } from 'features/meeting-room-reservation/hooks/useAvailableRooms';
import { useBookingFilters } from 'features/meeting-room-reservation/hooks/useBookingFilters';
import { useCreateReservationMutation } from 'features/meeting-room-reservation/hooks/useCreateReservationMutation';
import { useRoomBookingQuery } from 'features/meeting-room-reservation/hooks/useRoomBookingQuery';
import { BookingFilters, CreateReservationRequest } from 'features/meeting-room-reservation/model/types';
import { AvailableRoomList } from './components/AvailableRoomList';
import { FilterPanel } from './components/FilterPanel';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { filters, updateFilter } = useBookingFilters();
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createReservationMutation = useCreateReservationMutation();

  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const getCreateReservationPayload = (roomId: string): CreateReservationRequest => ({
    roomId,
    date,
    start: startTime,
    end: endTime,
    attendees,
    equipment,
  });

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createReservationMutation.mutateAsync(getCreateReservationPayload(selectedRoomId));

      if ('ok' in result && result.ok) {
        navigate('/');
        return;
      }

      setErrorMessage(result.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error && error.message ? error.message : '예약에 실패했습니다.');
      setSelectedRoomId(null);
    }
  };

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      <QueryAsyncBoundary
        pendingMessage="예약 가능한 회의실 정보를 불러오고 있어요."
        rejectedMessage="회의실 정보를 다시 불러와 주세요."
      >
        <RoomBookingContent
          filters={filters}
          selectedRoomId={selectedRoomId}
          isSubmitting={createReservationMutation.isLoading}
          onChangeFilter={updateFilter}
          onResetSelection={handleFilterChange}
          onSelectRoom={setSelectedRoomId}
          onSubmit={handleBook}
        />
      </QueryAsyncBoundary>

      <Spacing size={24} />
    </div>
  );
}

type RoomBookingContentProps = {
  filters: BookingFilters;
  selectedRoomId: string | null;
  isSubmitting: boolean;
  onChangeFilter: <Key extends keyof BookingFilters>(key: Key, value: BookingFilters[Key]) => void;
  onResetSelection: () => void;
  onSelectRoom: (roomId: string | null) => void;
  onSubmit: () => void;
};

function RoomBookingContent({
  filters,
  selectedRoomId,
  isSubmitting,
  onChangeFilter,
  onResetSelection,
  onSelectRoom,
  onSubmit,
}: RoomBookingContentProps) {
  const { rooms, reservations } = useRoomBookingQuery(filters.date);

  const { validationError, isFilterComplete, floors, availableRooms } = useAvailableRooms({
    rooms,
    reservations,
    filters,
  });

  return (
    <>
      <FilterPanel
        filters={filters}
        floors={floors}
        onChangeFilter={onChangeFilter}
        onResetSelection={onResetSelection}
      />

      {validationError && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
            role="alert"
          >
            {validationError}
          </span>
        </div>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <AvailableRoomList
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          isSubmitting={isSubmitting}
          onSelectRoom={onSelectRoom}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}
