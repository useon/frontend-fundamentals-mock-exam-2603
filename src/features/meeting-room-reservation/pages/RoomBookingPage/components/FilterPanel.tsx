import { css } from '@emotion/react';
import { Select, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS, TIME_SLOTS } from 'features/meeting-room-reservation/config/constants';
import { formatDate } from 'features/meeting-room-reservation/lib/time';
import { BookingFilters } from 'features/meeting-room-reservation/model/types';

interface FilterPanelProps {
  filters: BookingFilters;
  floors: number[];
  onChangeFilter: <Key extends keyof BookingFilters>(key: Key, value: BookingFilters[Key]) => void;
  onResetSelection: () => void;
}

export function FilterPanel({ filters, floors, onChangeFilter, onResetSelection }: FilterPanelProps) {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 6px;
        `}
      >
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          날짜
        </Text>
        <input
          type="date"
          value={date}
          min={formatDate(new Date())}
          onChange={e => {
            onChangeFilter('date', e.target.value);
            onResetSelection();
          }}
          aria-label="날짜"
          css={css`
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            height: 48px;
            background-color: ${colors.grey50};
            border-radius: 12px;
            color: ${colors.grey800};
            width: 100%;
            border: 1px solid ${colors.grey200};
            padding: 0 16px;
            outline: none;
            transition: border-color 0.15s;
            &:focus {
              border-color: ${colors.blue500};
            }
          `}
        />
      </div>
      <Spacing size={14} />

      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            시작 시간
          </Text>
          <Select
            value={startTime}
            onChange={e => {
              onChangeFilter('startTime', e.target.value);
              onResetSelection();
            }}
            aria-label="시작 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            종료 시간
          </Text>
          <Select
            value={endTime}
            onChange={e => {
              onChangeFilter('endTime', e.target.value);
              onResetSelection();
            }}
            aria-label="종료 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            참석 인원
          </Text>
          <input
            type="number"
            min={1}
            value={attendees}
            onChange={e => {
              onChangeFilter('attendees', Math.max(1, Number(e.target.value)));
              onResetSelection();
            }}
            aria-label="참석 인원"
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              line-height: 1.5;
              height: 48px;
              background-color: ${colors.grey50};
              border-radius: 12px;
              color: ${colors.grey800};
              width: 100%;
              border: 1px solid ${colors.grey200};
              padding: 0 16px;
              outline: none;
              transition: border-color 0.15s;
              &:focus {
                border-color: ${colors.blue500};
              }
            `}
          />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            선호 층
          </Text>
          <Select
            value={preferredFloor ?? ''}
            onChange={e => {
              const value = e.target.value;
              onChangeFilter('preferredFloor', value === '' ? null : Number(value));
              onResetSelection();
            }}
            aria-label="선호 층"
          >
            <option value="">전체</option>
            {floors.map(floor => (
              <option key={floor} value={floor}>
                {floor}층
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          필요 장비
        </Text>
        <Spacing size={8} />
        <div
          css={css`
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          `}
        >
          {ALL_EQUIPMENT.map(equipmentType => {
            const selected = equipment.includes(equipmentType);
            return (
              <button
                key={equipmentType}
                type="button"
                onClick={() => {
                  const nextEquipment = selected
                    ? equipment.filter(value => value !== equipmentType)
                    : [...equipment, equipmentType];
                  onChangeFilter('equipment', nextEquipment);
                  onResetSelection();
                }}
                aria-label={EQUIPMENT_LABELS[equipmentType]}
                aria-pressed={selected}
                css={css`
                  padding: 8px 16px;
                  border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.15s;
                  &:hover {
                    border-color: ${selected ? colors.blue500 : colors.grey400};
                  }
                `}
              >
                {EQUIPMENT_LABELS[equipmentType]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
