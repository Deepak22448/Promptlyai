import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { type NextRequest } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      // attach the user id to the session
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    newUser: "/",
    signIn: "/signin",
  },
});

export const withAuth = (next?: (req: NextRequest) => any) => {
  return auth(async function middleware(req) {
    const pathName = req.nextUrl.pathname;

    if (req.auth && pathName === "/signin") {
      return redirectTo("/", req);
    }

    return next?.(req);
  });
};

/**
 * Redirects the user to the specified path.
 * @param path The path to redirect to.
 * @param req The incoming request.
 * @returns A response that redirects the user to the specified path.
 * */
export function redirectTo(path: string, req: NextRequest) {
  const newUrl = new URL(path, req.nextUrl.origin);
  return Response.redirect(newUrl);
}
