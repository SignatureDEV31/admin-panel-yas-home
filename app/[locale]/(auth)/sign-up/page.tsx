"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth/auth-context";
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
      <main className="relative w-full min-h-screen overflow-hidden">
        {/* Background Image covering full viewport */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/log1.jpg"
            alt="Signup background"
            className="w-full h-full object-cover"
          />
          {/* Smooth dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
        </div>

        {/* Signup Component - Centered on mobile, Right side on desktop */}
        <div className="relative z-10 flex items-center justify-center md:justify-end min-h-screen">
          <div className="w-full max-w-[620px] bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 m-4 md:m-0 md:mr-12 lg:mr-24 xl:mr-36 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Logo Section */}
            <div className="flex mb-4 justify-start">
              <img
                src="/logo/dark-yas-logo.svg"
                alt="Yas Home Logo"
                className="h-12 w-auto transition-transform hover:scale-105 duration-300"
              />
            </div>

            {/* Header */}
            <div className="text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight font-sans">
                Créer un compte
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Inscrivez-vous pour rejoindre l'espace Yas Home
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
                    className="w-3.5 h-3.5 text-main border-[#EFEFEF] rounded focus:ring-main/50 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-medium select-none">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="/sign-in"
                  className="text-xs text-[#FF014F] hover:text-[#FF014F]/80 transition-colors font-medium"
                >
                  Déjà un compte ? Se connecter
                </a>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                size="default"
                className="w-full h-10 text-xs rounded-full bg-[#151533] hover:bg-[#1a1a3e] text-white shadow-md hover:shadow-lg transition-all font-semibold cursor-pointer flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? "Création en cours..." : "S'inscrire"}
              </Button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EFEFEF]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/0 text-gray-500 font-medium backdrop-blur-xs">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Google Signup Button */}
              <Button
                type="button"
                size="default"
                className="w-full h-10 text-xs rounded-full border border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                onClick={handleGoogleSignup}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.882-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.545 0 2.955.55 4.056 1.458l3.11-3.11C19.043 1.838 15.896 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.743-4.238 10.743-10.743 0-.648-.065-1.213-.178-1.742H12.24z"
                  />
                </svg>
                Continuer avec Google
              </Button>
            </form>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}
