import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  // Check if user is logged in
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const isLoggedIn = !!session;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold ">
              EventX
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                {isLoggedIn ? "Dashboard" : "Login"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
