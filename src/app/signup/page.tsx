import { SignupForm } from "@/components/auth/signup-form";
import React from "react";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
