import type { Id } from "../../../convex/_generated/dataModel";

import { useEffect, useRef, useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { Check, Loader2, Mail, Upload } from "lucide-react";
import { useLocation } from "wouter";

import { useToast } from "@shared/components/ui";
import { cn, compressImage } from "@shared/lib";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

const PROVIDER_ICONS: Record<string, React.ReactNode> = {
  google: (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  "magic-link": <Mail className="h-4 w-4" />,
};

const PROVIDER_NAMES: Record<string, string> = {
  google: "Google",
  "magic-link": "Email",
};

export function EditProfilePage() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [name, setName] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cleanup preview URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const currentName = name ?? user?.name ?? "";
  const currentBusinessName = businessName ?? user?.businessName ?? "";
  const currentAddress = address ?? user?.address ?? "";
  const currentImage = previewUrl ?? user?.image;
  const linkedProviders = user?.linkedProviders ?? [];

  const initials = (() => {
    const src = (currentName || user?.email || "?").trim();
    const parts = src.includes("@")
      ? src
          .split("@")[0]
          .split(/[.\s_+-]+/)
          .filter(Boolean)
      : src.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "?";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  })();

  const avatarUrl =
    currentImage || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=10b981`;

  const hasChanges = name !== null || businessName !== null || address !== null || compressedBlob !== null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    try {
      // Compress to AVIF/WebP, max 256x256, target 50KB
      const compressed = await compressImage(file, { maxSize: 256, maxSizeKB: 50 });
      setCompressedBlob(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      console.error("Failed to compress image:", err);
      toast.error("Gagal memproses gambar. Coba gambar lain.");
    }
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setSaved(false);

    try {
      let storageId: Id<"_storage"> | undefined;

      if (compressedBlob) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": "image/webp" },
          body: compressedBlob,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const { storageId: uploadedId } = (await response.json()) as { storageId: Id<"_storage"> };
        storageId = uploadedId;
      }

      await updateProfile({
        ...(name !== null && { name }),
        ...(businessName !== null && { businessName }),
        ...(address !== null && { address }),
        ...(storageId && { storageId }),
      });

      setSaved(true);
      setName(null);
      setBusinessName(null);
      setAddress(null);
      setCompressedBlob(null);
      setPreviewUrl(null);
      toast.success("Profil berhasil disimpan");

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Gagal menyimpan profil. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard") }} centered maxWidth="xl">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Profil</h1>
        <p className="mt-2 text-sm text-gray-600">Perbarui foto dan informasi Anda</p>
      </div>

      {/* Avatar Section */}
      <div className="mb-6 flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <div className="relative mb-3">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
            referrerPolicy="no-referrer"
          />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-emerald-600 shadow-sm transition-all hover:text-emerald-700 hover:shadow-md"
        >
          <Upload className="h-4 w-4" />
          Ganti Foto
        </button>
      </div>

      {/* Form Fields - Simple 2 Column */}
      <div className="mb-6 space-y-5">
        {/* Row 1: Nama & Nama Usaha */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={currentName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="h-10.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-800 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nama Usaha
            </label>
            <input
              id="businessName"
              type="text"
              value={currentBusinessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Masukkan nama usaha Anda"
              className="h-10.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-800 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Email & Alamat Usaha */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Email</span>
            <div className="flex h-10.5 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
              {user.email || "-"}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
              Alamat Usaha
            </label>
            <input
              id="address"
              type="text"
              value={currentAddress}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat usaha Anda"
              className="h-10.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-800 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: Metode Login (Full Width) */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Metode Login Terhubung</span>
          <div className="flex h-10.5 gap-2">
            {linkedProviders.length > 0 ? (
              linkedProviders.map((provider) => (
                <div
                  key={provider}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 sm:gap-2"
                >
                  <span className="text-gray-600">{PROVIDER_ICONS[provider] || <Mail className="h-4 w-4" />}</span>
                  <span className="hidden text-sm font-medium text-gray-700 sm:inline">
                    {PROVIDER_NAMES[provider] || provider}
                  </span>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              ))
            ) : (
              <div className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                Tidak ada provider terhubung
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold shadow-md transition-all",
          hasChanges && !saving
            ? "cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg"
            : "cursor-not-allowed bg-gray-100 text-gray-400",
        )}
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Menyimpan...
          </>
        ) : saved ? (
          <>
            <Check className="h-5 w-5" />
            Tersimpan!
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </button>
    </PageContainer>
  );
}
