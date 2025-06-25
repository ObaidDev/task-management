export const TASK_STATUSES = ['OPEN', 'IN_PROGRESS', 'DONE', 'BLOCKED'] as const;
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

// Derive types from those constants:
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];




export interface TaskRequest {
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  estimateDate: number;
  assignToUserId: string;
  userName: string;
}



export interface TaskResponse {
  id: number; 
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  estimateDate: number; 
  assignToUserId: string;
  userName: string;
  createdAt: number; 
  updatedAt: number; 
}



export interface PageTaskResponseDto {
  content: TaskResponse[];     
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}