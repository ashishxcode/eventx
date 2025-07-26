"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/lib/events/event-context";
import { filterEvents, sortEvents } from "@/lib/events/event-utils";
import type { Event } from "@/lib/events/types";
import { Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import EventForm from "./event-form";
import EventFilters from "./event-filters";
import EventCard from "./event-card";

export default function EventsListing() {
  const { events, filters, setFilters } = useEvents();
  const [sortBy, setSortBy] = useState<"startDate" | "title">("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedType, setSelectedType] = useState(filters.eventType || "all");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || "all"
  );

  // Apply filters
  const applyFilters = () => {
    setFilters({
      search: searchTerm,
      eventType: selectedType === "all" ? "" : selectedType,
      category: selectedCategory === "all" ? "" : selectedCategory,
      dateRange: filters.dateRange,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setFilters({
      search: "",
      eventType: "",
      category: "",
      dateRange: { start: null, end: null },
    });
  };

  // Handle edit dialog
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  // Get filtered and sorted events
  const filteredEvents = filterEvents(events, filters);
  const sortedEvents = sortEvents(filteredEvents, sortBy);
  if (sortOrder === "desc") {
    sortedEvents.reverse();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage and organize your events
            </p>
          </div>
          <EventForm
            triggerComponent={
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Create Event</span>
                <span className="xs:hidden">Create</span>
              </Button>
            }
          />
        </div>

        {/* Edit Event Dialog */}
        <EventForm
          initialEvent={editingEvent}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
        />

        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Events List */}
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.uuid}
                event={event}
                onEdit={handleEditEvent}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 sm:py-12">
            <CardContent className="px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                No events found
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
                {filters.search || filters.eventType || filters.category
                  ? "Try adjusting your filters to see more events."
                  : "Get started by creating your first event."}
              </p>
              {filters.search || filters.eventType || filters.category ? (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              ) : (
                <EventForm
                  triggerComponent={
                    <Button className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        Create Your First Event
                      </span>
                      <span className="sm:hidden">Create Event</span>
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
