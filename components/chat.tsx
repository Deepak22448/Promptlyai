"use client";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message } from "ai";
import { useChat } from "ai/react";
import { FC } from "react";
import { ChatInput } from "./chat-input";
import { Message as PreviewMessage } from "./message";
import { ChatHeader } from "./chat-header";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface ChatProps {
  id: string;
  initialMessages: Message[];
}
export const Chat: FC<ChatProps> = ({ id, initialMessages }) => {
  const session = useSession();
  const { messages, handleSubmit, input, setInput, isLoading, stop, append } =
    useChat({
      id,
      body: { id },
      initialMessages,
      onFinish: () => {
        if (session.status === "authenticated") {
          window.history.replaceState({}, "", `/chat/${id}`);
        }
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <div
        ref={messagesContainerRef}
        className={cn(
          "flex flex-col min-w-0 gap-6 overflow-y-scroll flex-1 md:flex-[0] md:px-4",
          !!messages.length && "md:flex-1"
        )}
      >
        {!!messages.length &&  (
          messages.map((message) => (
            <PreviewMessage
              key={message.id}
              role={message.role}
              chatId={id}
              content={message.content}
              messageId={message.id}
            />
          ))
        )}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <form
        className={cn(
          "flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl",
          !messages.length && "md:flex-1 md:justify-center md:items-center md:h-full"
        )}
      >
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          append={append}
        />
      </form>
    </div>
  );
};
