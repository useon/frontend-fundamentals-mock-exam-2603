import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_EQUIPMENT } from '../config/constants';
import { formatDate } from '../lib/time';
import { BookingFilters, Equipment } from '../model/types';

function parseEquipmentParam(equipmentParam: string | null): Equipment[] {
  if (!equipmentParam) {
    return [];
  }

  return equipmentParam
    .split(',')
    .filter((value): value is Equipment => ALL_EQUIPMENT.includes(value as Equipment));
}

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<BookingFilters>(() => ({
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: parseEquipmentParam(searchParams.get('equipment')),
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  }));

  useEffect(() => {
    const params: Record<string, string> = {};

    if (filters.date) params.date = filters.date;
    if (filters.startTime) params.startTime = filters.startTime;
    if (filters.endTime) params.endTime = filters.endTime;
    if (filters.attendees > 1) params.attendees = String(filters.attendees);
    if (filters.equipment.length > 0) params.equipment = filters.equipment.join(',');
    if (filters.preferredFloor !== null) params.floor = String(filters.preferredFloor);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = <Key extends keyof BookingFilters>(key: Key, value: BookingFilters[Key]) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  return {
    filters,
    updateFilter,
  };
}
