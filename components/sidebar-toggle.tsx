import { ComponentProps } from "react";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        className={cn("md:px-2 md:h-fit", className)}
      >
        <PanelLeft />
      </Button>
    </BetterTooltip>
  );
}
