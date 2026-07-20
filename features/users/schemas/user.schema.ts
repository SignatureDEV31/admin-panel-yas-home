import { z } from "zod";

export const userFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  role: z.enum(["regular", "agence", "promoter", "admin"]),
  status: z.enum(["active", "suspended", "pending"]),
  emailVerified: z.boolean(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
