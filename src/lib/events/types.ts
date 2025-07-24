export interface Organizer {
  name: string;
  email: string;
}

export interface Event {
  uuid: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person" | "Hybrid";
  category: string;
  startDate: string; // ISO string (e.g., "2025-07-24T14:00:00Z")
  endDate: string; // ISO string
  eventLink?: string; // Required for Online events
  location?: string; // Optional for In-Person and Hybrid events
  createdAt: string; // ISO string
  organizer: Organizer;
}

export interface EventInput {
  uuid?: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person" | "Hybrid";
  category: string;
  startDate: string;
  endDate: string;
  eventLink?: string;
  location?: string;
}

export interface EventState {
  events: Event[];
}

export interface FilterState {
  search: string;
  eventType: string;
  category: string;
  dateRange: { start: string | null; end: string | null };
}
