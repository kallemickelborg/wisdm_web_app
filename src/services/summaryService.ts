// Summary Service - CRUD operations for summaries

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { Summary } from "@/models";

// CRUD operations for summaries
const summaryCrud = new CrudOperations<Summary>({
  baseEndpoint: "/summaries",
  getEndpoint: "/summaries/get/summary",
  getAllEndpoint: "/summaries/get/summaries",
  createEndpoint: "/summaries/post/summary",
  updateEndpoint: "/summaries/put/summary",
  deleteEndpoint: "/summaries/delete/summary",
});

export const summaryService = {
  fetchSummary: (summaryId: string) => summaryCrud.getById(summaryId),

  async fetchSummaryByParent(parentId: string): Promise<Summary> {
    const queryParams = apiClient.buildQueryString({ parent_id: parentId });
    return apiClient.get<Summary>(
      `/summaries/get/summary_by_parent${queryParams}`
    );
  },

  createSummary: (data: Partial<Summary>) => summaryCrud.create(data),

  updateSummary: (summaryId: string, data: Partial<Summary>) =>
    summaryCrud.update(summaryId, data),

  deleteSummary: (summaryId: string) => summaryCrud.delete(summaryId),
};
