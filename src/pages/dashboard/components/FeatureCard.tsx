import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

import { cn } from "@shared/lib";

interface FeatureCardProps {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  ctaText: string;
  href: string;
  gradient: string;
  available: boolean;
}

export function FeatureCard({ icon, name, tagline, description, ctaText, href, gradient, available }: FeatureCardProps) {
  const content = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl p-6 text-white transition-all duration-500",
        gradient,
        available ? "cursor-pointer hover:shadow-2xl" : "opacity-60",
      )}
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />

      {/* Content */}
      <div className="relative flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm">
            {icon}
          </div>
          {!available && (
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm">
              Segera
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="mb-2 text-2xl font-bold tracking-tight drop-shadow-sm">{name}</h3>
          <p className="mb-4 text-base font-medium text-white/90">{tagline}</p>
          <p className="text-sm leading-relaxed text-white/80">{description}</p>
        </div>

        {available && (
          <div className="mt-6 flex items-center gap-2 text-sm font-bold tracking-wide">
            <span className="relative pb-1">
              {ctaText}
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-white/30" />
              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full" />
            </span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );

  if (available) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}
