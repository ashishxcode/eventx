import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // Await the cookies() promise
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex items-center w-full justify-center`">
      <div className={cn("flex flex-col gap-6 max-w-md sm:w-full")}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
        </div>
        <p>This is a protected dashboard page.</p>
      </div>
    </div>
  );
}
