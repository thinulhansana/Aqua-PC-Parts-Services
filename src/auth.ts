import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { authConfig } from "@/auth.config";
import { getRuntimeSecret } from "@/lib/cf-env";
import { upsertOAuthProfile, verifyUserCredentials } from "@/lib/auth-users";

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const [secret, googleId, googleSecret] = await Promise.all([
    getRuntimeSecret("AUTH_SECRET").then(
      (val) => val ?? getRuntimeSecret("NEXTAUTH_SECRET")
    ),
    getRuntimeSecret("AUTH_GOOGLE_ID").then(
      (val) => val ?? getRuntimeSecret("GOOGLE_CLIENT_ID")
    ),
    getRuntimeSecret("AUTH_GOOGLE_SECRET").then(
      (val) => val ?? getRuntimeSecret("GOOGLE_CLIENT_SECRET")
    ),
  ]);

  const providers: Provider[] = [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) return null;

        const user = await verifyUserCredentials(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          provider: user.provider,
        };
      },
    }),
  ];

  if (googleId && googleSecret) {
    providers.unshift(
      Google({
        clientId: googleId,
        clientSecret: googleSecret,
        authorization: {
          params: {
            prompt: "select_account",
          },
        },
      })
    );
  }

  return {
    ...authConfig,
    ...(secret ? { secret } : {}),
    providers,
    callbacks: {
      ...authConfig.callbacks,
      async signIn({ user, account }) {
        if (account?.provider === "google" && user.email) {
          await upsertOAuthProfile({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: "google",
          });
        }
        return true;
      },
    },
  };
});
