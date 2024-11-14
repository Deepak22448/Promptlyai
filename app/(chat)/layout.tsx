import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type PropsWithChildren } from "react";

const ChatLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  return (
    <SidebarProvider>
      <AppSidebar user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default ChatLayout;
