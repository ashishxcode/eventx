"use client";

import { createContext, useContext, useState } from "react";
import { Event, EventState, FilterState, EventInput } from "./types";
import { hasTimeConflict } from "./event-utils";
import { useAuth } from "../auth/auth-context";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const EventContext = createContext<
  EventState & {
    addEvent: (event: EventInput) => boolean;
    updateEvent: (uuid: string, event: EventInput) => boolean;
    deleteEvent: (uuid: string) => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
  }
>({
  events: [],
  addEvent: () => false,
  updateEvent: () => false,
  deleteEvent: () => {},
  filters: {
    search: "",
    eventType: "",
    category: "",
    dateRange: { start: null, end: null },
  },
  setFilters: () => {},
});

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useLocalStorage<Event[]>("events", []);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    eventType: "",
    category: "",
    dateRange: { start: null, end: null },
  });
  const { user } = useAuth();

  const addEvent = (event: EventInput) => {
    if (!user) return false;
    const newEvent: Event = {
      ...event,
      uuid: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      organizer: {
        name: user.name || user.email.split("@")[0],
        email: user.email,
      },
    };
    if (hasTimeConflict(events, newEvent)) {
      return false;
    }
    setEvents([...events, newEvent]);
    return true;
  };

  const updateEvent = (uuid: string, event: EventInput) => {
    if (!user) return false;
    const updatedEvent: Event = {
      ...event,
      uuid,
      createdAt:
        events.find((e: Event) => e.uuid === uuid)?.createdAt ||
        new Date().toISOString(),
      organizer: {
        name: user.name || user.email.split("@")[0],
        email: user.email,
      },
    };
    if (
      hasTimeConflict(
        events.filter((e: Event) => e.uuid !== uuid),
        updatedEvent
      )
    ) {
      return false;
    }
    setEvents(events.map((e: Event) => (e.uuid === uuid ? updatedEvent : e)));
    return true;
  };

  const deleteEvent = (uuid: string) => {
    setEvents(events.filter((e: Event) => e.uuid !== uuid));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        filters,
        setFilters,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);
