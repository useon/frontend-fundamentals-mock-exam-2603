export const meetingRoomReservationQueryKeys = {
  all: ['meeting-room-reservation'] as const,
  rooms: () => [...meetingRoomReservationQueryKeys.all, 'rooms'] as const,
  reservations: (date?: string) =>
    date
      ? ([...meetingRoomReservationQueryKeys.all, 'reservations', date] as const)
      : ([...meetingRoomReservationQueryKeys.all, 'reservations'] as const),
  myReservations: () => [...meetingRoomReservationQueryKeys.all, 'my-reservations'] as const,
};
