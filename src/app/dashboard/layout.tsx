"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import DashboardNavbar from "@/components/dashboard-navbar";
import { EventProvider } from "@/lib/events/event-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EventProvider>
        <DashboardNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container px-6 py-8 mx-auto">{children}</div>
        </main>
      </EventProvider>
    </ThemeProvider>
  );
}
