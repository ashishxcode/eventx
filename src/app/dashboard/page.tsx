import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Events from "@/components/events/events";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // Await the cookies() promise
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Welcome</h1>
      <Events />
    </>
  );
}
