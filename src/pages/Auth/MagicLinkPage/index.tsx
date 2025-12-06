import { useEffect, useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { ArrowLeft, Loader2, Mail, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MagicLinkPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const getDashboardRedirect = () => (typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard");

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
    <div className="font-poppins relative flex min-h-dvh items-center justify-center overflow-hidden bg-gray-50 px-4 py-8">
      {/* Background abstract blur */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary-green/20 absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-primary-blue/20 absolute top-1/3 right-0 h-96 w-96 translate-x-1/4 rounded-full blur-[120px]" />
        <div className="bg-primary-orange/20 absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 translate-y-1/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="space-y-6">
            {/* Header with Logo */}
            <div className="mb-6 text-center">
              <Link href="/">
                <img src="/logo.avif" alt="SAH-in Aja" className="mx-auto h-12 w-auto sm:h-16" />
              </Link>
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-primary-green/10 flex h-16 w-16 items-center justify-center rounded-full">
                <Mail className="text-primary-green h-8 w-8" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">Konfirmasi Masuk</h1>
              <p className="mt-2 text-sm text-gray-500">Anda akan masuk dengan email:</p>
              <p className="mt-2 text-sm font-medium break-all text-gray-900">{email}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="bg-primary-green hover:bg-primary-green/90 w-full cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
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
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Kembali ke Login
              </button>
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-xs text-gray-400">Link ini akan kadaluarsa dalam 10 menit demi keamanan Anda.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
