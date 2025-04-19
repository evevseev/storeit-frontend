import { useRouter } from "next/navigation";
import { useApiQueryClient } from "./use-api-query-client";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
} | null;

export function useAuth() {
  const router = useRouter();
  const client = useApiQueryClient();
  const logoutMutation = client.useMutation("get", "/auth/logout");

  const { data: user, isLoading: isUserLoading, error: userError } = client.useQuery(
    "get",
    "/me",
  );

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    // Auth state
    user: user as User,
    isLoading: isUserLoading,
    error: userError,

    // Auth operations
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
} 