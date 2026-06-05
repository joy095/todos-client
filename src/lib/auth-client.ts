import { API_URL } from "@/env";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: API_URL,

  plugins: [jwtClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
