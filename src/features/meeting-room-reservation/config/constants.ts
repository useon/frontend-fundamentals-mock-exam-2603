import { Equipment } from '../model/types';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export const ALL_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

export const TIMELINE_START_HOUR = 9;
export const TIMELINE_END_HOUR = 20;
export const TOTAL_TIMELINE_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;

export const TIME_SLOTS = Array.from({ length: (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 2 + 1 }, (_, index) => {
  const totalMinutes = TIMELINE_START_HOUR * 60 + index * 30;
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minute = String(totalMinutes % 60).padStart(2, '0');
  return `${hour}:${minute}`;
});

export const HOUR_LABELS = TIME_SLOTS.filter(time => time.endsWith(':00'));
