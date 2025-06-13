import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/", "/products"]
  const isPublicPath = publicPaths.some(
    (pp) => path === pp || (path.startsWith("/api/products") && request.method === "GET"),
  )

  // Check if the path is for API routes that require authentication
  const isApiPath =
    path.startsWith("/api") &&
    !path.startsWith("/api/auth") &&
    !(path.startsWith("/api/products") && request.method === "GET")

  // Get the token
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // If it's an API path and not authenticated, return 401
  if (isApiPath && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // If the user is authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/cart",
    "/checkout",
    "/login",
    "/register",
    "/api/:path*",
  ],
}
