import { ReservationStatusPage } from 'features/meeting-room-reservation/pages/ReservationStatusPage';
import { RoomBookingPage } from 'features/meeting-room-reservation/pages/RoomBookingPage';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<ReservationStatusPage />} />
      <Route path="/booking" element={<RoomBookingPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
};
