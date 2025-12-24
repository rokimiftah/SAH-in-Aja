interface TitleSelectorProps {
  value: "bapak" | "ibu" | "mas" | "mbak";
  onChange: (value: "bapak" | "ibu" | "mas" | "mbak") => void;
}

const titles = [
  { value: "bapak" as const, label: "Bapak" },
  { value: "ibu" as const, label: "Ibu" },
  { value: "mas" as const, label: "Mas" },
  { value: "mbak" as const, label: "Mbak" },
];

export function TitleSelector({ value, onChange }: TitleSelectorProps) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-gray-700">Bagaimana kami menyapa Anda?</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {titles.map((title) => (
          <button
            key={title.value}
            type="button"
            onClick={() => onChange(title.value)}
            className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition-all sm:text-base ${
              value === title.value
                ? "border-rose-500 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {title.label}
          </button>
        ))}
      </div>
    </div>
  );
}
