import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-100 p-4">
      <div className={cn("flex flex-col gap-6 max-w-md sm:w-full")}>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              An error occurred during authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {searchParams.error || "An unexpected error occurred."}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Please try again or return to{" "}
              <a href="/login" className="underline underline-offset-4">
                login
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
