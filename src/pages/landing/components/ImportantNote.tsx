import { AlertTriangle } from "lucide-react";

export const ImportantNote = () => {
  return (
    <div className="bg-warning-yellow mb-8 rounded-(--radius-box) border-2 border-yellow-500 p-6 shadow-lg">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Catatan Penting:</h3>
          <p className="leading-relaxed text-gray-800">
            SAH-in Aja! adalah teman belajar dan persiapan. Untuk hasil yang sah secara hukum, tetap konsultasikan dokumen final
            ke notaris atau lembaga resmi ya!
          </p>
        </div>
      </div>
    </div>
  );
};
