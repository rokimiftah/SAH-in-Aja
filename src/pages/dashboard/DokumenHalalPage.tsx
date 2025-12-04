import { FileText } from "lucide-react";

import { FEATURES } from "@shared/config/branding";

export function DokumenHalalPage() {
  return (
    <div className="px-4 pt-4 pb-20 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-text-dark mb-2 text-2xl font-bold">{FEATURES.dokumenHalal.name}</h1>
        <p className="text-primary-blue mb-4 font-medium">{FEATURES.dokumenHalal.tagline}</p>
        <p className="mb-8 text-gray-600">{FEATURES.dokumenHalal.description}</p>

        <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 p-8">
          <p className="text-lg font-semibold text-blue-600">Segera Hadir</p>
          <p className="mt-2 text-sm text-blue-500">Fitur ini sedang dalam pengembangan</p>
        </div>
      </div>
    </div>
  );
}
