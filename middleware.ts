import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./shared/firebase/firebase";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // try {
  //   const user = auth.currentUser;
  //   if (!user) {
  //   }
  // } catch (e) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/chat", "/imageGeneration", "/textCompletion", "/translation"],
};
