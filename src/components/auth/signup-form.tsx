"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SignupSchema } from "@/schemas/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SignupInputs } from "@/lib/auth/types";

export const SignupForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useLocalStorage<
    Array<{ email: string; password: string; name: string }>
  >("users", []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupInputs) => {
    setError(null);
    try {
      // Check if email already exists
      if (users.some((user) => user.email === data.email)) {
        setError("Email already exists");
        return;
      }

      // Add new user to users array
      const newUser = {
        email: data.email,
        password: data.password,
        name: data.name,
      };
      setUsers([...users, newUser]);

      // Wait for login to complete
      await login(newUser);

      // Verify user is set in LocalStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser || storedUser.email !== data.email) {
        setError("Failed to set user session. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0", className)}
      {...props}
    >
      <Card className="border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-6 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">Create your account</CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            Join EventX to start organizing amazing events
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...register("name")}
                  className={cn(
                    "h-10 sm:h-11 text-base",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    autoComplete="new-password"
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className={cn(
                      "h-10 sm:h-11 text-base",
                      errors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-base font-medium mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
