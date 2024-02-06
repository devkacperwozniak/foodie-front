import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        if (
            req.nextUrl.pathname.startsWith("/dashboard/admin") &&
            req.nextauth.token?.role != "admin"
        ) {
            return NextResponse.rewrite(new URL("/dashboard/permission-denied", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = { matcher: ["/dashboard", "/dashboard/admin"] }