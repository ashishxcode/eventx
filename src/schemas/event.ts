import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    eventType: z.enum(["Online", "In-Person", "Hybrid"], {
      message: "Event type is required",
    }),
    category: z.string().min(1, "Category is required"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
    startTime: z
      .string()
      .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: "Invalid start time format (HH:MM)",
      }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    endTime: z
      .string()
      .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: "Invalid end time format (HH:MM)",
      }),
    eventLink: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === "") return true; // Allow empty
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Please enter a valid URL (e.g., https://example.com)",
        }
      ),
    location: z.string().optional(),
  })
  .refine(
    (data) => {
      try {
        const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
        const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

        // Check if dates are valid
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          return false;
        }

        return endDateTime > startDateTime;
      } catch {
        return false;
      }
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Check if start date is not in the past (optional - remove if not needed)
      try {
        const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
        const now = new Date();
        return startDateTime >= now;
      } catch {
        return true; // If we can't parse, let other validations handle it
      }
    },
    {
      message: "Event cannot be scheduled in the past",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      // Minimum duration check (optional - adjust as needed)
      try {
        const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
        const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
        const durationMinutes =
          (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        return durationMinutes >= 15; // Minimum 15 minutes
      } catch {
        return true; // If we can't parse, let other validations handle it
      }
    },
    {
      message: "Event must be at least 15 minutes long",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => (data.eventType === "Online" ? !!data.eventLink?.trim() : true),
    {
      message: "Event link is required for online events",
      path: ["eventLink"],
    }
  )
  .refine(
    (data) =>
      ["In-Person", "Hybrid"].includes(data.eventType)
        ? !!data.location?.trim()
        : true,
    {
      message: "Location is required for in-person or hybrid events",
      path: ["location"],
    }
  );

export type EventFormData = z.infer<typeof eventSchema>;

// Helper function to format date for better error messages
export const formatDateTime = (date: string, time: string): string => {
  try {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString();
  } catch {
    return `${date} ${time}`;
  }
};
