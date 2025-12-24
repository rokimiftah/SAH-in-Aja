import { Star, Zap } from "lucide-react";

export const SocialProof = () => {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              <div className="bg-primary-green flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                W
              </div>
              <div className="bg-primary-blue flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                M
              </div>
              <div className="bg-primary-orange flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                S
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-xs font-bold text-white">
                R
              </div>
            </div>
            <span>100+ UMKM terdaftar</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Zap className="text-primary-green h-4 w-4" />
            <span>Hasil dalam 2 menit</span>
          </div>
        </div>
      </div>
    </section>
  );
};
