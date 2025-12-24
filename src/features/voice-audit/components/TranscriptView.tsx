import type { TranscriptEntry } from "../hooks/useVapiAudit";

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  isSpeaking: boolean;
}

export function TranscriptView({ transcript, isSpeaking }: TranscriptViewProps) {
  return (
    <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto rounded-xl bg-gray-50 p-4">
      {transcript.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">Menunggu percakapan dimulai...</p>
        </div>
      )}
      {transcript.map((entry, index) => (
        <div key={index} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              entry.role === "user"
                ? "rounded-br-sm bg-emerald-500 text-white"
                : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
            }`}
          >
            <p className="text-sm">{entry.text}</p>
          </div>
        </div>
      ))}
      {isSpeaking && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-2 text-gray-800">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 delay-100" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 delay-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
