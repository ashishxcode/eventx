"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/events/types";
import { Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import EventForm from "./event-form";
import EventFilters from "./event-filters";
import EventCard from "./event-card";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function EventsListing() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { filteredAndSortedEvents, hasActiveFilters, eventCount } =
    useEventFilters();

  // Handle edit dialog
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
      {/* Header - Fixed height */}
      <div className="flex-none flex sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Events</h1>
          {eventCount.total > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? (
                <>
                  {eventCount.filtered} of {eventCount.total} events
                  {eventCount.filtered !== eventCount.total && " (filtered)"}
                </>
              ) : (
                `${eventCount.total} event${
                  eventCount.total !== 1 ? "s" : ""
                } total`
              )}
            </p>
          )}
        </div>
        <EventForm
          triggerComponent={
            <Button size="default" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
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

      {/* Events List - Takes remaining height */}
      <div className="flex-1 flex flex-col min-h-0">
        <EventFilters className="mb-6" />

        {filteredAndSortedEvents.length > 0 ? (
          <div className="h-full">
            {/* Scrollable grid container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
              {filteredAndSortedEvents.map((event) => (
                <EventCard
                  key={event.uuid}
                  event={event}
                  onEdit={handleEditEvent}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState hasActiveFilters={hasActiveFilters} />
        )}
      </div>
    </div>
  );
}

/**
 * Empty state component for when no events are found
 */
interface EmptyStateProps {
  hasActiveFilters: boolean;
}

function EmptyState({ hasActiveFilters }: EmptyStateProps) {
  return (
    <Card className="h-full text-center py-8 sm:py-12 w-full flex-1">
      <CardContent className="h-full flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          No events found
        </h3>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
          {hasActiveFilters
            ? "Try adjusting your filters to see more events."
            : "Get started by creating your first event."}
        </p>
        <EventForm
          triggerComponent={
            <Button>
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
