export interface UserResponse {
    message: string;
    user: {
      id: number;
      created_at: string;
    };
  }