import React from "react";
import ThemeToggle from "./theme-toggle";
import AccountDropdown from "./account-dropdown";

export default function DashboardNavbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b bg-background">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">EventX</h1>
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
