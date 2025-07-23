import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import SignoutButton from "@/components/auth/signout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const displayName = data.user.user_metadata?.display_name || "User";

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-100 p-4">
      <div className={cn("flex flex-col gap-6 max-w-md sm:w-full")}>
        <h1 className="text-2xl font-bold">Welcome, {displayName}</h1>
        <p>Email: {data.user.email}</p>
        <p>This is a protected dashboard page.</p>
        <SignoutButton />
      </div>
    </div>
  );
}
