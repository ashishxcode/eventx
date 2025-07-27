"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Search, Filter, ArrowUpDown, X, Tag, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { EVENT_TYPES, EVENT_CATEGORIES } from "@/lib/events/event-constants";
import { useEventFilters } from "@/hooks/useEventFilters";
import { cn } from "@/lib/utils";

interface EventFiltersProps {
  className?: string;
}

export default function EventFilters({ className }: EventFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const formatDateForBadge = (dateString: string): string => {
    try {
      // Parse the YYYY-MM-DD format and format it nicely
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy");
    } catch {
      // Fallback to original string if parsing fails
      return dateString;
    }
  };

  const {
    searchTerm,
    selectedType,
    selectedCategory,
    dateRange,
    sortBy,
    sortOrder,
    hasActiveFilters,
    eventCount,
    actions,
  } = useEventFilters();

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    actions.setSortConfig(
      field as "startDate" | "title",
      order as "asc" | "desc"
    );
  };

  const activeFilterCount = [
    searchTerm.trim(),
    selectedType !== "all",
    selectedCategory !== "all",
    dateRange.start || dateRange.end,
  ].filter(Boolean).length;

  return (
    <div className={cn("bg-background", className)}>
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-3">
          <Select value={selectedType} onValueChange={actions.setSelectedType}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCategory}
            onValueChange={actions.setSelectedCategory}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
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

          <DateRangePicker
            key={`desktop-${dateRange.start}-${dateRange.end}`}
            value={dateRange}
            onChange={actions.setDateRange}
            placeholder="Select date or range"
          />

          <div className="w-px h-6 bg-border" />

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate-asc">Date (Soon)</SelectItem>
              <SelectItem value="startDate-desc">Date (Later)</SelectItem>
              <SelectItem value="title-asc">Name (A-Z)</SelectItem>
              <SelectItem value="title-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex lg:hidden items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="justify-start flex-1 bg-muted/50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="flex-1">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate-asc">Soon</SelectItem>
              <SelectItem value="startDate-desc">Later</SelectItem>
              <SelectItem value="title-asc">A-Z</SelectItem>
              <SelectItem value="title-desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Expanded Filters */}
      {showMobileFilters && (
        <div className="lg:hidden mt-4 p-4 border rounded-lg space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm inline-block font-medium text-muted-foreground">
                Date Range
              </label>
              <DateRangePicker
                key={`mobile-${dateRange.start}-${dateRange.end}`}
                value={dateRange}
                onChange={actions.setDateRange}
                placeholder="Select date or range"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm inline-block font-medium text-muted-foreground">
                Event Type
              </label>
              <Select
                value={selectedType}
                onValueChange={actions.setSelectedType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm inline-block font-medium text-muted-foreground">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={actions.setSelectedCategory}
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

          {hasActiveFilters && (
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.clearAllFilters}
                className="border-0 bg-background text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {eventCount.filtered === eventCount.total
              ? `${eventCount.total} events`
              : `${eventCount.filtered} of ${eventCount.total} events`}
          </span>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  {searchTerm.slice(0, 20)}
                  {searchTerm.length > 20 ? "..." : ""}
                </Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {EVENT_TYPES.find((t) => t.value === selectedType)?.label}
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {
                    EVENT_CATEGORIES.find((c) => c.value === selectedCategory)
                      ?.label
                  }
                </Badge>
              )}
              {(dateRange.start || dateRange.end) && (
                <Badge variant="secondary" className="text-xs">
                  {dateRange.start && dateRange.end
                    ? `${formatDateForBadge(dateRange.start)} - ${formatDateForBadge(dateRange.end)}`
                    : dateRange.start
                    ? `From ${formatDateForBadge(dateRange.start)}`
                    : `Until ${formatDateForBadge(dateRange.end!)}`}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Quick Clear on Desktop */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.clearAllFilters}
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
