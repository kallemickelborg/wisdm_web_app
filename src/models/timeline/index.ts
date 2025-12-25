import type { Event } from "../event";
import type { Summary } from "../summary";

export interface Timeline {
  id: string;
  title: string;
  parent_event_id: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  category_ids: string[];
  root_comment_count: number;
  comment_count_total: number;
  upvote_count: number;
  downvote_count: number;
  vote?: boolean | null;
}

export interface TimelineResponse {
  timelines: Timeline[];
}

export interface TimelineWithDetails {
  timeline: Timeline & {
    topic_statement?: string;
  };
  summary?: Summary | null;
  events: Event[][];
}

export interface TimelinePopupProps {
  event: {
    title: string;
    description?: string;
    index?: number;
    domElement?: HTMLElement;
    eventId?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  initialClickPosition?: { x: number; y: number };
  narrativeBias?: "left" | "right";
  timelineData?: TimelineWithDetails | null;
}

export interface SelectedPopupEvent {
  event: {
    title: string;
    index?: number;
    eventId?: string;
  };
  position: { x: number; y: number };
  bias: "left" | "right";
}

export interface TimelineFilters {
  category_id?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTimelineRequest {
  title: string;
  parent_event_id: string;
  image_url?: string;
  category_ids?: string[];
}

export interface UpdateTimelineRequest {
  id: string;
  title?: string;
  image_url?: string;
  category_ids?: string[];
}
