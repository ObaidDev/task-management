import { userApi } from '@/lib/axios';
import { InviteUserRequest, UserResponse } from '@/types/user.types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



export interface UsersState {
  users: UserResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};



// Thunk to fetch users from the API
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await userApi.get<UserResponse[]>('/realms/task-swiftly/users-services/users');
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId: string, thunkAPI) => {
    try {
      // Get current state to find the user and current status
      const state = thunkAPI.getState() as { users: UsersState };
      const user = state.users.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const newStatus = !user.enabled;

      // API call to update user status
      await userApi.put(`/realms/task-swiftly/users-services/users/${userId}/status?enabled=${newStatus}`);

      return { userId, newStatus };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update user status');
    }
  }
);


export const inviteUsersBulk = createAsyncThunk(
  'users/inviteUsersBulk',
  async (payload: InviteUserRequest[], thunkAPI) => {
    try {
      const response = await userApi.post(
        '/realms/task-swiftly/users-services/invite-users-bulk',
        payload
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to invite users');
    }
  }
);



const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleStatus: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        user.enabled = !user.enabled;
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.userId);
        if (user) {
          user.enabled = action.payload.newStatus;
        }
      });
  }
});

export const { toggleStatus } = usersSlice.actions;
export default usersSlice.reducer;