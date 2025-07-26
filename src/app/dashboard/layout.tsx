"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import DashboardNavbar from "@/components/dashboard-navbar";
import { EventProvider } from "@/lib/events/event-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EventProvider>
        <div className="min-h-screen bg-background">
          <DashboardNavbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto ">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </EventProvider>
    </ThemeProvider>
  );
}
