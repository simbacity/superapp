import prisma from "@app-store/shared/utils/prisma";
import InviteeEntity from "@business-logic/invitee.entity";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;

      const isInvited = await new InviteeEntity().isInvited(email);

      if (isInvited) return true;
      return false;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
