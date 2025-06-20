
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaymentLink {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  clientId?: string;
  clientName?: string;
  url: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
  expiresAt?: string;
  usageCount: number;
  maxUsage?: number;
}

interface PaymentLinksState {
  paymentLinks: PaymentLink[];
  isLoading: boolean;
}

const initialState: PaymentLinksState = {
  paymentLinks: [
    {
      id: '1',
      title: 'Project Deposit',
      description: 'Initial deposit for web development project',
      amount: 2500.00,
      currency: 'USD',
      clientId: '1',
      clientName: 'Acme Corporation',
      url: 'https://pay.example.com/link/abc123',
      status: 'active',
      createdAt: '2024-06-01',
      expiresAt: '2024-07-01',
      usageCount: 0,
      maxUsage: 1
    }
  ],
  isLoading: false,
};

const paymentLinksSlice = createSlice({
  name: 'paymentLinks',
  initialState,
  reducers: {
    addPaymentLink: (state, action: PayloadAction<Omit<PaymentLink, 'id' | 'url' | 'usageCount'>>) => {
      const newPaymentLink: PaymentLink = {
        ...action.payload,
        id: Date.now().toString(),
        url: `https://pay.example.com/link/${Date.now()}`,
        usageCount: 0,
      };
      state.paymentLinks.push(newPaymentLink);
    },
    updatePaymentLink: (state, action: PayloadAction<PaymentLink>) => {
      const index = state.paymentLinks.findIndex(link => link.id === action.payload.id);
      if (index !== -1) {
        state.paymentLinks[index] = action.payload;
      }
    },
    deletePaymentLink: (state, action: PayloadAction<string>) => {
      state.paymentLinks = state.paymentLinks.filter(link => link.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addPaymentLink, updatePaymentLink, deletePaymentLink, setLoading } = paymentLinksSlice.actions;
export default paymentLinksSlice.reducer;
