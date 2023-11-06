import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  let session = request.cookies.get("next-auth.session-token");
  if (process.env.NODE_ENV === "production") {
    session = request.cookies.get("__Secure-next-auth.callback-url");
  }
  console.log("MIDDLEWARE", {
    cookies,
    session,
    url: request.url,
    nextUrl: request.nextUrl,
    env: process.env.NODE_ENV,
  });
  if (!session)
    return NextResponse.redirect(
      `${request.nextUrl.origin}/api/auth/signin?callbackUrl=${request.url}`
    );
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/chat", "/imageGeneration", "/search", "/translation"],
};
