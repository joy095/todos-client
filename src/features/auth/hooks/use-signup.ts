import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import type { SignUpInput } from "@/lib/validations/auth";

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: SignUpInput) => {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });
}
