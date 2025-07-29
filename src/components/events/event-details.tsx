"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EVENT_STATUS_MAP, EVENT_TYPE_MAP } from "@/lib/events/event-constants";
import { useEvents } from "@/lib/events/event-context";
import type { Event } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore } from "date-fns";
import {
  ArrowLeft,
  Building,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Share2,
  Timer,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetails({ eventId }: EventDetailPageProps) {
  const { events } = useEvents();
  const [copied, setCopied] = useState(false);

  const event = events.find((e: Event) => e.uuid === eventId);

  if (!event) {
    return (
      <Card className="flex-1 flex flex-col space-y-4 sm:space-y-6">
        <CardContent className="text-center py-12 flex-1 flex  flex-col items-center justify-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Event Not Found</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const typeConfig =
    EVENT_TYPE_MAP[event.eventType as keyof typeof EVENT_TYPE_MAP] ||
    EVENT_TYPE_MAP.Online;
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
  const duration = Math.ceil(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      (1000 * 60 * 60)
  );

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
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Error copying:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
      {/* Navigation (unchanged) */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Hero Section (update TypeIcon styling) */}
      <div>
        <Card className="bg-gradient-to-br from-background to-muted/30">
          <CardContent>
            <div className="flex flex-col lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                  {event.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-sm font-medium px-3 py-1",
                    eventStatus.className
                  )}
                >
                  {eventStatus.status === "ongoing" && (
                    <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse" />
                  )}
                  {eventStatus.label}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <TypeIcon className="w-3 h-3 mr-1.5 text-blue-600 dark:text-blue-400" />
                  {event.eventType}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {event.category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Schedule</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-muted-foreground">
                        Start Date
                      </div>
                      <div className="font-semibold">
                        {format(
                          new Date(event.startDate),
                          "EEEE, MMMM dd, yyyy"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-muted-foreground">
                        Time
                      </div>
                      <div className="font-semibold">
                        {format(new Date(event.startDate), "h:mm a")} -{" "}
                        {format(new Date(event.endDate), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                  <Timer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-muted-foreground">
                    Duration
                  </div>
                  <div className="font-semibold">
                    {duration === 1 ? "1 hour" : `${duration} hours`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location/Access */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TypeIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {event.eventType === "Online"
                    ? "Event Access"
                    : "Location & Access"}
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.location && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 mt-0.5">
                    <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-muted-foreground mb-1">
                      Venue
                    </div>
                    <div className="font-semibold">{event.location}</div>
                  </div>
                </div>
              )}

              {event.eventLink && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/50 mt-0.5">
                    <LinkIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    {eventStatus.status !== "past" ? (
                      <Button asChild className="w-full sm:w-auto">
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open Event Link
                        </a>
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                        Event has ended
                      </div>
                    )}
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
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Organizer</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{event.organizer.name}</div>
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
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.eventLink && (
                  <Button asChild className="w-full">
                    <a
                      href={event.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Event
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Event Details (update Event ID copy button) */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Event Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Created
                </div>
                <div className="text-sm">
                  {format(
                    new Date(event.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Event ID
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded-sm font-mono flex-1 break-all">
                    {event.uuid}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
