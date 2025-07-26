"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore } from "date-fns";
import { CalendarIcon, Clock, MapPin, Eye, Edit, Trash2 } from "lucide-react";
import type { Event } from "@/lib/events/types";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/lib/events/event-context";
import {
  EVENT_TYPE_MAP,
  EVENT_CATEGORY_MAP,
  EVENT_STATUS_MAP,
} from "@/lib/events/event-constants";

interface EventListItemProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export default function EventListItem({ event, onEdit }: EventListItemProps) {
  const { deleteEvent } = useEvents();

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (isAfter(now, endDate)) return EVENT_STATUS_MAP.past;
    if (isBefore(now, startDate)) return EVENT_STATUS_MAP.upcoming;
    return EVENT_STATUS_MAP.ongoing;
  };

  const eventStatus = getEventStatus();
  const typeConfig =
    EVENT_TYPE_MAP[event.eventType as keyof typeof EVENT_TYPE_MAP] ||
    EVENT_TYPE_MAP.Online;
  const categoryConfig =
    EVENT_CATEGORY_MAP[event.category as keyof typeof EVENT_CATEGORY_MAP] ||
    EVENT_CATEGORY_MAP.Other;
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="mb-3 hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="secondary"
                className={cn("text-xs", eventStatus.className)}
              >
                {eventStatus.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs border", typeConfig.className)}
              >
                <TypeIcon className="w-3 h-3 mr-1" />
                {event.eventType}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs border", categoryConfig.className)}
              >
                {event.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
              <Link href={`/dashboard/events/${event.uuid}`}>
                {event.title}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
              {event.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {format(new Date(event.startDate), "MMM dd, yyyy")}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(event.startDate), "HH:mm")}
              </span>
              {event.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/events/${event.uuid}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
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
                    Are you sure you want to delete &quot;{event.title}&quot;?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteEvent(event.uuid)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
