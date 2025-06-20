
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalInvoiced: number;
  status: 'active' | 'inactive';
}

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
}

const initialState: ClientsState = {
  clients: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      company: 'Acme Corporation',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, City, State 12345',
      createdAt: '2024-01-15',
      totalInvoiced: 15750.00,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      company: 'TechStart Solutions',
      phone: '+1 (555) 987-6543',
      address: '456 Innovation Ave, Tech City, TC 67890',
      createdAt: '2024-02-20',
      totalInvoiced: 8920.50,
      status: 'active'
    }
  ],
  isLoading: false,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Omit<Client, 'id'>>) => {
      const newClient: Client = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.clients.push(newClient);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addClient, updateClient, deleteClient, setLoading } = clientsSlice.actions;
export default clientsSlice.reducer;
