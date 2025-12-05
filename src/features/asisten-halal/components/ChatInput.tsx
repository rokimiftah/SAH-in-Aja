import type { FormEvent, KeyboardEvent } from "react";

import { useState } from "react";

import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = "Ketik pertanyaan Anda..." }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none disabled:bg-gray-100 sm:rounded-xl sm:px-4 sm:py-3"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
      </div>
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="bg-primary-orange flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12 sm:rounded-xl"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
}
