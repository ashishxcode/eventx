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
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center relative pt-16">
        <div className="absolute left-0 top-0 size-[400px] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-32 sm:py-48 lg:py-56 text-center">
          {/* Hero Content */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Host amazing events with ease
          </h1>
          <p className="mt-6 text-lg leading-8 ">
            EventX is the ultimate event hosting platform that makes organizing,
            promoting, and managing events simple and enjoyable. From small
            meetups to large conferences, bring your community together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button className="px-8 py-6 rounded-full text-lg" asChild>
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 size-[400px] rounded-full bg-[rgba(109,111,244,0.5)] opacity-50 blur-[80px]" />
      </section>
    </>
  );
}
