"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import DashboardNavbar from "@/components/dashboard-navbar";
import { EventProvider } from "@/lib/events/event-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <EventProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <DashboardNavbar />
          <main className="flex-1 flex flex-col  overflow-x-hidden overflow-y-auto ">
            <div className="container flex-1 flex flex-col max-w-7xl  p-4 sm:p-8 mx-auto">
              {children}
            </div>
          </main>
        </div>
      </EventProvider>
    </ThemeProvider>
  );
}
