"use client";

import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "@/lib/api/storeit";
import createQueryClient from "openapi-react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveOrganizationId } from "./use-organization-id";
import { toast } from "sonner";
import { isAuthenticatedAtom } from "@/store/is-authenticated";
import { useAtom, useSetAtom } from "jotai";

function createErrorMiddleware(setIsAuthenticated: (value: boolean) => void): Middleware {
    return {
        async onResponse({ response }) {
            if (response.status === 401) {
                toast.error("Авторизуйтесь в системе для продолжения работы");
                setIsAuthenticated(false);
                throw new Error("Unauthorized");
            } else if (response.status === 403) {
                toast.error("Не достаточно прав для выполнения операции");
                throw new Error("Forbidden");
            }
        }
    }
}

function createOrganizationMiddleware(orgId: string | null): Middleware {
    return {
        async onRequest({ request }) {
            if (orgId) {
                request.headers.set("x-organization-id", orgId);
            }
            return request;
        }
    };
}

function createAuthMiddleware(router: ReturnType<typeof useRouter>): Middleware {
    return {
        async onResponse({ response }) {
            if (response.status === 401) {

                router.push('/login');
            }
            return response;
        }
    };
}

function useApiQueryClient() {
    const { organizationId } = useActiveOrganizationId();
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

    const router = useRouter();

    const httpClient = useMemo(() => {
        const client = createClient<paths>({
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            credentials: "include" as const,
        });

        client.use(createAuthMiddleware(router));
        client.use(createOrganizationMiddleware(organizationId));
        client.use(createErrorMiddleware(setIsAuthenticated));

        return client;
    }, [organizationId, router]);

    return createQueryClient(httpClient);
}

export { useApiQueryClient };
