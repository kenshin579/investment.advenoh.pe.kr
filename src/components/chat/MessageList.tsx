"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SourceLinks } from "./SourceLinks";
import { sendFeedback } from "@/lib/chat-api";
import type { SourceDocument } from "@/lib/chat-api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceDocument[];
  message_id?: string;
  question?: string;
}

type FeedbackStatus = "idle" | "sending" | "done";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [feedbackMap, setFeedbackMap] = useState<
    Record<string, { status: FeedbackStatus; rating?: "up" | "down" }>
  >({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFeedback = useCallback(
    async (msg: Message, rating: "up" | "down") => {
      if (!msg.message_id) return;

      setFeedbackMap((prev) => ({
        ...prev,
        [msg.id]: { status: "sending", rating },
      }));

      try {
        await sendFeedback({
          message_id: msg.message_id,
          blog_id: "investment",
          question: msg.question || "",
          rating,
        });
        setFeedbackMap((prev) => ({
          ...prev,
          [msg.id]: { status: "done", rating },
        }));
      } catch {
        setFeedbackMap((prev) => ({
          ...prev,
          [msg.id]: { status: "idle" },
        }));
      }
    },
    []
  );

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Bot className="mb-3 h-10 w-10" />
            <p className="text-sm font-medium">투자에 대해 궁금한 것을 물어보세요!</p>
            <p className="mt-1 text-xs">예: &quot;ETF 관련 글이 있나요?&quot;</p>
          </div>
        )}

        {messages.map((msg) => {
          const feedback = feedbackMap[msg.id];
          const feedbackStatus = feedback?.status ?? "idle";

          return (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === "assistant" && msg.sources && (
                  <SourceLinks sources={msg.sources} />
                )}
                {msg.role === "assistant" && msg.message_id && (
                  <div className="mt-2 flex items-center gap-1 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                    {feedbackStatus === "done" ? (
                      <span>
                        피드백 감사합니다{" "}
                        {feedback?.rating === "up" ? "👍" : "👎"}
                      </span>
                    ) : feedbackStatus === "sending" ? (
                      <span>전송 중...</span>
                    ) : (
                      <>
                        <span>도움이 됐나요?</span>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg, "up")}
                          className="ml-1 rounded p-1 hover:bg-background/60"
                          aria-label="도움이 됐어요"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg, "down")}
                          className="rounded p-1 hover:bg-background/60"
                          aria-label="도움이 안 됐어요"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
