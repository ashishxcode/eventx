"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore } from "date-fns";
import {
  CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
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

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export default function EventCard({ event, onEdit }: EventCardProps) {
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
    <Card className="group hover:shadow-lg transition-all duration-300 border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={cn("text-xs font-medium", eventStatus.className)}
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
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {event.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.startDate), "MMM dd, yyyy")}</span>
            <Clock className="w-4 h-4 ml-4 mr-2" />
            <span>{format(new Date(event.startDate), "HH:mm")}</span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.eventLink && (
            <div className="flex items-center text-sm text-muted-foreground">
              <ExternalLink className="w-4 h-4 mr-2" />
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                Join Event
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn("text-xs border", categoryConfig.className)}
            >
              {event.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <Link href={`/dashboard/events/${event.uuid}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => onEdit(event)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
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
        </div>
      </CardContent>
    </Card>
  );
}
