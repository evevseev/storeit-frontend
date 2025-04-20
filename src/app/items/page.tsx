"use client";

import { Item, ItemVariant, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { Row } from "@tanstack/react-table";

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
  return (
    <div className="container mx-auto py-4">
      <PageMetadata
        title="Items"
        breadcrumbs={[
          { label: "Organization", href: "/organization" },
          { label: "Items" },
        ]}
      />
      <DataTable<Item | ItemVariant>
        columns={columns} 
        data={data}
        getRowCanExpand={(row: Row<Item | ItemVariant>) => {
          const item = row.original as Item;
          return 'variants' in item && item.variants?.length > 0;
        }}
        getSubRows={(row: Item | ItemVariant) => {
          if ('variants' in row) {
            return row.variants;
          }
          return undefined;
        }}
      />
    </div>
  );
}
