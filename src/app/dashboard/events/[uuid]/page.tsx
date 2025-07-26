import EventDetails from "@/components/events/event-details";

interface EventPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { uuid } = await params;

  return <EventDetails eventId={uuid} />;
}
