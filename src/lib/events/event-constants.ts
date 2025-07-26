import { Calendar, MapPin, Users, Video, type LucideIcon } from "lucide-react";

// Type Definitions
export type EventTypeKey = "Online" | "In-Person" | "Hybrid";
export type EventCategoryKey =
  | "Conference"
  | "Workshop"
  | "Seminar"
  | "Webinar"
  | "Other";
export type EventStatusKey = "past" | "upcoming" | "ongoing";
export type ErrorMessageKey =
  | "NOT_LOGGED_IN"
  | "TIME_CONFLICT"
  | "CREATE_FAILED"
  | "UPDATE_FAILED";

export interface EventType {
  value: EventTypeKey;
  label: string;
  icon: LucideIcon;
  className: string;
}

export interface EventCategory {
  value: EventCategoryKey;
  label: string;
  className: string;
}

export interface EventStatus {
  status: EventStatusKey;
  label: string;
  className: string;
}

export interface ErrorMessages {
  [key: string]: string;
}

export interface SectionTitles {
  BASIC_INFORMATION: string;
  DATE_TIME: string;
  EVENT_LINK: string;
  LOCATION_DETAILS: string;
}

// Constants
export const EVENT_TYPES: EventType[] = [
  {
    value: "Online",
    label: "Online",
    icon: Video,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  {
    value: "In-Person",
    label: "In-Person",
    icon: MapPin,
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  {
    value: "Hybrid",
    label: "Hybrid",
    icon: Users,
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  },
];

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    value: "Conference",
    label: "Conference",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  },
  {
    value: "Workshop",
    label: "Workshop",
    className:
      "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
  },
  {
    value: "Seminar",
    label: "Seminar",
    className:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
  },
  {
    value: "Webinar",
    label: "Webinar",
    className:
      "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  },
  {
    value: "Other",
    label: "Other",
    className:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800",
  },
];

export const EVENT_STATUSES: EventStatus[] = [
  {
    status: "past",
    label: "Completed",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
  {
    status: "upcoming",
    label: "Upcoming",
    className: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  },
  {
    status: "ongoing",
    label: "Live Now",
    className:
      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
  },
];

export const ERROR_MESSAGES: ErrorMessages = {
  NOT_LOGGED_IN: "You must be logged in to create or edit an event.",
  TIME_CONFLICT: "Time conflict detected! Please choose a different time slot.",
  CREATE_FAILED: "Failed to create event. Please try again.",
  UPDATE_FAILED: "Failed to update event. Please try again.",
};

export const SECTION_TITLES: SectionTitles = {
  BASIC_INFORMATION: "Basic Information",
  DATE_TIME: "Date & Time",
  EVENT_LINK: "Event Link",
  LOCATION_DETAILS: "Location Details",
};

// Lookup Maps for Event Listing
export const EVENT_TYPE_MAP: { [key: string]: EventType } = Object.fromEntries(
  EVENT_TYPES.map((type) => [type.value, type])
);

export const EVENT_CATEGORY_MAP: { [key: string]: EventCategory } =
  Object.fromEntries(
    EVENT_CATEGORIES.map((category) => [category.value, category])
  );

export const EVENT_STATUS_MAP: { [key: string]: EventStatus } =
  Object.fromEntries(EVENT_STATUSES.map((status) => [status.status, status]));

export const EVENT_TYPE_ICONS: { [key: string]: LucideIcon } = {
  Online: Video,
  "In-Person": MapPin,
  Hybrid: Users,
  default: Calendar,
};
