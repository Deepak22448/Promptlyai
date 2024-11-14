"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { AvatarDropDown } from "./avatar-dropdown";
import { SidebarHistory } from "./sidebar-history";
import { User } from "next-auth";

export function AppSidebar({ user }: { user?: User | undefined }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => setOpenMobile(false)}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2">Promptly</span>
            </Link>
            <BetterTooltip content="New Chat" align="start">
              <Button variant="ghost" className="p-2 h-fit">
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  <PlusIcon />
                </Link>
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AvatarDropDown user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
