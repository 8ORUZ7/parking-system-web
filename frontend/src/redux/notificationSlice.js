import { createSlice } from '@reduxjs/toolkit';

const initialState = { open: false, autoHideDuration: 2000, message: "", type: "info"};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    displayNotification: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.open = false;
    }
  },
});

export const { displayNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
