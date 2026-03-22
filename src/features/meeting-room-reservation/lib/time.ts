import { TIMELINE_START_HOUR } from '../config/constants';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateParam(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function timeToTimelineOffsetMinutes(time: string): number {
  return timeToMinutes(time) - TIMELINE_START_HOUR * 60;
}
