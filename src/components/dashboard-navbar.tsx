import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 w-full backdrop-blur-lg border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 z-10">
      {/* Logo and Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/dashboard"
          className="text-xl sm:text-2xl font-bold transition-colors hover:text-primary"
        >
          EventX
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Separator */}
          <div className="h-6 w-px bg-border"></div>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Right Side - Theme Toggle and Account Menu */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          <ThemeToggle />
          <AccountDropdown />
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-4">
                <Link
                  href="/dashboard"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="pt-4 border-t">
                  <AccountDropdown />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
