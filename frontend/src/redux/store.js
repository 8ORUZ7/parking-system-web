import { configureStore } from '@reduxjs/toolkit';
import notificationSlice from './notificationSlice';
import loginSlice from './loginSlice';
import bookingSlice from './bookingSlice';

const store = configureStore({
  reducer: {
    notification: notificationSlice,
    login: loginSlice,
    booking: bookingSlice,
  },
});

export default store;
