import { withAuth } from "next-auth/middleware";
export default withAuth({ pages: { signIn: "/login" }, callbacks: { authorized: ({ token }) => token?.role === "admin" } });
export const config = { matcher: ["/dashboard/:path*", "/content/:path*", "/gamification/:path*", "/subscription/:path*", "/setting/:path*", "/logout/:path*"] };
