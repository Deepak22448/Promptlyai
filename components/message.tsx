"use client";

import {  CheckIcon, CopyIcon } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";
import { Markdown } from "./markdown";
import { BetterTooltip } from "./ui/tooltip";
import { Button } from "./ui/button";
import Image from "next/image";

export const Message = ({
  role,
  content,
  messageId,
}: {
  chatId: string;
  role: string;
  content: string;
  messageId: string;
}) => {
  return (
    <div className="gap-4 w-full max-w-3xl px-4 md:px-0 mx-auto">
      {role === "assistant" ? (
        <AssistantMessage content={content} messageId={messageId} />
      ) : (
        <UserMessage content={content} />
      )}
    </div>
  );
};
const UserMessage: FC<{ content: string }> = ({ content }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-secondary px-5 py-3 rounded-3xl max-w-[80%]">
        {content}
      </div>
    </div>
  );
};

const AssistantMessage: FC<{ content: string; messageId: string }> = ({
  content,
}) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
  }, [content]);

  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  return (
    <div className="flex gap-x-3">
      <div className="p-2 bg-secondary rounded-full self-start flex-shrink-0">
        <Image
          src="/promptly-icon.png"
          alt="Promptly Logo"
          width={24}
          height={24}
        />
      </div>
      <div className="flex-1 self-start w-full">
        <Markdown>{content}</Markdown>
        <BetterTooltip content="Copy" align="start">
          <Button
            variant="ghost"
            className="p-2 h-fit"
            onClick={copyToClipboard}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </BetterTooltip>
      </div>
    </div>
  );
};
