import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CheckEmail() {
  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-100 p-4">
      <div className={cn("flex flex-col gap-6 max-w-md sm:w-full")}>
        <Card>
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a confirmation link to your email address. Please
              check your inbox (and spam/junk folder) to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              After verifying, you can{" "}
              <a href="/login" className="underline underline-offset-4">
                log in
              </a>{" "}
              to access your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
