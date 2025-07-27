import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEvents } from "@/lib/events/event-context";
import { filterEvents, sortEvents } from "@/lib/events/event-utils";
import type { Event } from "@/lib/events/types";

export interface FilterState {
  search: string;
  eventType: string;
  category: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export interface SortState {
  sortBy: "startDate" | "title";
  sortOrder: "asc" | "desc";
}

export interface FilterActions {
  setSearchTerm: (value: string) => void;
  setSelectedType: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setDateRange: (range: { start: string | null; end: string | null }) => void;
  clearAllFilters: () => void;
  setSortConfig: (
    sortBy: "startDate" | "title",
    sortOrder: "asc" | "desc"
  ) => void;
}

export interface UseEventFiltersReturn {
  // Current filter values
  searchTerm: string;
  selectedType: string;
  selectedCategory: string;
  dateRange: { start: string | null; end: string | null };

  // Sort state
  sortBy: "startDate" | "title";
  sortOrder: "asc" | "desc";

  // Computed data
  filteredAndSortedEvents: Event[];
  hasActiveFilters: boolean;
  eventCount: {
    total: number;
    filtered: number;
  };

  // Actions
  actions: FilterActions;
}

/**
 * Parses URL search parameters into filter state
 */
function parseFiltersFromURL(searchParams: URLSearchParams): {
  search: string;
  eventType: string;
  category: string;
  sortBy: "startDate" | "title";
  sortOrder: "asc" | "desc";
  dateRange: { start: string | null; end: string | null };
} {
  return {
    search: searchParams.get("search") || "",
    eventType: searchParams.get("type") || "all",
    category: searchParams.get("category") || "all",
    sortBy:
      (searchParams.get("sortBy") as "startDate" | "title") || "startDate",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    dateRange: {
      start: searchParams.get("dateStart") || null,
      end: searchParams.get("dateEnd") || null,
    },
  };
}

/**
 * Converts filter state to URL search parameters
 */
function buildURLParams(filters: {
  search: string;
  eventType: string;
  category: string;
  sortBy: "startDate" | "title";
  sortOrder: "asc" | "desc";
  dateRange: { start: string | null; end: string | null };
}): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.eventType) {
    params.set("type", filters.eventType);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }
  if (filters.dateRange.start) {
    params.set("dateStart", filters.dateRange.start);
  }
  if (filters.dateRange.end) {
    params.set("dateEnd", filters.dateRange.end);
  }

  return params;
}

/**
 * Modern SaaS hook that manages event filtering with immediate application and URL persistence
 */
