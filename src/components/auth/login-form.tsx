"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import { validateCredentials } from "@/lib/auth/auth-utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LoginSchema } from "@/schemas/auth";
import { LoginInputs } from "@/lib/auth/types";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [storedUsers] = useLocalStorage<
    Array<{ email: string; password: string; name: string }>
  >("users", []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setError(null);
    const storedUser = storedUsers.find((user) => user.email === data.email);
    if (!storedUser || !validateCredentials(storedUser, data)) {
      setError("Invalid email or password");
      return;
    }
    await login({ email: data.email, password: data.password });
  };

  return (
    <div
      className={cn("flex flex-col gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0", className)}
      {...props}
    >
      <Card className="border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-6 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "h-10 sm:h-11 text-base",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "h-10 sm:h-11 text-base",
                    errors.password && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                New to EventX?{" "}
                <Link 
                  href="/signup" 
                  className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
