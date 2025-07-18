import { backApi } from "@/lib/axios";
import { FetchTasksParams, OparationResult } from "@/types/commn.types";
import { PageTaskResponseDto, TaskRequest, TaskResponse } from "@/types/task.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;

}


export interface TasksState {
  tasks: TaskResponse[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}



const initialState: TasksState = {
  tasks: [],
  pagination: {
    page: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  hasMore: true,
};


// ################################################### Fetch Paginated Tasks ####################################################

export const fetchPaginatedTasks = createAsyncThunk<
  PageTaskResponseDto,        // Return type
  FetchTasksParams,           // Input (arg)
  { rejectValue: string }     // Rejected payload type
>(
  'tasks/fetchPaginatedTasks',
  async ({ page, pageSize , status, priority, search }, thunkAPI) => {
    try {

      const response = await backApi.get<PageTaskResponseDto>('/gw-tasks/tasks', {
        params: { page, pageSize  },
      });
      
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch paginated tasks');
    }
  }
);


// ################################################### Delete Task ####################################################

export const deleteTask = createAsyncThunk<
  number,              // Return type: deleted task id
  number,              // Argument: task id to delete
  { rejectValue: string }
>(
  'tasks/deleteTask',
  async (taskId, thunkAPI) => {
    try {
      const response = await backApi.delete<OparationResult>(`/gw-tasks/tasks/${taskId}`);
      if (response.data.affectedRecords > 0) {
        return taskId;
      } else {
        return thunkAPI.rejectWithValue('No records were deleted');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);


// ################################################### Create Tasks ####################################################


export const createTasks = createAsyncThunk<
  TaskResponse[],          
  TaskRequest[],            
  { rejectValue: string }
>(
  'tasks/createTasks',
  async (taskRequests, thunkAPI) => {
    try {
      const response = await backApi.post<TaskResponse[]>('/gw-tasks/tasks', taskRequests);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to create tasks'
      );
    }
  }
);


// ################################################### Update Task ####################################################

export const updateTask = createAsyncThunk<
  { id: number; taskData: TaskRequest; result: OparationResult }, // Return type: id, taskData, and operation result
  { id: number; taskData: TaskRequest }, // Argument: task id and update data
  { rejectValue: string }
>(
  'tasks/updateTask',
  async ({ id, taskData }, thunkAPI) => {
    try {
      const response = await backApi.put<OparationResult>(`/gw-tasks/tasks/${id}`, taskData);
      
      if (response.data.affectedRecords > 0) {
        return { id, taskData, result: response.data };
      } else {
        return thunkAPI.rejectWithValue(response.data.message || 'No records were updated');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update task'
      );
    }
  }
);



// ################################################### Task Slice ####################################################

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {} ,
  extraReducers: (builder) => {
  builder
    .addCase(fetchPaginatedTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPaginatedTasks.fulfilled, (state, action) => {
      state.loading = false;

      state.tasks = [...state.tasks, ...action.payload.content];

      state.pagination = {
        page: action.payload.page,
        pageSize: action.payload.size,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
      };

      state.hasMore = action.payload.page + 1 < action.payload.totalPages;
    })
    .addCase(fetchPaginatedTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Unexpected error';
    })


    // Handle deleteTask
    .addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== deletedId);
      if (state.pagination) {
        state.pagination.totalElements = Math.max(0, state.pagination.totalElements - 1);
      }
    })



     // Handle createTasks
    .addCase(createTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTasks.fulfilled, (state, action) => {
      state.loading = false;
      // Add new tasks to the beginning of the list
      state.tasks = [...action.payload, ...state.tasks];
      
      // Update pagination info
      if (state.pagination) {
        state.pagination.totalElements += action.payload.length;
        // Recalculate total pages if needed
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalElements / state.pagination.pageSize
        );
      }
    })
    .addCase(createTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create tasks';
    })



    // Handle updateTask
    .addCase(updateTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTask.fulfilled, (state, action) => {
      state.loading = false;
      const { id, taskData } = action.payload;
      
      // Find and update the task in the tasks array
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...taskData,
          id,
        };
      }
    })
    .addCase(updateTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update task';
    })
    }


});



export default taskSlice.reducer;
