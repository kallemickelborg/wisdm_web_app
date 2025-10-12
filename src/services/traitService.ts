/**
 * Trait Service
 *
 * Handles all API calls related to political/ideological traits.
 * Following Services Architecture:
 * - All API calls go through services layer
 * - Uses CrudOperations for standard CRUD
 * - Returns Promises (errors thrown, not caught)
 * - No business logic in services
 * - Types imported from @/models
 */

import { apiClient } from "./api/apiClient";
import type { Trait } from "@/models";

export const traitService = {
  fetchTrait: async (traitId: string): Promise<Trait> => {
    const queryParams = apiClient.buildQueryString({ id: traitId });
    return apiClient.get<Trait>(`/traits/get/trait${queryParams}`);
  },

  fetchTraits: async (): Promise<Trait[]> => {
    const response = await apiClient.get<{ traits: Trait[] }>(
      "/traits/get/traits"
    );
    return response.traits;
  },

  createTrait: async (data: Partial<Trait>): Promise<Trait> => {
    return apiClient.post<Trait>("/traits/post/trait", data);
  },

  updateTrait: async (
    traitId: string,
    data: Partial<Trait>
  ): Promise<Trait> => {
    return apiClient.put<Trait>("/traits/put/trait", { id: traitId, ...data });
  },

  deleteTrait: async (traitId: string): Promise<void> => {
    return apiClient.delete(`/traits/delete/trait?id=${traitId}`);
  },
};
