interface BaseEntity {
  id: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


// User interfaces
export interface UserResponse {
  id: string; // UUID from backend
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  enabled: boolean;
}


export interface InviteUserRequest {
  email: string;
}