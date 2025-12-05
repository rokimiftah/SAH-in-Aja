import { useEffect, useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useLocation } from "wouter";

export default function MagicLinkPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const getDashboardRedirect = () => (typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard");

  // Redirect when authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(decodeURIComponent(emailParam));
    } else if (!isAuthLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthLoading, isAuthenticated]);

  const handleSignIn = async () => {
    if (!token || !email) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("code", token);
      formData.set("email", email);
      formData.set("redirectTo", getDashboardRedirect());

      await signIn("magic-link", formData);
    } catch (_err) {
      setError("Gagal masuk. Link mungkin sudah kadaluarsa.");
      setLoading(false);
    }
  };

  if (!email || !token) {
    return null;
  }

  return (
    <div className="bg-bg-cream font-poppins flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="border-primary-green rounded-(--radius-card) border-4 bg-white p-6 shadow-lg sm:p-8">
          <div className="space-y-6">
            {/* Header with Logo */}
            <div className="text-center">
              <img src="/logo.avif" alt="SAH-in Aja" className="mx-auto mb-6 h-14 w-auto" />
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-primary-green/10 flex h-16 w-16 items-center justify-center rounded-full">
                <svg className="text-primary-green h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="text-text-dark text-xl font-bold">Konfirmasi Masuk</h2>
              <p className="text-text-muted mt-2 text-sm">Anda akan masuk dengan email:</p>
              <p className="text-text-dark mt-2 text-sm font-semibold break-all">{email}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border-accent-pink bg-accent-pink/10 rounded-(--radius-box) border-2 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-pink flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-accent-pink text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="bg-primary-green rounded-button w-full cursor-pointer px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  "Lanjutkan Masuk"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                disabled={loading}
                className="text-text-dark flex w-full cursor-pointer items-center justify-center gap-2 rounded-(--radius-box) border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Kembali ke Login
              </button>
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-text-muted text-xs">Link ini akan kadaluarsa dalam 10 menit demi keamanan Anda.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-text-muted hover:text-primary-green inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