export function useEventFilters(): UseEventFiltersReturn {
  const { events, filters, setFilters } = useEvents();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const urlFilters = useMemo(
    () => parseFiltersFromURL(searchParams),
    [searchParams]
  );

  // State for current filter values
  const [searchTerm, setSearchTerm] = useState(urlFilters.search);
  const [selectedType, setSelectedType] = useState(urlFilters.eventType);
  const [selectedCategory, setSelectedCategory] = useState(urlFilters.category);
  const [dateRange, setDateRange] = useState(urlFilters.dateRange);

  // Sort state
  const [sortBy, setSortBy] = useState<"startDate" | "title">(
    urlFilters.sortBy
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    urlFilters.sortOrder
  );

  // Update URL parameters
  const updateURL = useCallback(
    (newFilters: {
      search: string;
      eventType: string;
      category: string;
      sortBy: "startDate" | "title";
      sortOrder: "asc" | "desc";
      dateRange: { start: string | null; end: string | null };
    }) => {
      const params = buildURLParams(newFilters);
      const newURL = params.toString() ? `?${params.toString()}` : "";
      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  // Apply filters immediately when state changes
  const applyFiltersImmediate = useCallback(
    (newState: {
      search?: string;
      eventType?: string;
      category?: string;
      dateRange?: { start: string | null; end: string | null };
    }) => {
      const currentSearch = newState.search ?? searchTerm;
      const currentType = newState.eventType ?? selectedType;
      const currentCategory = newState.category ?? selectedCategory;
      const currentDateRange = newState.dateRange ?? dateRange;

      // Update context immediately
      setFilters({
        search: currentSearch,
        eventType: currentType === "all" ? "" : currentType,
        category: currentCategory === "all" ? "" : currentCategory,
        dateRange: currentDateRange,
      });

      // Update URL
      updateURL({
        search: currentSearch,
        eventType: currentType,
        category: currentCategory,
        sortBy,
        sortOrder,
        dateRange: currentDateRange,
      });
    },
    [
      searchTerm,
      selectedType,
      selectedCategory,
      dateRange,
      sortBy,
      sortOrder,
      setFilters,
      updateURL,
    ]
  );

  // Action handlers with immediate application
  const handleSetSearchTerm = useCallback(
    (value: string) => {
      setSearchTerm(value);
      applyFiltersImmediate({ search: value });
    },
    [applyFiltersImmediate]
  );

  const handleSetSelectedType = useCallback(
    (value: string) => {
      setSelectedType(value);
      applyFiltersImmediate({ eventType: value });
    },
    [applyFiltersImmediate]
  );

  const handleSetSelectedCategory = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      applyFiltersImmediate({ category: value });
    },
    [applyFiltersImmediate]
  );

  const handleSetDateRange = useCallback(
    (range: { start: string | null; end: string | null }) => {
      setDateRange(range);
      applyFiltersImmediate({ dateRange: range });
    },
    [applyFiltersImmediate]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedState = {
      search: "",
      eventType: "all",
      category: "all",
      dateRange: { start: null, end: null },
      sortBy: "startDate" as const,
      sortOrder: "asc" as const,
    };

    // Update local state
    setSearchTerm(clearedState.search);
    setSelectedType(clearedState.eventType);
    setSelectedCategory(clearedState.category);
    setDateRange(clearedState.dateRange);
    setSortBy(clearedState.sortBy);
    setSortOrder(clearedState.sortOrder);

    // Update context filters
    setFilters({
      search: clearedState.search,
      eventType: "", // Context uses empty string, not "all"
      category: "", // Context uses empty string, not "all"
      dateRange: clearedState.dateRange,
    });

    // Update URL using the proper updateURL function
    updateURL(clearedState);
  }, [setFilters, updateURL]);

  // Set sort configuration and update URL immediately
  const setSortConfig = useCallback(
    (newSortBy: "startDate" | "title", newSortOrder: "asc" | "desc") => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);

      updateURL({
        search: searchTerm,
        eventType: selectedType,
        category: selectedCategory,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        dateRange,
      });
    },
    [searchTerm, selectedType, selectedCategory, dateRange, updateURL]
  );

  // Initialize filters from URL on mount and sync when URL changes
  useEffect(() => {
    // Update local state to match URL
    setSearchTerm(urlFilters.search);
    setSelectedType(urlFilters.eventType);
    setSelectedCategory(urlFilters.category);
    setDateRange(urlFilters.dateRange);
    setSortBy(urlFilters.sortBy);
    setSortOrder(urlFilters.sortOrder);

    // Update context filters
    setFilters({
      search: urlFilters.search,
      eventType: urlFilters.eventType === "all" ? "" : urlFilters.eventType,
      category: urlFilters.category === "all" ? "" : urlFilters.category,
      dateRange: urlFilters.dateRange,
    });
  }, [urlFilters, setFilters]);

  // Computed values
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = filterEvents(events, filters);
    let sorted = sortEvents(filtered, sortBy);

    if (sortOrder === "desc") {
      sorted = [...sorted].reverse();
    }

    return sorted;
  }, [events, filters, sortBy, sortOrder]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchTerm.trim() ||
      selectedType !== "all" ||
      selectedCategory !== "all" ||
      dateRange.start ||
      dateRange.end
    );
  }, [searchTerm, selectedType, selectedCategory, dateRange]);

  const eventCount = useMemo(
    () => ({
      total: events.length,
      filtered: filteredAndSortedEvents.length,
    }),
    [events.length, filteredAndSortedEvents.length]
  );

  // Actions object
  const actions: FilterActions = useMemo(
    () => ({
      setSearchTerm: handleSetSearchTerm,
      setSelectedType: handleSetSelectedType,
      setSelectedCategory: handleSetSelectedCategory,
      setDateRange: handleSetDateRange,
      clearAllFilters,
      setSortConfig,
    }),
    [
      handleSetSearchTerm,
      handleSetSelectedType,
      handleSetSelectedCategory,
      handleSetDateRange,
      clearAllFilters,
      setSortConfig,
    ]
  );

  return {
    // Current values
    searchTerm,
    selectedType,
    selectedCategory,
    dateRange,
    sortBy,
    sortOrder,

    // Computed data
    filteredAndSortedEvents,
    hasActiveFilters,
    eventCount,

    // Actions
    actions,
  };
}
