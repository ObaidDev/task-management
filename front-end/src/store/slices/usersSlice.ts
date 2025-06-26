import { userApi } from '@/lib/axios';
import { InviteUserRequest, UserResponse } from '@/types/user.types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';



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


// Cleaned: pass intended newStatus directly
export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ userId, newStatus }: { userId: string; newStatus: boolean }, thunkAPI) => {
    try {

      // API call to update user status
      await userApi.put(`/realms/task-swiftly/users-services/users/${userId}/status?enabled=${newStatus}`);

      toast.success(
        `User ${newStatus ? 'enabled' : 'disabled'} successfully`,
        {
          style: {
            background: '#10B981',
            color: 'white',
          },
        }
      );
      
      return { userId, newStatus };
    } catch (err: any) {

      const errorMessage = err.response?.data?.message || 'Failed to update user status';

      toast.error(errorMessage, {
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
      
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
        const errorMessage = err.response?.data?.message || 'Failed to invite users';
        // Error toast
        toast.error(errorMessage, {
          style: {
            background: '#EF4444',
            color: 'white',
          },
        });
        
        return thunkAPI.rejectWithValue(errorMessage);
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

      // fetchUsers
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


      // toggleUserStatus
      .addCase(toggleUserStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {

        const user = state.users.find(u => u.id === action.payload.userId);
        if (user) {
          user.enabled = action.payload.newStatus;
        }
        state.loading = false;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // inviteUsersBulk
      .addCase(inviteUsersBulk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteUsersBulk.fulfilled, state => {
        state.loading = false;
      })
      .addCase(inviteUsersBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { toggleStatus } = usersSlice.actions;
export default usersSlice.reducer;