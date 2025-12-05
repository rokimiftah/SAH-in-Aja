import type { ChatMessage as ChatMessageType } from "../hooks/useAsistenHalal";

import Markdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessageType;
  userAvatar?: string;
}

export function ChatMessage({ message, userAvatar }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-8 sm:w-8 ${
          isUser ? "ring-2 ring-gray-200" : "bg-orange-100 p-1"
        }`}
      >
        {isUser ? (
          <img src={userAvatar} alt="User" className="h-full w-full rounded-full object-cover" />
        ) : (
          <img src="/favicon.avif" alt="Asisten" className="h-full w-full object-contain" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] overflow-hidden rounded-2xl px-3 py-2 sm:max-w-[80%] sm:px-4 sm:py-3 ${
          isUser ? "bg-primary-orange text-white" : "border border-gray-200 bg-gray-50 text-gray-800"
        }`}
      >
        {isUser ? (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div className="prose prose-sm prose-gray max-w-none text-sm leading-relaxed [&_a]:text-orange-600 [&_a]:underline [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_hr]:my-3 [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:pl-4 [&_p]:my-2 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-800 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-gray-100 [&_strong]:font-semibold [&_table]:my-2 [&_table]:w-full [&_table]:text-xs [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-1 [&_th]:font-semibold [&_ul]:my-2 [&_ul]:pl-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {/* Source indicator for assistant */}
        {!isUser && message.source && message.source !== "error" && (
          <div className="mt-2 flex items-center gap-1 border-t border-gray-200 pt-2 text-[10px] text-gray-400 sm:text-xs">
            {message.source === "faq" ? "📚 Knowledge Base" : "🤖 AI Response"}
          </div>
        )}
      </div>
    </div>
  );
}
