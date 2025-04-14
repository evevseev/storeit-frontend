"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCellKindDialog } from "@/components/cell-kind/dialogs/create-dialog";
import { PageMetadata } from "@/components/header/page-metadata";

interface CellKind {
  name: string;
  description: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
}

export default function CellKindPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCellKind = (data: CellKind) => {
    // TODO: Implement cell kind creation
    console.log("Creating cell kind:", data);
  };

  return (
    <div className="container py-6">
      <PageMetadata
        title="Типы ячеек"
        breadcrumbs={[{ label: "Типы ячеек" }]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Типы ячеек</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать тип ячейки
        </Button>
      </div>

      <CreateCellKindDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateCellKind}
      />
    </div>
  );
}
