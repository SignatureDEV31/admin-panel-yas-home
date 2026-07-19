import * as z from "zod";

export const propertySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title is too long"),
  propertyType: z.enum(["VENTE", "LOCATION"]),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, "Price must be greater than 0"),
  surface: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, "Surface area must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  state: z.string().min(2, "State / Wilaya is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
