import * as z from "zod";

export const createAmenitySchema = (existingKeys: string[]) =>
  z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title is too long"),
    key: z
      .string()
      .min(2, "Key must be at least 2 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Key can only contain lowercase letters, numbers, and underscores"
      )
      .refine(
        (val) => !val.startsWith("_") && !val.endsWith("_"),
        "Key must not start or end with an underscore"
      )
      .refine(
        (val) => !existingKeys.includes(val),
        "Key must be unique. This amenity key already exists"
      ),
    category: z.string().min(2, "Category must be at least 2 characters"),
  });

export type AmenityFormValues = z.infer<ReturnType<typeof createAmenitySchema>>;
