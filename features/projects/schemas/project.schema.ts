import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Project Title is required"),
  projectStatus: z.enum(["ANNOUNCEMENT", "UNDER_CONSTRUCTION", "FINISHED"]),
  price: z.string().or(z.number()).optional(),
  surface: z.string().or(z.number()).optional(),
  category: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
