import { useEffect, useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { ConvexError } from "convex/values";
import { useLocation } from "wouter";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getDashboardRedirect = () => (typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard");

  // Redirect when authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      setError("Masukkan alamat email yang valid");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", trimmedEmail);
    formData.set("redirectTo", getDashboardRedirect());

    try {
      await signIn("magic-link", formData);
      setShowSuccess(true);
      setEmail("");
      setTimeout(() => setShowSuccess(false), 7000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ConvexError
          ? (err.data as { message: string }).message || "Gagal mengirim magic link"
          : "Gagal mengirim magic link";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { redirectTo: getDashboardRedirect() });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ConvexError
          ? (err.data as { message: string }).message || "Gagal masuk dengan Google"
          : "Gagal masuk dengan Google";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("github", { redirectTo: getDashboardRedirect() });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ConvexError
          ? (err.data as { message: string }).message || "Gagal masuk dengan GitHub"
          : "Gagal masuk dengan GitHub";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-cream font-poppins flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="border-primary-green rounded-(--radius-card) border-4 bg-white p-6 shadow-lg sm:p-8">
          <div className="space-y-6">
            {/* Header with Logo */}
            <div className="text-center">
              <img src="/logo.avif" alt="SAH-in Aja" className="mx-auto mb-12 h-14 w-auto" />
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="border-primary-green bg-primary-green/10 rounded-(--radius-box) border-2 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-green flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-dark text-sm font-semibold">Email terkirim!</p>
                    <p className="text-text-muted mt-0.5 text-xs">Cek inbox email Anda dan klik link untuk masuk.</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="text-text-dark flex w-full cursor-pointer items-center justify-center gap-3 rounded-(--radius-box) border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="text-text-dark flex w-full cursor-pointer items-center justify-center gap-3 rounded-(--radius-box) border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="text-text-muted bg-white px-4 text-xs font-semibold uppercase">atau</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-text-dark mb-1.5 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  disabled={isLoading}
                  className="text-text-dark focus:border-primary-green focus:ring-primary-green/20 w-full rounded-(--radius-box) border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !isValidEmail(email.trim())}
                className="bg-primary-green rounded-button w-full cursor-pointer px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Magic Link"
                )}
              </button>
            </form>
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
