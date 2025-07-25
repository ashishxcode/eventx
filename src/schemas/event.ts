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
        message: "Invalid start time",
      }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    endTime: z
      .string()
      .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: "Invalid end time",
      }),
    eventLink: z.string().url({ message: "Invalid URL" }).optional(),
    location: z.string().optional(),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      return endDateTime > startDateTime;
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDate"],
    }
  )
  .refine((data) => (data.eventType === "Online" ? !!data.eventLink : true), {
    message: "Event link is required for online events",
    path: ["eventLink"],
  })
  .refine(
    (data) =>
      ["In-Person", "Hybrid"].includes(data.eventType) ? !!data.location : true,
    {
      message: "Location is required for in-person or hybrid events",
      path: ["location"],
    }
  );

export type EventFormData = z.infer<typeof eventSchema>;
