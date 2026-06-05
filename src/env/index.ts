/**
 * Retrieves an environment variable or throws an error if it is missing.
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;

  if (!value) {
    throw new Error(
      `Environment variable Missing: "${key}" is required but was not found.`,
    );
  }

  return value;
}

export const API_URL = getEnv("VITE_API_URL", "http://localhost:5000");

export const BASE_URL = getEnv("VITE_BASE_URL", "http://localhost:5173");
