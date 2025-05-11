"use client";

import { Item, ItemVariant, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Row } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";

const data: Item[] = [
  {
    id: "1",
    name: "Item 1",
    description: "Item 1 description",
    variants: [],
  },
  {
    id: "2",
    name: "Item 2",
    description: "Item 2 description",
    variants: [
      {
        id: "2.1",
        name: "Item 2.1",
        ean: "1234567890123",
        article: "1234567890123",
      },
    ],
  },
];

export default function ItemsPage() {
  const client = useApiQueryClient();
  const { data: response } = client.useQuery("get", "/items");

  const items =
    response?.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      variants: item.variants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        ean: variant.ean13?.toString() || null,
        article: variant.article,
      })),
    })) || [];

  return (
    <div className="container mx-auto py-4">
      <PageMetadata
        title="Товары"
        breadcrumbs={[{ label: "Товары", href: "/items" }]}
        actions={[
          <Button key="create" asChild>
            <Link href="/items/create">
              <Plus className="h-4 w-4" />
              Создать товар
            </Link>
          </Button>,
        ]}
      />
      <DataTable<Item | ItemVariant>
        columns={columns}
        data={items}
        getRowCanExpand={(row: Row<Item | ItemVariant>) => {
          const item = row.original as Item;
          return "variants" in item && item.variants?.length > 0;
        }}
        getSubRows={(row: Item | ItemVariant) => {
          if ("variants" in row) {
            return row.variants;
          }
          return undefined;
        }}
        getRowHref={(row) => {
          if ("variants" in row) {
            return `/items/${row.id}`;
          }
          return "";
        }}
      />
    </div>
  );
}
