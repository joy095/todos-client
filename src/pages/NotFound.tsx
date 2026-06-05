// pages/NotFound.tsx
import { Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { BASE_URL } from "@/env";

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 - Page Not Found | TaskFlow"
        description="The page you're looking for could not be found."
        noIndex
        image={`${BASE_URL}/img/not-found.png`}
        url={`${BASE_URL}/404`}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <div>
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <p className="text-lg text-muted-foreground mt-2">
              This page doesn't exist.
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
