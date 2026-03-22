import { css } from '@emotion/react';
import { Button, ListRow, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from 'features/meeting-room-reservation/config/constants';
import { Reservation } from 'features/meeting-room-reservation/model/types';

interface MyReservationListProps {
  reservations: Reservation[];
  getRoomName: (roomId: string) => string;
  onCancelReservation: (reservationId: string) => void;
}

export function MyReservationList({
  reservations,
  getRoomName,
  onCancelReservation,
}: MyReservationListProps) {
  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {reservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {reservations.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {reservations.length === 0 ? (
        <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={getRoomName(reservation.roomId)}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${
                      reservation.equipment.map(equipment => EQUIPMENT_LABELS[equipment]).join(', ') || '장비 없음'
                    }`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    onClick={event => {
                      event.stopPropagation();
                      if (window.confirm('정말 취소하시겠습니까?')) {
                        onCancelReservation(reservation.id);
                      }
                    }}
                  >
                    취소
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
