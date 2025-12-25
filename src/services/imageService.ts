/**
 * Image Service
 *
 * Handles all API calls related to images.
 * Following Services Architecture:
 * - All API calls go through services layer
 * - Returns Promises (errors thrown, not caught)
 * - No business logic in services
 * - Types imported from @/models
 */

import { apiClient } from "./api/apiClient";
import type { Image } from "@/models";

export const imageService = {
  fetchImage: async (imageId: string): Promise<Image> => {
    const queryParams = apiClient.buildQueryString({ id: imageId });
    return apiClient.get<Image>(`/images/get/image${queryParams}`);
  },

  fetchImages: async (): Promise<Image[]> => {
    const response = await apiClient.get<{ images: Image[] }>(
      "/images/get/images"
    );
    return response.images;
  },

  fetchImagesByParent: async (parentId: string): Promise<Image[]> => {
    const queryParams = apiClient.buildQueryString({ parent_id: parentId });
    const response = await apiClient.get<{ images: Image[] }>(
      `/images/get/images_by_parent${queryParams}`
    );
    return response.images;
  },

  createImage: async (data: Partial<Image>): Promise<Image> => {
    return apiClient.post<Image>("/images/post/image", data);
  },

  updateImage: async (
    imageId: string,
    data: Partial<Image>
  ): Promise<Image> => {
    return apiClient.put<Image>("/images/put/image", {
      id: imageId,
      ...data,
    });
  },

  deleteImage: async (imageId: string): Promise<void> => {
    const queryParams = apiClient.buildQueryString({ id: imageId });
    return apiClient.delete(`/images/delete/image${queryParams}`);
  },

  addParentToImage: async (
    imageId: string,
    parentId: string
  ): Promise<Image> => {
    return apiClient.post<Image>("/images/post/add_parent", {
      image_id: imageId,
      parent_id: parentId,
    });
  },

  removeParentFromImage: async (
    imageId: string,
    parentId: string
  ): Promise<Image> => {
    // Note: Using POST method because DELETE doesn't support request body
    // Backend endpoint is still /delete/remove_parent but accepts POST with body
    return apiClient.post<Image>("/images/delete/remove_parent", {
      image_id: imageId,
      parent_id: parentId,
    });
  },
};
