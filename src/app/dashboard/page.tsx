import EventsListing from "@/components/events/events-listing";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // Await the cookies() promise
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  return <EventsListing />;
}
