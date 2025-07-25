import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import ThemeToggle from "./theme-toggle";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 w-full backdrop-blur-lg z-10">
      {/* Logo and Navigation Links */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-2xl font-bold">
          EventX
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <Link href="/events" className="hover:underline">
          Events
        </Link>
      </div>

      {/* Right Side - Theme Toggle and Account Menu */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        {/* Account Dropdown */}
        <AccountDropdown />
      </div>
    </nav>
  );
}
