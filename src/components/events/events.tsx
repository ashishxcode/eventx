"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/lib/events/event-context";
import { filterEvents, sortEvents } from "@/lib/events/event-utils";
import { Event } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Grid, List, Plus, X } from "lucide-react";
import { useState } from "react";
import EventForm from "./event-form";

// Color mapping for event types
const EVENT_TYPE_COLORS = {
  Online: "bg-blue-100 text-blue-800",
  "In-Person": "bg-green-100 text-green-800",
  Hybrid: "bg-purple-100 text-purple-800",
};

// Color mapping for categories
const CATEGORY_COLORS = {
  Conference: "bg-orange-100 text-orange-800",
  Workshop: "bg-teal-100 text-teal-800",
  Seminar: "bg-indigo-100 text-indigo-800",
  Webinar: "bg-pink-100 text-pink-800",
  Other: "bg-gray-100 text-gray-800",
};

export default function Events() {
  const { events, deleteEvent, filters, setFilters } = useEvents();

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync local filters with context filters
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    eventTypes: filters.eventType ? filters.eventType.split(",") : [],
    categories: filters.category ? filters.category.split(",") : [],
    dateRange: {
      start: filters.dateRange.start ? new Date(filters.dateRange.start) : null,
      end: filters.dateRange.end ? new Date(filters.dateRange.end) : null,
    },
  });

  // Apply filters to context
  const applyFilters = () => {
    setFilters({
      search: localFilters.search,
      eventType: localFilters.eventTypes.join(","),
      category: localFilters.categories.join(","),
      dateRange: {
        start: localFilters.dateRange.start?.toISOString() || null,
        end: localFilters.dateRange.end?.toISOString() || null,
      },
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setLocalFilters({
      search: "",
      eventTypes: [],
      categories: [],
      dateRange: { start: null, end: null },
    });
    setFilters({
      search: "",
      eventType: "",
      category: "",
      dateRange: { start: null, end: null },
    });
  };

  // Extract unique event types and categories
  const uniqueEventTypes = Array.from(new Set(events.map((e) => e.eventType)));
  const uniqueCategories = Array.from(new Set(events.map((e) => e.category)));

  // Filter and sort events
  const filteredEvents = filterEvents(events, filters);
  const sortedEvents = sortEvents(filteredEvents, "startDate");

  // Handle multi-select for event types
  const handleEventTypeChange = (value: string) => {
    const newTypes = localFilters.eventTypes.includes(value)
      ? localFilters.eventTypes.filter((t) => t !== value)
      : [...localFilters.eventTypes, value];
    setLocalFilters({ ...localFilters, eventTypes: newTypes });
  };

  // Handle multi-select for categories
  const handleCategoryChange = (value: string) => {
    const newCategories = localFilters.categories.includes(value)
      ? localFilters.categories.filter((c) => c !== value)
      : [...localFilters.categories, value];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  // Render event card with flexible layout
  const renderEventCard = (event: Event, mode: "grid" | "list") => {
    const EventTypeTag = () => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS.Other
        }`}
      >
        {event.eventType}
      </span>
    );

    const CategoryTag = () => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other
        }`}
      >
        {event.category}
      </span>
    );

    if (mode === "grid") {
      return (
        <div
          key={event.uuid}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                {event.title}
              </h3>
              <div className="flex space-x-2">
                <EventForm
                  initialEvent={event}
                  triggerComponent={
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => deleteEvent(event.uuid)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {event.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <EventTypeTag />
                <CategoryTag />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(event.startDate), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // List view
    return (
      <div
        key={event.uuid}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {event.title}
              </h3>
              <EventTypeTag />
              <CategoryTag />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {event.description}
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(event.startDate), "MMMM dd, yyyy")}
              {event.location && ` | ${event.location}`}
            </div>
          </div>
          <div className="flex space-x-2">
            <EventForm
              initialEvent={event}
              triggerComponent={
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              }
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteEvent(event.uuid)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gray-100" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gray-100" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <EventForm
            triggerComponent={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            }
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Search events..."
              value={localFilters.search}
              onChange={(e) => {
                setLocalFilters({ ...localFilters, search: e.target.value });
              }}
            />
          </div>

          {/* Event Type Filter */}
          <div className="relative">
            <Select
              onValueChange={handleEventTypeChange}
              // No value prop needed for multi-select; controlled via localFilters.eventTypes
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <SelectValue
                    placeholder="Select Event Types"
                    className="truncate"
                  >
                    {localFilters.eventTypes.length > 0
                      ? localFilters.eventTypes.join(", ")
                      : "Select Event Types"}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {uniqueEventTypes.length > 0 ? (
                  uniqueEventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "mr-2 h-2 w-2 rounded-full",
                            EVENT_TYPE_COLORS[type]
                              ? EVENT_TYPE_COLORS[type].replace("text-", "bg-")
                              : "bg-gray-400",
                          )}
                        />
                        {type}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No event types available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Select
              onValueChange={handleCategoryChange}
              // No value prop needed for multi-select; controlled via localFilters.categories
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <SelectValue
                    placeholder="Select Categories"
                    className="truncate"
                  >
                    {localFilters.categories.length > 0
                      ? localFilters.categories.join(", ")
                      : "Select Categories"}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.length > 0 ? (
                  uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "mr-2 h-2 w-2 rounded-full",
                            CATEGORY_COLORS[category]
                              ? CATEGORY_COLORS[category].replace(
                                  "text-",
                                  "bg-",
                                )
                              : "bg-gray-400",
                          )}
                        />
                        {category}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No categories available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between overflow-hidden",
                  !localFilters.dateRange.start && "text-muted-foreground",
                )}
              >
                <div className="flex items-center">
                  {localFilters.dateRange.start
                    ? `${format(localFilters.dateRange.start, "PPP")} - ${
                        localFilters.dateRange.end
                          ? format(localFilters.dateRange.end, "PPP")
                          : "Present"
                      }`
                    : "Select Date Range"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={localFilters.dateRange.start}
                selected={localFilters.dateRange}
                onSelect={(range) => {
                  setLocalFilters({
                    ...localFilters,
                    dateRange: {
                      start: range?.from || null,
                      end: range?.to || null,
                    },
                  });
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Filter Actions */}
        <div className="flex items-center space-x-2">
          {(localFilters.search ||
            localFilters.eventTypes.length > 0 ||
            localFilters.categories.length > 0 ||
            localFilters.dateRange.start) && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear
            </Button>
          )}
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Events Listing */}
      {sortedEvents.length > 0 ? (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1",
          )}
        >
          {sortedEvents.map((event) => renderEventCard(event, viewMode))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-6 flex justify-center items-center">
            <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            No Events Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            It looks like there are no events matching your filters.
          </p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}

      {/* Pagination (optional, can be added later) */}
      {sortedEvents.length > 12 && (
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <Button variant="ghost" size="sm">
              Previous
            </Button>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
