import { type CoreMessage } from "ai";
import { notFound } from "next/navigation";
import { Chat as PreviewChat } from "@/components/chat";
import { getChatById } from "@/db/queries";
import { type Chat } from "@/db/schema";
import { convertToUIMessages, getTitleFromChat } from "@/lib/utils";
import { auth } from "@/auth";
import { type Metadata } from "next";

interface Props {
  params: Promise<{ chatId: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).chatId;
  const chat = await getChatById({ id });
  const title = getTitleFromChat(chat as Chat);

  return {
    title,
  };
}

export default async function Page({ params }: Props) {
  const { chatId } = await params;
  const chatFromDb = await getChatById({ id: chatId });

  if (!chatFromDb) {
    notFound();
  }

  // type casting and converting messages to UI messages
  const chat: Chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  return <PreviewChat id={chat.id} initialMessages={chat.messages} />;
}
