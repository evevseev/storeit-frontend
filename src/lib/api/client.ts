import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./storeit";
import createQueryClient from "openapi-react-query";

const myMiddleware: Middleware = {
    async onRequest({ request, options }) {
        request.headers.set("x-organization-id", "453f0e17-c8f4-4c99-9d20-f0e13572550e");
        return request;
    },
};

export const httpClient = createClient<paths>({ baseUrl: "http://localhost:8080" });

httpClient.use(myMiddleware);

const queryClient = createQueryClient(httpClient);

export default queryClient;
