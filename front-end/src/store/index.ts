
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clientsSlice from './slices/clientsSlice';
import invoicesSlice from './slices/invoicesSlice';
import paymentLinksSlice from './slices/paymentLinksSlice';
import usersReducer from './slices/usersSlice';
import tasksReducer from './slices/taskSlice';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    clients: clientsSlice,
    invoices: invoicesSlice,
    paymentLinks: paymentLinksSlice,
    users: usersReducer ,
    tasks: tasksReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
