interface TopicSelectorProps {
  value: "bahan" | "produksi" | "sop" | "umum";
  onChange: (value: "bahan" | "produksi" | "sop" | "umum") => void;
}

const topics = [
  { value: "umum" as const, label: "Semua Topik", description: "Campuran semua materi", icon: "📚" },
  { value: "bahan" as const, label: "Bahan Baku", description: "Supplier & penyimpanan", icon: "🥬" },
  { value: "produksi" as const, label: "Produksi", description: "Proses & peralatan", icon: "🍳" },
  { value: "sop" as const, label: "SOP & Dokumen", description: "Prosedur & catatan", icon: "📋" },
];

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-gray-700">Pilih Fokus Topik</span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {topics.map((topic) => (
          <button
            key={topic.value}
            type="button"
            onClick={() => onChange(topic.value)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
              value === topic.value ? "border-rose-500 bg-rose-50" : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-xl sm:text-2xl">{topic.icon}</span>
            <div className="min-w-0 flex-1">
              <span
                className={`block text-sm font-medium sm:text-base ${value === topic.value ? "text-rose-700" : "text-gray-700"}`}
              >
                {topic.label}
              </span>
              <p className="truncate text-xs text-gray-500">{topic.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
