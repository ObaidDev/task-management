
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

interface InvoicesState {
  invoices: Invoice[];
  isLoading: boolean;
}

const initialState: InvoicesState = {
  invoices: [
    {
      id: '1',
      clientId: '1',
      clientName: 'Acme Corporation',
      invoiceNumber: 'INV-001',
      date: '2024-06-01',
      dueDate: '2024-06-30',
      items: [
        {
          id: '1',
          description: 'Web Development Services',
          quantity: 40,
          rate: 125.00,
          amount: 5000.00
        }
      ],
      subtotal: 5000.00,
      tax: 450.00,
      total: 5450.00,
      status: 'sent',
      notes: 'Payment terms: Net 30 days'
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'TechStart Solutions',
      invoiceNumber: 'INV-002',
      date: '2024-06-15',
      dueDate: '2024-07-15',
      items: [
        {
          id: '1',
          description: 'Mobile App Development',
          quantity: 60,
          rate: 100.00,
          amount: 6000.00
        }
      ],
      subtotal: 6000.00,
      tax: 540.00,
      total: 6540.00,
      status: 'paid',
    }
  ],
  isLoading: false,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Omit<Invoice, 'id'>>) => {
      const newInvoice: Invoice = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.invoices.push(newInvoice);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice, setLoading } = invoicesSlice.actions;
export default invoicesSlice.reducer;
