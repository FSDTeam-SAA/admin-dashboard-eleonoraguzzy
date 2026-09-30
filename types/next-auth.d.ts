import "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface Session { accessToken: string; role: string; _id: string; user: { id?: string; name?: string | null; email?: string | null; image?: string | null; _id?: string; role?: string } }
  interface User { accessToken: string; role: string; _id: string; refreshToken?: string }
}
declare module "next-auth/jwt" { interface JWT { accessToken?: string; role?: string; _id?: string; refreshToken?: string } }
