import { z } from "zod";

// Zod validation schema
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Nom complet doit contenir au moins 3 caractères")
      .nonempty("Nom complet est requis"),
    email: z.string().email("Email invalide").nonempty("Email est requis"),
    password: z
      .string()
      .min(6, "Mot de passe doit contenir au moins 6 caractères")
      .nonempty("Mot de passe est requis"),
    confirmPassword: z
      .string()
      .nonempty("Veuillez confirmer votre mot de passe"),
    phoneNumber: z
      .string()
      .regex(/^[0-9+\-\s()]{8,15}$/, "Numéro de téléphone invalide")
      .nonempty("Numéro de téléphone est requis"),
    role: z.enum(["regular", "agency", "promoter","admin"]),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
