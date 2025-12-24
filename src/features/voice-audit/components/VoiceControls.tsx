import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

interface VoiceControlsProps {
  isActive: boolean;
  isSpeaking: boolean;
  status: "idle" | "connecting" | "connected" | "error";
  onStart: () => void;
  onEnd: () => void;
}

export function VoiceControls({ isActive, isSpeaking, status, onStart, onEnd }: VoiceControlsProps) {
  const isConnecting = status === "connecting";

  if (!isActive) {
    return (
      <button
        onClick={onStart}
        disabled={isConnecting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:bg-gray-300"
      >
        {isConnecting ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Menghubungkan...</span>
          </>
        ) : (
          <>
            <Phone className="h-5 w-5" />
            <span>Mulai Simulasi</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 py-3 text-emerald-700">
        {isSpeaking ? (
          <>
            <Mic className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Auditor sedang berbicara...</span>
          </>
        ) : (
          <>
            <MicOff className="h-5 w-5" />
            <span className="font-medium">Giliran Anda menjawab</span>
          </>
        )}
      </div>
      <button
        onClick={onEnd}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-4 font-semibold text-white transition-colors hover:bg-red-600"
      >
        <PhoneOff className="h-5 w-5" />
        <span>Akhiri Sesi</span>
      </button>
    </div>
  );
}
