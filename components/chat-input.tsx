"use client";

import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

import useWindowSize from "@/hooks/use-window-size";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowUpIcon, StopCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

const suggestedActions = [
  {
    title: "Classic Biryani Recipe ",
    label: "Help me make a classic biryani",
    action: "Classic Biryani Recipe",
  },
  {
    title: "Roadmap to AI",
    label: "Help me understand AI",
    action: "Roadmap to AI",
  },
];

export function ChatInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { width } = useWindowSize();
  // Focus on input when user types an alphanumeric key.
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const isAlphaNumeric = /^[a-zA-Z0-9]$/.test(e.key);
      if (!(e.metaKey || e.ctrlKey || e.altKey) && isAlphaNumeric) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined);

    if (width && width > 768) {
      inputRef.current?.focus();
    }
  }, [handleSubmit, width]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-4 w-full md:px-0 mx-auto md:max-w-lg md:order-2">
          {suggestedActions.map((suggestedAction, index) => (
            <div
              className={cn(
                "animate-in fade-in duration-1000",
                index > 1 ? "hidden sm:block" : "block"
              )}
              key={index}
            >
              <Card
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedAction.action,
                  });
                }}
                className="px-4 py-2.5 cursor-pointer hover:bg-secondary transition-all duration-150"
              >
                <p className="font-medium text-primary text-sm">{suggestedAction.title}</p>
                <p className="text-muted-foreground line-clamp-1 text-xs">
                  {suggestedAction.label}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Message Promptly"
          value={input}
          onChange={handleInput}
          className="animate-in fade-in duration-1000 min-h-[24px] overflow-hidden resize-none rounded-full text-base bg-muted border-none"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error(
                  "Please wait for the model to finish its response!"
                );
              } else {
                submitForm();
              }
            }
          }}
        />

        {isLoading ? (
          <Button
            className="rounded-full p-1.5 h-fit absolute bottom-1 right-2 m-0.5 text-white"
            onClick={(event) => {
              event.preventDefault();
              stop();
            }}
          >
            <StopCircleIcon
              size={14}
              className="text-secondary"
              strokeWidth={4}
            />
          </Button>
        ) : (
          <Button
            className="rounded-full p-1.5 h-fit absolute bottom-1 right-2 m-0.5 text-white"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0}
          >
            <ArrowUpIcon size={14} className="text-secondary" strokeWidth={4} />
          </Button>
        )}
      </div>
    </div>
  );
}
