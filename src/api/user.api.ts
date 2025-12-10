import type { User, UserResponse } from "@/types/user.types";
import { apiClient } from "./client";

export const userApi = {
    getUserProfile: async (): Promise<User> => {
    const response = await apiClient.get<UserResponse>('/auth/profile');
    return response.data.value.data;
    }
}