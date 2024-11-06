// ** Next, React And Locals Imports
import { NextResponse } from "next/server";

// ** Third Party Imports
import { jwtVerify } from "jose";

export default async function middleware(req) {
  // Only authenticated customers will be able to access below routes
  const protectedRoutes = ["/profile"];

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith(protectedRoutes[0])) {
    // Jwt Token
    const jwt = req.cookies.get("access_token")?.value;

    // Absolute Url
    req.nextUrl.pathname = "/login";

    // Updating the cookie & redirect
    const updateCookie = () => {
      const response = NextResponse.redirect(req.nextUrl);
      response.cookies.set("fabyoh_customer", false, {
        domain: new URL(process.env.NEXT_PUBLIC_CLIENT_URL).hostname, // store domain
        path: "/",
      });
      return response;
    };

    // If no token present, redirecting to login page
    if (jwt === undefined) {
      return updateCookie();
    }

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

    try {
      const { payload } = await jwtVerify(jwt, secret);

      if (payload.role !== "customer") {
        return updateCookie();
      } else {
        return NextResponse.next();
      }
    } catch (error) {
      return updateCookie();
    }
  }

  return NextResponse.next();
}
