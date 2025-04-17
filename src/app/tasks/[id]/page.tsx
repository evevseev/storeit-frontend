"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  PageBlock,
  BlockTextElement,
  BlockCustomElement,
  EditButton,
  BlockRow,
  DeleteButton,
  PageBlockRow,
} from "@/components/info-page/block";
import client from "@/hooks/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  name: string;
  note: string | null;
  assignedToName: string | null;
};

export default function TaskPage() {
  //   const { id } = useParams();

  const task: Task = {
    id: "1",
    name: "Отгрузка товара",
    note: "Необходимо выполнить отгрузку на точку выдачи товара клиентам",
  };

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={task.name}
        breadcrumbs={[
          { href: "/tasks", label: "Задания" },
          { label: task.name },
        ]}
        actions={[
          <DeleteButton onClick={() => {}} />,
          <EditButton onClick={() => {}} />,
        ]}
      />
      <PageBlockRow>
        <PageBlock title="Информация о задаче">
          <BlockTextElement label="Название" value="Отгрузка товара" />
          <BlockTextElement label="Подразделение" value="Красноярск" />
          <BlockTextElement
            label="Детали"
            value="Необходимо выполнить отгрузку на точку выдачи товара клиентам"
          />
          <BlockTextElement
            label="Дата создания"
            value={"10:00 10.04.2025"}
            unitLabel="(10 минут назад)"
          />
          <BlockTextElement label="ID" value={task.id} />
        </PageBlock>
        <PageBlock title="Статус выполнения">
          <BlockCustomElement label="Статус">
            <Badge variant="outline" className="bg-green-500 text-white">
              Выполнено
            </Badge>
          </BlockCustomElement>
          <BlockTextElement
            label="Сотрудник"
            value={task.assignedToName ?? "Нет информации"}
          />
          <BlockTextElement
            label="Взята в работу"
            value={"10:00 10.04.2025"}
            unitLabel="(10 минут назад)"
          />
          <BlockTextElement
            label="Выполнена"
            value={"10:00 10.04.2025"}
            unitLabel="(10 минут назад)"
          />
          <BlockTextElement label="Время выполнения" value="10 минут" />
        </PageBlock>
      </PageBlockRow>
      <PageBlock title="Товары">
        <div>Таблица</div>
      </PageBlock>
      <PageBlock title="Результаты выполнения">
        <div>Таблица</div>
      </PageBlock>
    </div>
  );
}
