import type { paths } from "@/lib/api/storeit";

export type ApiStorageGroup =
  paths["/storage-groups"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export type ApiUnit =
  paths["/units"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number]; 