"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: { start: string | null; end: string | null };
  onChange?: (range: { start: string | null; end: string | null }) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date or range",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>();

  // Current applied date from props
  const appliedDate = React.useMemo(() => {
    if (value?.start && value?.end) {
      return {
        from: new Date(value.start),
        to: new Date(value.end),
      };
    }
    if (value?.start) {
      return {
        from: new Date(value.start),
        to: undefined,
      };
    }
    return undefined;
  }, [value]);

  const handleTempDateChange = (newDate: DateRange | undefined) => {
    // Handle single date selection in range mode
    if (newDate?.from && !newDate?.to) {
      // If user clicks the same date twice, treat it as a single date selection
      if (
        tempDate?.from &&
        newDate.from.getTime() === tempDate.from.getTime()
      ) {
        setTempDate({ from: newDate.from, to: undefined });
      } else {
        setTempDate(newDate);
      }
    } else {
      setTempDate(newDate);
    }
  };

  const formatDateForFilter = (date: Date): string => {
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = () => {
    if (onChange) {
      if (tempDate?.from && tempDate?.to) {
        onChange({
          start: formatDateForFilter(tempDate.from),
          end: formatDateForFilter(tempDate.to),
        });
      } else if (tempDate?.from) {
        onChange({
          start: formatDateForFilter(tempDate.from),
          end: null,
        });
      } else {
        onChange({
          start: null,
          end: null,
        });
      }
    }
    setOpen(false);
  };

  const handleClear = () => {
    setTempDate(undefined);
    if (onChange) {
      onChange({
        start: null,
        end: null,
      });
    }
  };

  // Sync tempDate with appliedDate changes
  React.useEffect(() => {
    // Always sync tempDate with appliedDate changes, regardless of open state
    setTempDate(appliedDate);
  }, [appliedDate]);

  // When opening the popover, ensure we have the latest applied date
  React.useEffect(() => {
    if (open) {
      setTempDate(appliedDate);
    }
  }, [open, appliedDate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !appliedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {appliedDate?.from ? (
              appliedDate.to ? (
                <>
                  {format(appliedDate.from, "MMM dd, y")} -{" "}
                  {format(appliedDate.to, "MMM dd, y")}
                </>
              ) : (
                format(appliedDate.from, "MMM dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={handleTempDateChange}
            numberOfMonths={1}
          />
          <div className="flex items-center justify-end p-4 border-t gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-1"
                disabled={!tempDate?.from}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempDate?.from}
              >
                Apply
                {tempDate?.from && !tempDate?.to && " (Single Date)"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
