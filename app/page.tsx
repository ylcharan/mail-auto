"use client";

import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/loading-page";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect logged-in users to dashboard
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading screen while checking authentication
  if (!isLoaded) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Email Automation
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-lg mx-auto leading-relaxed">
            Automate your email workflows and boost productivity with
            intelligent automation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
