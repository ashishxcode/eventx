"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/lib/events/event-context";
import type { Event } from "@/lib/events/types";
import { format, isAfter, isBefore } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  User,
  ArrowLeft,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EventForm from "./event-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  EVENT_TYPE_MAP,
  EVENT_CATEGORY_MAP,
  EVENT_STATUS_MAP,
} from "@/lib/events/event-constants";

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetails({ eventId }: EventDetailPageProps) {
  const { events, deleteEvent } = useEvents();
  const router = useRouter();

  const event = events.find((e: Event) => e.uuid === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The event you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeConfig =
    EVENT_TYPE_MAP[event.eventType as keyof typeof EVENT_TYPE_MAP] ||
    EVENT_TYPE_MAP.Online;
  const categoryConfig =
    EVENT_CATEGORY_MAP[event.category as keyof typeof EVENT_CATEGORY_MAP] ||
    EVENT_CATEGORY_MAP.Other;
  const TypeIcon = typeConfig.icon;

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (isAfter(now, endDate)) return EVENT_STATUS_MAP.past;
    if (isBefore(now, startDate)) return EVENT_STATUS_MAP.upcoming;
    return EVENT_STATUS_MAP.ongoing;
  };

  const eventStatus = getEventStatus();

  const handleDelete = () => {
    deleteEvent(event.uuid);
    router.push("/dashboard");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Event Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={cn("text-sm font-medium", eventStatus.className)}
                  >
                    {eventStatus.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-sm border", typeConfig.className)}
                  >
                    <TypeIcon className="w-4 h-4 mr-1" />
                    {event.eventType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-sm border", categoryConfig.className)}
                  >
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {event.title}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <EventForm
                  initialEvent={event}
                  triggerComponent={
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{event.title}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-foreground">
                    <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Start Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(
                          new Date(event.startDate),
                          "EEEE, MMMM dd, yyyy"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-foreground">
                    <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.startDate), "h:mm a")} -{" "}
                        {format(new Date(event.endDate), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="font-medium mb-2">Duration</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.ceil(
                      (new Date(event.endDate).getTime() -
                        new Date(event.startDate).getTime()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location/Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TypeIcon className="w-5 h-5 mr-2" />
                  {event.eventType === "Online" ? "Event Access" : "Location"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.location && (
                  <div className="flex items-start text-foreground">
                    <MapPin className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Venue</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                )}
                {event.eventLink && (
                  <div className="flex items-start text-foreground">
                    <ExternalLink className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-2">Join Event</div>
                      <Button asChild className="w-full">
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Event Link
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Organizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-foreground">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{event.organizer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.organizer.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {eventStatus.status !== "past" && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.eventLink && (
                    <Button asChild className="w-full">
                      <a
                        href={event.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Event
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-muted-foreground">
                    Created
                  </div>
                  <div>{format(new Date(event.createdAt), "MMM dd, yyyy")}</div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="font-medium text-muted-foreground">
                    Event ID
                  </div>
                  <div className="font-mono text-xs bg-muted p-2 rounded-sm">
                    {event.uuid}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
