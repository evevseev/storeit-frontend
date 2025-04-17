import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "../lib/api/storeit";
import createQueryClient from "openapi-react-query";
import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";

const activeOrganizationIdAtom = atomWithStorage<string | null>('activeOrganizationId', null);

function useApiQueryClient() {
    const orgId = useAtomValue(activeOrganizationIdAtom);

    const httpClient = useMemo(() => {
        const client = createClient<paths>({
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            credentials: "include"
        });

        const organizationMiddleware: Middleware = {
            async onRequest({ request }) {
                if (orgId) {
                    request.headers.set("x-organization-id", orgId);
                }
                return request;
            },
        };

        client.use(organizationMiddleware);
        return client;
    }, [orgId]);

    return createQueryClient(httpClient);
}

export { useApiQueryClient, activeOrganizationIdAtom };
