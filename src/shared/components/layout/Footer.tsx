export const Footer = () => {
  return (
    <div className="text-text-muted flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
      <span>Hackathon IMPHNEN x Kolosai.ai 2025.</span>
      <div className="flex gap-4">
        <a href="/" className="hover:text-primary-green transition-colors">
          Syarat dan Ketentuan
        </a>
        <a href="/" className="hover:text-primary-green transition-colors">
          Kebijakan Privasi
        </a>
      </div>
    </div>
  );
};
