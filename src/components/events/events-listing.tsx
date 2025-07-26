"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/lib/events/event-context";
import { filterEvents, sortEvents } from "@/lib/events/event-utils";
import type { Event } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import EventForm from "./event-form";
import EventFilters from "./event-filters";
import EventCard from "./event-card";
import EventListItem from "./event-list-item";

export default function EventsListing() {
  const { events, filters, setFilters } = useEvents();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your events
            </p>
          </div>
          <EventForm
            triggerComponent={
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
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

        {/* Filters */}
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Events List */}
        {sortedEvents.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            )}
          >
            {sortedEvents.map((event) =>
              viewMode === "grid" ? (
                <EventCard
                  key={event.uuid}
                  event={event}
                  onEdit={handleEditEvent}
                />
              ) : (
                <EventListItem
                  key={event.uuid}
                  event={event}
                  onEdit={handleEditEvent}
                />
              )
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                {filters.search || filters.eventType || filters.category
                  ? "Try adjusting your filters to see more events."
                  : "Get started by creating your first event."}
              </p>
              {filters.search || filters.eventType || filters.category ? (
                <Button onClick={resetFilters} variant="outline">
                  Clear Filters
                </Button>
              ) : (
                <EventForm
                  triggerComponent={
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
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
