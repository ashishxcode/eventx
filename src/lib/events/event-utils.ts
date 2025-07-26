import { EventFormData } from "@/schemas/event";
import { Event } from "./types";

export const hasTimeConflict = (events: Event[], newEvent: Event): boolean => {
  // Existing implementation (assumed to be unchanged)
  return events.some((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const newStart = new Date(newEvent.startDate);
    const newEnd = new Date(newEvent.endDate);

    return (
      (newStart >= eventStart && newStart < eventEnd) ||
      (newEnd > eventStart && newEnd <= eventEnd) ||
      (newStart <= eventStart && newEnd >= eventEnd)
    );
  });
};

export const prepareInitialValues = (event: Event | null): EventFormData => {
  if (event) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return {
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      category: event.category,
      startDate: start.toISOString().split("T")[0],
      startTime: start.toTimeString().slice(0, 5),
      endDate: end.toISOString().split("T")[0],
      endTime: end.toTimeString().slice(0, 5),
      location: event.location || "",
      eventLink: event.eventLink || "",
    };
  }

  // Default values for new event
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return {
    title: "",
    description: "",
    eventType: "In-Person",
    category: "",
    startDate: now.toISOString().split("T")[0],
    startTime: now.toTimeString().slice(0, 5),
    endDate: twoHoursLater.toISOString().split("T")[0],
    endTime: twoHoursLater.toTimeString().slice(0, 5),
    location: "",
    eventLink: "",
  };
};

export const createEventData = (
  data: EventFormData,
  initialEvent: Event | null,
  user: { name?: string; email?: string } | null
): Event => {
  return {
    uuid: initialEvent?.uuid || crypto.randomUUID(),
    title: data.title,
    description: data.description,
    eventType: data.eventType,
    category: data.category,
    startDate: new Date(`${data.startDate}T${data.startTime}`).toISOString(),
    endDate: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
    location: data.eventType !== "Online" ? data.location : undefined,
    eventLink: data.eventType === "Online" ? data.eventLink : undefined,
    organizer: initialEvent?.organizer || {
      name: user?.name || "Unknown",
      email: user?.email || "unknown@example.com",
    },
    createdAt: initialEvent?.createdAt || new Date().toISOString(),
  };
};

export const formatConflictingEventDetails = (events: Event[]): string[] => {
  return events.map((event) => {
    const start =
      new Date(event.startDate).toLocaleDateString() +
      " " +
      new Date(event.startDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    const end = new Date(event.endDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${event.title} (${start} - ${end})`;
  });
};

export function filterEvents(
  events: Event[],
  filters: {
    search: string;
    eventType: string;
    category: string;
    dateRange: { start: string | null; end: string | null };
  }
): Event[] {
  return events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.eventType
      ? event.eventType === filters.eventType
      : true;
    const matchesCategory = filters.category
      ? event.category === filters.category
      : true;
    const matchesDateRange =
      filters.dateRange.start && filters.dateRange.end
        ? new Date(event.startDate) >= new Date(filters.dateRange.start) &&
          new Date(event.endDate) <= new Date(filters.dateRange.end)
        : true;
    return matchesSearch && matchesType && matchesCategory && matchesDateRange;
  });
}

export function sortEvents(
  events: Event[],
  sortBy: "startDate" | "title"
): Event[] {
  return [...events].sort((a, b) => {
    if (sortBy === "startDate") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export const formatDateTime = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${startTime} - ${endTime}`;
};

export const calculateDuration = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string => {
  try {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  } catch {
    return "Invalid duration";
  }
};
