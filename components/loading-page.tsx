import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-12" />
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Loading...
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please wait while we check your authentication
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
