

export interface FetchTasksParams {
  page: number;
  pageSize : number;
  status?: string;
  priority?: string; 
  search?: string;
}



export interface OparationResult {
    affectedRecords: number;
    message: string;
}