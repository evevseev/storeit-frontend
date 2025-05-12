import { useRouter } from "next/navigation";
import { useApiQueryClient } from "./use-api-query-client";
import { useActiveOrganizationId } from "./use-organization-id";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  const globalClient = useQueryClient();
  const { organizationId, setOrganizationId } = useActiveOrganizationId();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const getOrganizationId = () => {
    if (!organizationId) {
      router.push("/login/select-org");
    }

    return organizationId as string;
  }

  const logoutMutation = client.useMutation("get", "/auth/logout");

  const { data: user, isLoading: isUserLoading, error: userError } = client.useQuery(
    "get",
    "/me",
    { enabled: isAuthenticated === true }
  );

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
      globalClient.invalidateQueries();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user: user as User,
    isLoading: isUserLoading,
    error: userError,

    logout,
    setOrganizationId,
    getOrganizationId,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated,
    setIsAuthenticated,
  };
} 