"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { AuthRedirect } from "@/features/auth/auth-redirect/auth-redirect";
import { SignUpFormData, signUpSchema } from "@/features/auth/schemas/sign-up.schema";
import { handleSignUp } from "@/services/auth/sign-up.service";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: "admin",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: SignUpFormData) => {
    // Remove confirmPassword before sending to API if needed
    const { confirmPassword, ...signUpData } = data;
    await handleSignUp(signUpData as SignUpFormData, setLoading, refreshUser);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup attempted");
  };

  return (
    <AuthRedirect>
      <main className="relative w-full min-h-screen">
        {/* Background Image - Only visible on desktop */}
        <div className=" absolute inset-0 w-full h-full">
          <img
            src="/images/log1.jpg"
            alt="Signup background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Signup Component - Centered */}
        <div className="relative z-10 flex items-center justify-center md:justify-end min-h-screen">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 m-4 md:m-0 md:mr-8 lg:mr-16 xl:mr-32">
            {/* Logo Section */}
            <div className="flex mb-6">
              <img
                src="./dark-yas-logo.svg"
                alt="Logo"
                className="h-10 w-auto"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                Créer un compte
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                Inscrivez-vous pour commencer
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("fullName")}
                  type="text"
                  label="Nom complet"
                  placeholder="Jean Dupont"
                  error={errors.fullName?.message}
                  size="sm"
                  required
                />
                <Input
                  {...register("email")}
                  type="email"
                  label="Email"
                  placeholder="exemple@email.com"
                  error={errors.email?.message}
                  size="sm"
                  required
                />
              </div>

              {/* Row 2: Phone Number */}
              <div className="grid grid-cols-1 gap-4">
                <Input
                  {...register("phoneNumber")}
                  type="tel"
                  label="Numéro de téléphone"
                  placeholder="+33 6 12 34 56 78"
                  error={errors.phoneNumber?.message}
                  size="sm"
                  required
                />
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("password")}
                  type="password"
                  label="Mot de passe"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  size="sm"
                  required
                />
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  size="sm"
                  required
                />
              </div>

              {/* Remember Me & Login Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-3.5 h-3.5 text-main border-[#EFEFEF] rounded focus:ring-main/50"
                  />
                  <span className="text-xs text-gray-700">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="/login"
                  className="text-xs text-main hover:text-main/80 transition-colors"
                >
                  Déjà un compte ? Se connecter
                </a>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs rounded-full"
                disabled={loading}
              >
                {loading ? "Création en cours..." : "S'inscrire"}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EFEFEF]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Google Signup Button */}
              <Button
                type="button"
                size="sm"
                className="h-9 text-xs rounded-full border border-[#EFEFEF] text-[#7C7C84] [&_svg]:scale-100"
                onClick={handleGoogleSignup}
              >
                Google
              </Button>
            </form>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}
