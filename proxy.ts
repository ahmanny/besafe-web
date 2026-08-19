import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const agencyToken = request.cookies.get("agencyAccessToken")?.value

  // 1. If authenticated agency user tries to access /login or /register, redirect to /dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (agencyToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // 2. Protected Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!agencyToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
