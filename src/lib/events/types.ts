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
  startDate: string | Date;
  endDate: string | Date;
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
  startDate: string | Date;
  endDate: string | Date;
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
