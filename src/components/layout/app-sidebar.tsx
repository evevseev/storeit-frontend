"use client";

import * as React from "react";
import {
  Building2,
  ClipboardList,
  GalleryVerticalEnd,
  Package,
  Warehouse,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Evgeny Evseev",
    email: "evgeny@evseevs.ru",
    avatar: "/avatars/default.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Задания",
      url: "#",
      icon: ClipboardList,
    },
    {
      title: "Товары",
      url: "#",
      icon: Package,
    },
    {
      title: "Хранение",
      url: "/storage",
      icon: Warehouse,
      items: [
        {
          title: "Склад",
          url: "/storage",
        },
        {
          title: "Типы ячеек",
          url: "/storage",
        },
      ],
    },
    {
      title: "Организация",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "Подразделения",
          url: "#",
        },
        {
          title: "Сотрудники",
          url: "/employees",
        },
        {
          title: "Роли",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
