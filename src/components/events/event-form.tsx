"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  calculateDuration,
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
import { AlertTriangle, Clock, X, Info } from "lucide-react";

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
      setConflictEventError(null);
      form.clearErrors();
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
  const watchStartDate = form.watch("startDate");
  const watchStartTime = form.watch("startTime");
  const watchEndDate = form.watch("endDate");
  const watchEndTime = form.watch("endTime");

  // Calculate duration for display
  const eventDuration =
    watchStartDate && watchStartTime && watchEndDate && watchEndTime
      ? calculateDuration(
          watchStartDate,
          watchStartTime,
          watchEndDate,
          watchEndTime
        )
      : null;

  // Check if times are valid for duration display
  const isValidDuration = (() => {
    if (!watchStartDate || !watchStartTime || !watchEndDate || !watchEndTime)
      return false;
    try {
      const start = new Date(`${watchStartDate}T${watchStartTime}`);
      const end = new Date(`${watchEndDate}T${watchEndTime}`);
      return end > start;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    form.reset(prepareInitialValues(initialEvent));
    setConflictEventError(null);
    form.clearErrors();
  }, [initialEvent, form]);

  const onSubmit = (data: EventFormData) => {
    form.clearErrors();

    if (!user) {
      setConflictEventError({
        message: ERROR_MESSAGES.NOT_LOGGED_IN,
        conflictingEvents: [],
      });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const eventData = createEventData(data, initialEvent, user);

    // Check for time conflicts before saving
    const eventsToCheck = initialEvent
      ? events.filter((event) => event.uuid !== initialEvent.uuid)
      : events;

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
      setConflictEventError(null);
    } else {
      setConflictEventError({
        message: initialEvent
          ? ERROR_MESSAGES.UPDATE_FAILED
          : ERROR_MESSAGES.CREATE_FAILED,
        conflictingEvents: [],
      });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {triggerComponent && (
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      )}
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-[700px] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            {/* Header with close button */}
            <DialogHeader className="flex-shrink-0 bg-background border-b p-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg sm:text-xl font-bold pr-8">
                  {initialEvent ? "Edit Event" : "Create New Event"}
                </DialogTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                  onClick={() => handleOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </DialogHeader>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto px-4 sm:px-6"
              ref={scrollContainerRef}
            >
              <div className="space-y-4">
                {/* Error Message Display */}
                {conflictEventError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <AlertTitle className="text-sm sm:text-base">
                      Error
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      <p>{conflictEventError.message}</p>
                      {conflictEventError.conflictingEvents.length > 0 && (
                        <>
                          <p className="mt-2 font-semibold">
                            Conflicting Events:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            {conflictEventError.conflictingEvents.map(
                              (event, index) => (
                                <li key={index} className="text-xs sm:text-sm">
                                  {event}
                                </li>
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
                    <h3 className="text-base sm:text-lg font-semibold flex items-center">
                      <EVENT_TYPE_ICONS.default className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      <span className="ml-1 sm:ml-2">
                        {SECTION_TITLES.BASIC_INFORMATION}
                      </span>
                    </h3>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Event Title *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a compelling event title"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Description *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your event, what attendees can expect, and any important details..."
                              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Event Type *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full text-sm sm:text-base">
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
                                      className="text-sm sm:text-base"
                                    >
                                      <div className="flex items-center">
                                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Category *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full text-sm sm:text-base">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {EVENT_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                    className="text-sm sm:text-base"
                                  >
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Date & Time */}
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        <span className="ml-1 sm:ml-2">
                          {SECTION_TITLES.DATE_TIME}
                        </span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Start Date *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="text-sm sm:text-base"
                                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              Start Time *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                className="text-sm sm:text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              End Date *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="text-sm sm:text-base"
                                min={
                                  watchStartDate ||
                                  new Date().toISOString().split("T")[0]
                                } // End date can't be before start date
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">
                              End Time *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                className="text-sm sm:text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Duration warning for very short or very long events */}
                    {eventDuration && isValidDuration && (
                      <div className="text-muted-foreground">
                        {(() => {
                          const start = new Date(
                            `${watchStartDate}T${watchStartTime}`
                          );
                          const end = new Date(
                            `${watchEndDate}T${watchEndTime}`
                          );
                          const durationMs = end.getTime() - start.getTime();
                          const minutes = durationMs / (1000 * 60);

                          if (minutes < 15) {
                            return (
                              <div className="flex items-center text-amber-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Event duration is very short ({eventDuration})
                              </div>
                            );
                          } else if (minutes > 480) {
                            // 8 hours
                            return (
                              <div className="flex items-center text-blue-600 dark:text-blue-400">
                                <Info className="w-3 h-3 mr-1" />
                                This is a long event ({eventDuration})
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Location/Link */}
                <Card>
                  <CardContent className="space-y-4 ">
                    <h3 className="text-base sm:text-lg font-semibold flex items-center">
                      {(() => {
                        const Icon =
                          EVENT_TYPE_ICONS[
                            watchEventType as keyof typeof EVENT_TYPE_ICONS
                          ] || EVENT_TYPE_ICONS.default;
                        return (
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        );
                      })()}
                      <span className="ml-1 sm:ml-2">
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
                            <FormLabel className="text-sm sm:text-base">
                              Event Link *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://zoom.us/j/..."
                                className="text-sm sm:text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm">
                              Provide the link where attendees can join the
                              online event
                            </FormDescription>
                            <FormMessage className="text-xs sm:text-sm" />
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
                            <FormLabel className="text-sm sm:text-base">
                              Location *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the venue address or location details"
                                className="text-sm sm:text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm">
                              Physical address or venue where the event will
                              take place
                            </FormDescription>
                            <FormMessage className="text-xs sm:text-sm" />
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
                            <FormLabel className="text-sm sm:text-base">
                              Online Link (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://zoom.us/j/..."
                                className="text-sm sm:text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm">
                              Link for remote attendees to join virtually
                            </FormDescription>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer with action buttons */}
            <DialogFooter className="flex-shrink-0 bg-background border-t p-4 sm:p-6">
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  type="submit"
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {initialEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
