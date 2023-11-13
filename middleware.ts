import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  let session;
  if (process.env.NODE_ENV === "production") {
    const productionSessionToken = request.cookies.get(
      "__Secure-next-auth.session-token"
    );
    session = productionSessionToken
      ? productionSessionToken
      : request.cookies.get("next-auth.session-token");
  } else {
    session = request.cookies.get("next-auth.session-token");
  }
  if (!session)
    return NextResponse.redirect(
      `${request.nextUrl.origin}/api/auth/signin?callbackUrl=${request.url}`
    );
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/chat", "/search", "/user"],
};
