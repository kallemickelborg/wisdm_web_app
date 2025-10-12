// Event Service - CRUD operations for events

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { Event } from "@/models";

// CRUD operations for events
const eventCrud = new CrudOperations<Event>({
  baseEndpoint: "/events",
  getEndpoint: "/events/get/event",
  getAllEndpoint: "/events/get/events",
  createEndpoint: "/events/post/event",
  updateEndpoint: "/events/put/event",
  deleteEndpoint: "/events/delete/event",
});

export const eventService = {
  fetchEvent: (eventId: string) => eventCrud.getById(eventId),

  async fetchEventsByParent(parentId: string): Promise<Event[]> {
    const queryParams = apiClient.buildQueryString({ parent_id: parentId });
    return apiClient.get<Event[]>(`/events/get/events_by_parent${queryParams}`);
  },

  createEvent: (data: Partial<Event>) => eventCrud.create(data),

  updateEvent: (eventId: string, data: Partial<Event>) =>
    eventCrud.update(eventId, data),

  deleteEvent: (eventId: string) => eventCrud.delete(eventId),
};
