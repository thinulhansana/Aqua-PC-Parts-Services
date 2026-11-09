import type { DefaultSession } from "next-auth";
import type { JWT as CoreJWT } from "@auth/core/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    provider?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends CoreJWT {
    id?: string;
    provider?: string;
  }
}

