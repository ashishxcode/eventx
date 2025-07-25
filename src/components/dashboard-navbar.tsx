import React from "react";
import ThemeToggle from "./theme-toggle";
import AccountDropdown from "./account-dropdown";
import Link from "next/link";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 w-full backdrop-blur-lg  z-10">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold ">
          EventX
        </Link>
      </div>

      {/* Main Navigation Menu */}

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
