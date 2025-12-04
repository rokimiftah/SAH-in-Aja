import { Link } from "wouter";

export const Header = () => {
  return (
    <header className="bg-primary-green sticky top-0 z-10 flex items-center justify-between px-6 py-1 text-white shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.avif" alt="Sah-in Aja!" className="h-12 w-auto" />
      </Link>
      <Link
        href="/dashboard"
        className="text-primary-green cursor-pointer rounded-full bg-white px-4 py-2 font-bold shadow-sm transition hover:bg-teal-50"
      >
        Dashboard
      </Link>
    </header>
  );
};
