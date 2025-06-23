
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clientsSlice from './slices/clientsSlice';
import invoicesSlice from './slices/invoicesSlice';
import paymentLinksSlice from './slices/paymentLinksSlice';
import usersReducer from './slices/usersSlice';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    clients: clientsSlice,
    invoices: invoicesSlice,
    paymentLinks: paymentLinksSlice,
    users: usersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
