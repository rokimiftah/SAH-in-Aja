import type { TemplateType } from "../types";

import { Check } from "lucide-react";

import { TEMPLATE_INFO } from "../types";

interface TemplateSelectorProps {
  selected: TemplateType | null;
  onSelect: (template: TemplateType) => void;
}

const TEMPLATE_ORDER: TemplateType[] = ["sop_produksi", "perjanjian_supplier", "daftar_bahan", "traceability", "komitmen_halal"];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-text-dark text-xl font-bold">Pilih Jenis Dokumen</h2>
        <p className="mt-1 text-sm text-gray-600">Pilih dokumen SJPH yang ingin Anda generate</p>
      </div>

      <div className="grid gap-3">
        {TEMPLATE_ORDER.map((type) => {
          const info = TEMPLATE_INFO[type];
          const isSelected = selected === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={`relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                isSelected ? "border-primary-green bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-3xl">{info.icon}</span>
              <div className="flex-1">
                <h3 className="text-text-dark font-semibold">{info.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{info.description}</p>
              </div>
              {isSelected && (
                <div className="bg-primary-green absolute top-3 right-3 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
