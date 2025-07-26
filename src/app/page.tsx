import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default async function Home() {
  // Check if user is logged in
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center relative pt-14 sm:pt-16">
        {/* Background Elements */}
        <div className="absolute left-0 top-0 w-64 h-64 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px] rounded-full bg-[rgba(173,109,244,0.5)] opacity-30 sm:opacity-50 blur-[60px] sm:blur-[80px]" />
        <div className="absolute right-0 bottom-0 w-64 h-64 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px] rounded-full bg-[rgba(109,111,244,0.5)] opacity-30 sm:opacity-50 blur-[60px] sm:blur-[80px]" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="block sm:inline">Host amazing events</span>{" "}
            <span className="block sm:inline text-primary">with ease</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            EventX is the ultimate event hosting platform that makes organizing,
            promoting, and managing events simple and enjoyable. From small
            meetups to large conferences, bring your community together.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 rounded-full text-base sm:text-lg font-medium"
              asChild
            >
              <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </Button>
            {!isLoggedIn && (
              <Button
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 rounded-full text-base sm:text-lg font-medium"
                asChild
              >
                <Link href="/login">Login </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
