import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" }, pages: { signIn: "/login" },
  providers: [CredentialsProvider({
    name: "Email and password",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTPUBLICBASEURL}/auth/login`, credentials);
        const data = response.data?.data;
        if (!response.data?.success || !data?.accessToken || data.role !== "admin") return null;
        return { id: data._id, _id: data._id, name: data.user?.name || data.user?.email, email: data.user?.email, image: data.user?.avatar?.url || null, role: data.role, accessToken: data.accessToken, refreshToken: data.refreshToken };
      } catch { return null; }
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user) { token.accessToken = user.accessToken; token.role = user.role; token._id = user._id; token.refreshToken = user.refreshToken; } return token; },
    session({ session, token }) { session.accessToken = token.accessToken || ""; session.role = token.role || ""; session._id = token._id || ""; session.user._id = token._id; session.user.role = token.role; return session; },
  },
};
