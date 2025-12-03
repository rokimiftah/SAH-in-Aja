interface SectionDividerProps {
  label: string;
  accentClasses: string;
}

export const SectionDivider = ({ label, accentClasses }: SectionDividerProps) => (
  <div className="my-8 flex items-center gap-4">
    <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
    <span
      className={`inline-flex items-center rounded-full border bg-white px-4 py-2 text-[0.85rem] font-semibold whitespace-nowrap uppercase shadow-sm ${accentClasses}`}
    >
      {label}
    </span>
    <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
  </div>
);
