
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clientsSlice from './slices/clientsSlice';
import invoicesSlice from './slices/invoicesSlice';
import paymentLinksSlice from './slices/paymentLinksSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    clients: clientsSlice,
    invoices: invoicesSlice,
    paymentLinks: paymentLinksSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
