import { z } from "zod";

// Zod validation schema
export const signInSchema = z.object({
  email: z.string().email("Email invalide").nonempty("Email est requis"),
  password: z
    .string()
    .min(6, "Mot de passe doit contenir au moins 6 caractères")
    .nonempty("Mot de passe est requis"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
