import { Event } from "./types";

export function hasTimeConflict(events: Event[], newEvent: Event): boolean {
  const newStart = new Date(newEvent.startDate);
  const newEnd = new Date(newEvent.endDate);

  return events.some((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return (
      (newStart >= start && newStart < end) ||
      (newEnd > start && newEnd <= end) ||
      (newStart <= start && newEnd >= end)
    );
  });
}

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
