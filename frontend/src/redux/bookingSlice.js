import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingState: (state, action) => {
      return { ...state, ...action.payload };
    },
    unsetBookingState: () => {
      return {};
    }
  },
});

export const { setBookingState, unsetBookingState } = bookingSlice.actions;

export default bookingSlice.reducer;
