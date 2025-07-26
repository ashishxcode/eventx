"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth/auth-context";
import { useEvents } from "@/lib/events/event-context";
import type { Event } from "@/lib/events/types";
import {
  hasTimeConflict,
  prepareInitialValues,
  createEventData,
  formatConflictingEventDetails,
} from "@/lib/events/event-utils";
import { type EventFormData, eventSchema } from "@/schemas/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  ERROR_MESSAGES,
  EVENT_TYPES,
  EVENT_CATEGORIES,
  EVENT_TYPE_ICONS,
  SECTION_TITLES,
} from "@/lib/events/event-constants";
import { AlertTriangle, Clock } from "lucide-react";

interface EventFormProps {
  initialEvent?: Event | null;
  triggerComponent?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EventForm({
  initialEvent = null,
  triggerComponent,
  isOpen: controlledOpen,
  onClose,
}: EventFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(controlledOpen || false);
  const [conflictEventError, setConflictEventError] = useState<{
    message: string;
    conflictingEvents: string[];
  } | null>(null);
  const { addEvent, updateEvent, events } = useEvents();
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use controlled open state if provided
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsDialogOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setConflictEventError(null); // Clear error when dialog closes
      form.clearErrors(); // Clear form validation errors when dialog closes
      if (onClose) {
        onClose();
      }
    }
  };

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: prepareInitialValues(initialEvent),
  });

  const watchEventType = form.watch("eventType");

  useEffect(() => {
    form.reset(prepareInitialValues(initialEvent));
    setConflictEventError(null); // Clear error when resetting form
    form.clearErrors(); // Clear form validation errors when resetting form
  }, [initialEvent, form]);

  const onSubmit = (data: EventFormData) => {
    // Clear any existing form validation errors before checking for errors
    form.clearErrors();

    if (!user) {
      setConflictEventError({
        message: ERROR_MESSAGES.NOT_LOGGED_IN,
        conflictingEvents: [],
      });
      // Scroll to top to show the error
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const eventData = createEventData(data, initialEvent, user);

    // Check for time conflicts before saving
    const eventsToCheck = initialEvent
      ? events.filter((event) => event.uuid !== initialEvent.uuid) // Exclude current event when updating
      : events; // Check all events when creating new

    if (hasTimeConflict(eventsToCheck, eventData)) {
      const conflictingEvents = eventsToCheck.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const newStart = new Date(eventData.startDate);
        const newEnd = new Date(eventData.endDate);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });

      setConflictEventError({
        message: ERROR_MESSAGES.TIME_CONFLICT,
        conflictingEvents: formatConflictingEventDetails(conflictingEvents),
      });
      // Scroll to top to show the error
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const success = initialEvent
      ? updateEvent(initialEvent.uuid, eventData)
      : addEvent(eventData);

    if (success) {
      handleOpenChange(false);
      form.reset(prepareInitialValues(null));
      setConflictEventError(null); // Clear error on successful submission
    } else {
      setConflictEventError({
        message: initialEvent
          ? ERROR_MESSAGES.UPDATE_FAILED
          : ERROR_MESSAGES.CREATE_FAILED,
        conflictingEvents: [],
      });
      // Scroll to top to show the error
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleSubmit = async () => {
    setConflictEventError(null); // Clear previous errors before validation
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      onSubmit(data);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {triggerComponent && (
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {initialEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {initialEvent
                ? "Update the details of your event."
                : "Fill in the details to create a new event."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6" ref={scrollContainerRef}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              {/* Error Message Display */}
              {conflictEventError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    <p>{conflictEventError.message}</p>
                    {conflictEventError.conflictingEvents.length > 0 && (
                      <>
                        <p className="mt-2 font-semibold">
                          Conflicting Events:
                        </p>
                        <ul className="list-disc pl-5">
                          {conflictEventError.conflictingEvents.map(
                            (event, index) => (
                              <li key={index}>{event}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <Card>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <EVENT_TYPE_ICONS.default className="w-5 h-5 mr-2" />
                    <span className="ml-2">
                      {SECTION_TITLES.BASIC_INFORMATION}
                    </span>
                  </h3>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a compelling event title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event, what attendees can expect, and any important details..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    <div className="flex items-center">
                                      <Icon className="w-4 h-4 mr-2" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_CATEGORIES.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {SECTION_TITLES.DATE_TIME}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location/Link */}
              <Card>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    {(() => {
                      const Icon =
                        EVENT_TYPE_ICONS[
                          watchEventType as keyof typeof EVENT_TYPE_ICONS
                        ] || EVENT_TYPE_ICONS.default;
                      return <Icon className="w-4 h-4 mr-2" />;
                    })()}
                    <span className="ml-2">
                      {watchEventType === "Online"
                        ? SECTION_TITLES.EVENT_LINK
                        : SECTION_TITLES.LOCATION_DETAILS}
                    </span>
                  </h3>

                  {watchEventType === "Online" && (
                    <FormField
                      control={form.control}
                      name="eventLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Link *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://zoom.us/j/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide the link where attendees can join the online
                            event
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {(watchEventType === "In-Person" ||
                    watchEventType === "Hybrid") && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the venue address or location details"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Physical address or venue where the event will take
                            place
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchEventType === "Hybrid" && (
                    <FormField
                      control={form.control}
                      name="eventLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Online Link (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://zoom.us/j/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link for remote attendees to join virtually
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t p-4">
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {initialEvent ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
