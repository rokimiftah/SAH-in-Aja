import { MessageCircle } from "lucide-react";

import { FEATURES } from "@shared/config/branding";

export function AsistenHalalPage() {
  return (
    <div className="px-4 pt-4 pb-20 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <MessageCircle className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-text-dark mb-2 text-2xl font-bold">{FEATURES.asistenHalal.name}</h1>
        <p className="text-primary-orange mb-4 font-medium">{FEATURES.asistenHalal.tagline}</p>
        <p className="mb-8 text-gray-600">{FEATURES.asistenHalal.description}</p>

        <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-8">
          <p className="text-lg font-semibold text-orange-600">Segera Hadir</p>
          <p className="mt-2 text-sm text-orange-500">Fitur ini sedang dalam pengembangan</p>
        </div>
      </div>
    </div>
  );
}
