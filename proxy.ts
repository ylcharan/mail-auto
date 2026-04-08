import { clerkMiddleware } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const MAINTENANCE_MODE = true;

export default function middleware(req: Request) {
  if (MAINTENANCE_MODE) {
    return new NextResponse("Site temporarily down", {
      status: 503,
    });
  }

  return NextResponse.next();
}
}
export const proxy = clerkMiddleware(); // proxy.ts
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
