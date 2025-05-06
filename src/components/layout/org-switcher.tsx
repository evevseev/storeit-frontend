"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAtom, useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import CreateOrgDialog from "../create-org/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function OrgSwitcher() {
  const { getOrganizationId, setOrganizationId } = useAuth();
  const queryClient = useApiQueryClient();
  const globalQueryClient = useQueryClient();
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const { data: orgs, isPending } = queryClient.useQuery("get", "/orgs");

  const { data: currentOrg } = queryClient.useQuery("get", "/orgs/{id}", {
    params: {
      path: {
        id: getOrganizationId(),
      },
    },
  });

  const { isMobile } = useSidebar();

  const changeOrg = (orgId: string) => {
    setOrganizationId(orgId);
    globalQueryClient.invalidateQueries();
  };

  return (
    <>
      <CreateOrgDialog
        isOpen={isCreateOrgDialogOpen}
        onOpenChange={setIsCreateOrgDialogOpen}
        withTrigger={false}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar>
                  <AvatarFallback>
                    {currentOrg?.data.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentOrg?.data.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Организации
              </DropdownMenuLabel>
              {orgs?.data.map((org, _) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => changeOrg(org.id)}
                  className=" p-2 break-all gap-4 "
                >
                  <Avatar>
                    <AvatarFallback>{org.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {org.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <button
                  className="text-muted-foreground font-medium"
                  onClick={() => setIsCreateOrgDialogOpen(true)}
                >
                  Создать организацию
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
