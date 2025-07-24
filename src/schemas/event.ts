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
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    eventLink: z.string().url({ message: "Invalid URL" }).optional(),
    location: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
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
