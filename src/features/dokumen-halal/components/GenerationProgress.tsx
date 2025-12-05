import { FileText, Loader2, Sparkles } from "lucide-react";

export function GenerationProgress() {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <FileText className="text-primary-green h-12 w-12" />
        </div>
        <div className="bg-primary-green absolute -right-1 -bottom-1 rounded-full p-2">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-text-dark mb-2 text-lg font-semibold">Sedang Generate Dokumen...</h3>
        <p className="mb-4 text-sm text-gray-500">AI sedang menyusun dokumen berdasarkan data Anda</p>

        <div className="mx-auto max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="bg-primary-green h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4" />
          <span>Tunggu beberapa menit</span>
        </div>
      </div>
    </div>
  );
}
