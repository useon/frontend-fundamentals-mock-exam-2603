import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { meetingRoomReservationQueryKeys } from 'features/meeting-room-reservation/api/queryKeys';
import { useBookingFilters } from 'features/meeting-room-reservation/hooks/useBookingFilters';
import {
  getAvailableFloors,
  getAvailableRooms,
  isBookingFilterComplete,
  validateBookingFilters,
} from 'features/meeting-room-reservation/model/filters';
import { CreateReservationRequest } from 'features/meeting-room-reservation/model/types';
import { getRooms, getReservations, createReservation } from 'features/meeting-room-reservation/api/remotes';
import { AvailableRoomList } from './components/AvailableRoomList';
import { FilterPanel } from './components/FilterPanel';
import axios from 'axios';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { filters, updateFilter } = useBookingFilters();
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(meetingRoomReservationQueryKeys.rooms(), getRooms);
  const { data: reservations = [] } = useQuery(meetingRoomReservationQueryKeys.reservations(date), () => getReservations(date), {
    enabled: !!date,
  });

  const createMutation = useMutation((data: CreateReservationRequest) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.reservations(variables.date));
      queryClient.invalidateQueries(meetingRoomReservationQueryKeys.myReservations());
    },
  });

  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const validationError = validateBookingFilters(filters);
  const isFilterComplete = isBookingFilterComplete(filters) && !validationError;

  const floors = getAvailableFloors(rooms);
  const availableRooms = isFilterComplete ? getAvailableRooms(rooms, reservations, filters) : [];

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
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
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

      <FilterPanel
        filters={filters}
        floors={floors}
        onChangeFilter={updateFilter}
        onResetSelection={handleFilterChange}
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
          isSubmitting={createMutation.isLoading}
          onSelectRoom={setSelectedRoomId}
          onSubmit={handleBook}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
