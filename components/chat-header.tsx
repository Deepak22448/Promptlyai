import Link from "next/link";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { BetterTooltip } from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function ChatHeader() {
  const session = useSession();
  return (
    <header className="flex h-16 sticky top-0 bg-background md:h-12 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      <BetterTooltip content="New Chat">
        <Button
          variant="ghost"
          className="w-auto md:size-8 [&>svg]:!size-5 md:[&>svg]:!size-4 pl-2 md:p-0 order-2 md:order-1 ml-auto md:ml-0 md:hidden group-data-[state=collapsed]/sidebar-wrapper:flex"
          asChild
        >
          <Link href="/">
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Link>
        </Button>
      </BetterTooltip>

      <Link
        href="/signin"
        className={cn(
          buttonVariants({
            className: "h-8 md:ml-auto",
            variant: "secondary",
          }),
          session.status === "unauthenticated" ? "flex" : "hidden"
        )}
      >
        Login
      </Link>
    </header>
  );
}
