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
import { Event } from "@/lib/events/types";
import { EventFormData, eventSchema } from "@/schemas/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface EventCreationDialogProps {
  initialEvent?: Event | null;
  triggerComponent?: ReactNode;
}

export function EventCreationDialog({
  initialEvent = null,
  triggerComponent,
}: EventCreationDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { addEvent, updateEvent } = useEvents();
  const { user } = useAuth();

  const prepareInitialValues = (event: Event | null): EventFormData => {
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
    return {
      title: "",
      description: "",
      eventType: "In-Person",
      category: "",
      startDate: new Date().toISOString().split("T")[0],
      startTime: "00:00",
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
        .toTimeString()
        .slice(0, 5),
      location: "",
      eventLink: "",
    };
  };

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: prepareInitialValues(initialEvent),
  });

  useEffect(() => {
    form.reset(prepareInitialValues(initialEvent));
  }, [initialEvent, form]);

  const onSubmit = (data: EventFormData) => {
    if (!user) {
      alert("You must be logged in to create/edit an event");
      return;
    }

    const eventData: Event = {
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
        name: user.name || "Unknown",
        email: user.email || "unknown@example.com",
      },
      createdAt: initialEvent?.createdAt || new Date().toISOString(),
    };

    const success = initialEvent
      ? updateEvent(initialEvent.uuid, eventData)
      : addEvent(eventData);

    if (success) {
      setIsDialogOpen(false);
      form.reset(prepareInitialValues(null)); // Reset form
    } else {
      alert(
        `Failed to ${
          initialEvent ? "update" : "create"
        } event due to a time conflict.`,
      );
    }
  };

  // If no trigger component is provided, use a default button
  const DefaultTrigger = () => (
    <Button onClick={() => setIsDialogOpen(true)}>
      {initialEvent ? "Edit Event" : "Create New Event"}
    </Button>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {triggerComponent ? (
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      ) : (
        <DefaultTrigger />
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialEvent ? "Update Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {initialEvent
              ? "Update the details of your event."
              : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
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
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {["Online", "Hybrid"].includes(form.watch("eventType")) && (
              <FormField
                control={form.control}
                name="eventLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://zoom.us/j/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the link for the online event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {["In-Person", "Hybrid"].includes(form.watch("eventType")) && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormDescription>
                      Physical address or venue for the event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Conference, Workshop"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EventCreationDialog;
