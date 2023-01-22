import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import prisma from "@app-store/shared/utils/prisma";
import DummyUserEntity from "@business-logic/dummy-user.entity";
import InviteeEntity from "@business-logic/invitee.entity";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
      },
      async authorize(credentials) {
        if (IS_PRODUCTION) return null;
        if (!credentials?.email) return null;

        const email = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) return user;

        const newUser = new DummyUserEntity().create(email);
        return newUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;

      const isInvited = await new InviteeEntity().isInvited(email);

      if (isInvited) return true;
      return false;
    },
    jwt: async ({ user, token }) => {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
