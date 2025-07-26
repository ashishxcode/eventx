"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SortAsc } from "lucide-react";
import { useState } from "react";
import { EVENT_TYPES, EVENT_CATEGORIES } from "@/lib/events/event-constants";

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  sortBy: "startDate" | "title";
  setSortBy: (value: "startDate" | "title") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export default function EventFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  applyFilters,
  resetFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: EventFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="px-4 py-4">
      <CardContent className="p-0">
        {/* Mobile-first layout */}
        {/* Search Bar - Always visible */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-10 w-full"
          />
        </div>

        {/* Mobile Filter Toggle & Desktop Inline Filters */}
        <div className="flex flex-col lg:hidden space-y-3">
          {/* Mobile: Filter Toggle Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-");
                  setSortBy(field as "startDate" | "title");
                  setSortOrder(order as "asc" | "desc");
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startDate-asc">Date ↑</SelectItem>
                  <SelectItem value="startDate-desc">Date ↓</SelectItem>
                  <SelectItem value="title-asc">A-Z</SelectItem>
                  <SelectItem value="title-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile: Collapsible Filters */}
          {showFilters && (
            <div className="space-y-3 border-t pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Event Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={applyFilters} className="flex-1 sm:flex-none">
                  Apply Filters
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Horizontal Layout (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-wrap xl:flex-nowrap gap-3 items-end">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 flex-1">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={applyFilters} size="sm">
              Apply
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Reset
            </Button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 border-l pl-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </span>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortBy(field as "startDate" | "title");
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate-asc">Date (Newest)</SelectItem>
                <SelectItem value="startDate-desc">Date (Oldest)</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
