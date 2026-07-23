"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input/input";
import { SignInFormData, signInSchema } from "@/features/auth/schemas/sign-in.schema";
import { handleSignIn } from "@/services/auth/sign-in.service";
import { AuthRedirect } from "@/features/auth/auth-redirect/auth-redirect";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/auth-context";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");
  const onSubmit = async (data: SignInFormData) => {
    await handleSignIn(data, setLoading, dispatch, refreshUser);
  };

  const handleGoogleLogin = () => {
    console.log("Google login attempted");
  };

  return (
    <AuthRedirect>
      <main className="relative w-full min-h-screen">
        {/* Background Image - Only visible on desktop */}
        <div className=" absolute inset-0 w-full h-full">
          <img
            src="/images/log1.jpg"
            alt="Login background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Login Component - Centered on mobile, Right side on desktop */}
        <div className="relative z-10 flex items-center justify-center md:justify-end min-h-screen">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 m-4 md:m-0 md:mr-8 lg:mr-16 xl:mr-32">
            {/* Logo Section */}
            <div className="flex mb-3">
              <img
                src="./dark-yas-logo.svg"
                alt="Logo"
                className="h-10 w-auto"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Bienvenue
              </h2>
              <p className="text-xs text-gray-600">
                Connectez-vous à votre compte
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <Input
                {...register("email")}
                type="email"
                label="Email"
                placeholder="exemple@email.com"
                error={errors.email?.message}
                size="sm"
                required
              />

              {/* Password Field */}
              <Input
                {...register("password")}
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                error={errors.password?.message}
                size="sm"
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
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
                  href="/forgot-password"
                  className="text-xs text-main hover:text-main/80 transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="sm"
                className="text-xs rounded-full"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
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

              {/* Google Login Button */}
              <Button
                type="button"
                size="sm"
                className="text-xs rounded-full border border-[#EFEFEF] text-[#7C7C84] [&_svg]:scale-100"
                onClick={handleGoogleLogin}
              >
                Google
              </Button>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  Vous n'avez pas de compte ?{" "}
                  <a
                    href="/sign-up"
                    className="text-main font-medium hover:text-main/80 transition-colors"
                  >
                    S'inscrire
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}
