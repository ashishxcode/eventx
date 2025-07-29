"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EVENT_STATUS_MAP, EVENT_TYPE_MAP } from "@/lib/events/event-constants";
import { useEvents } from "@/lib/events/event-context";
import type { Event } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore } from "date-fns";
import {
  CalendarIcon,
  Edit,
  ExternalLink,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export default function EventCard({ event, onEdit }: EventCardProps) {
  const { deleteEvent } = useEvents();
  const router = useRouter();

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
  const TypeIcon = typeConfig.icon;

  return (
    <Card
      onClick={() => router.push(`/dashboard/events/${event.uuid}`)}
      className="cursor-pointer"
    >
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-2">
            {event.title}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {event.description}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm sm:max-w-lg mx-4 rounded-xl border-0 shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold">
                    Delete Event
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete &quot;{event.title}&quot;?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto rounded-lg">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteEvent(event.uuid)}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto rounded-lg"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="relative flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 mr-3">
                <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">
                {format(new Date(event.startDate), "HH:mm a")} -{" "}
                {format(new Date(event.startDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 mr-3">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-medium truncate">{event.location}</span>
            </div>
          )}

          {event.eventLink && (
            <div className="flex items-center text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/50 mr-3">
                <ExternalLink className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline truncate transition-colors"
              >
                Join Event
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Badge
          variant="secondary"
          className={cn("text-sm font-medium px-3 py-1", eventStatus.className)}
        >
          {eventStatus.status === "ongoing" && (
            <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse" />
          )}
          {eventStatus.label}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <TypeIcon className="w-3 h-3 mr-1.5" />
          {event.eventType}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {event.category}
        </Badge>
      </CardFooter>
    </Card>
  );
}
