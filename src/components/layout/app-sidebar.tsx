"use client";

import * as React from "react";
import {
  Building2,
  ClipboardList,
  Package,
  Smartphone,
  Warehouse,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { OrgSwitcher } from "@/components/layout/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "ТСД",
      url: "/dct",
      icon: Smartphone,
    },
    {
      title: "Задания",
      url: "/tasks",
      icon: ClipboardList,
    },
    {
      title: "Товары",
      url: "/items",
      icon: Package,
    },
    {
      title: "Склад",
      url: "/storage",
      icon: Warehouse,
    },
    {
      title: "Организация",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "Подразделения",
          url: "/units",
        },
        {
          title: "Сотрудники",
          url: "/employees",
        },
        {
          title: "API токены",
          url: "/api-tokens",
        },

      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
