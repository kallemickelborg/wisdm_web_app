// User Service - ONLY functional methods that match backend

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { UserProfile, UserTraitsResponse } from "@/models";

// CRUD operations for users
const userCrud = new CrudOperations<UserProfile>({
  baseEndpoint: "/users",
  getEndpoint: "/users/get/user",
  getAllEndpoint: "/users/get/users",
  createEndpoint: "/users/post/user",
  updateEndpoint: "/users/put/user",
  deleteEndpoint: "/users/delete/user",
});

export const userService = {
  async fetchUserProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>("/users/get/user");
  },

  createUser: (data: Partial<UserProfile>) => userCrud.create(data),

  updateUser: (userId: string, data: Partial<UserProfile>) =>
    userCrud.update(userId, data),

  deleteUser: (userId: string) => userCrud.delete(userId),

  async updateUserInterests(
    categoryIds: string[]
  ): Promise<{ message: string; category_ids: string[] }> {
    return apiClient.put<{ message: string; category_ids: string[] }>(
      "/users/put/user_interests",
      { category_ids: categoryIds }
    );
  },
};
