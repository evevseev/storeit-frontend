import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "@/lib/api/storeit";
import createQueryClient from "openapi-react-query";
import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

// Выделяем константы для хранения настроек API
const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    CREDENTIALS: "include" as const,
    STORAGE_KEY: 'activeOrganizationId'
};

// Типизированный атом для ID организации
const activeOrganizationIdAtom = atomWithStorage<string | null>(API_CONFIG.STORAGE_KEY, null);

// Интерфейс для типизации клиента API
interface ApiClient {
    baseUrl: string;
    credentials: RequestCredentials;
}

function useApiQueryClient() {
    const orgId = useAtomValue(activeOrganizationIdAtom);
    const router = useRouter();

    const httpClient = useMemo(() => {
        // Создаем базовый клиент API
        const client = createClient<paths>({
            baseUrl: API_CONFIG.BASE_URL,
            credentials: API_CONFIG.CREDENTIALS
        });

        // Добавляем middleware для обработки ошибок авторизации
        client.use(createAuthMiddleware(router));

        // Добавляем middleware для поддержки организаций
        client.use(createOrganizationMiddleware(orgId));

        return client;
    }, [orgId, router]);

    return createQueryClient(httpClient);
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

export { useApiQueryClient, activeOrganizationIdAtom };
