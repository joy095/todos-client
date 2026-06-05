import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import type { LoginInput } from "@/lib/validations/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });
}
