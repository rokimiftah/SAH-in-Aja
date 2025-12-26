import type { BusinessInfo } from "../types";

import { Building2, Droplets, MapPin, Package, User } from "lucide-react";

import { Select } from "@shared/components/ui";

interface BusinessInfoFormProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
}

const WASHING_METHODS = [
  { value: "air_mengalir", label: "Air Mengalir (Kran/Selang) - DISARANKAN", color: "text-green-600" },
  { value: "rendam_bilas", label: "Rendam & Bilas Air Mengalir", color: "text-blue-600" },
  { value: "usap_basah", label: "Usap Kain Basah (Hanya untuk alat listrik)", color: "text-amber-600" },
  { value: "lainnya", label: "Lainnya", color: "text-gray-600" },
];

export function BusinessInfoForm({ data, onChange }: BusinessInfoFormProps) {
  const updateField = (field: keyof BusinessInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-text-dark text-xl font-bold">Informasi Usaha</h2>
        <p className="mt-1 text-sm text-gray-600">Lengkapi data usaha Anda untuk dokumen</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-text-dark mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-gray-400" />
            Nama Usaha
          </span>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="contoh: Warung Makan Bu Tini"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-text-dark mb-1.5 flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-gray-400" />
            Nama Pemilik
          </span>
          <input
            type="text"
            value={data.owner}
            onChange={(e) => updateField("owner", e.target.value)}
            placeholder="contoh: Tini Sumarni"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-text-dark mb-1.5 flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-gray-400" />
            Alamat Usaha
          </span>
          <textarea
            value={data.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="contoh: Jl. Pasar Baru No. 123, Bandung"
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-text-dark mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4 text-gray-400" />
            Jenis Produk
          </span>
          <input
            type="text"
            value={data.productType}
            onChange={(e) => updateField("productType", e.target.value)}
            placeholder="contoh: Makanan Siap Saji, Kue Basah, dll"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <div className="block">
          <span className="text-text-dark mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Droplets className="h-4 w-4 text-gray-400" />
            Metode Pencucian Peralatan (Wajib Syar'i)
          </span>
          <Select
            value={data.washingMethod || ""}
            onChange={(val) => updateField("washingMethod", val)}
            options={WASHING_METHODS}
            placeholder="Pilih metode pencucian (Disarankan: Air Mengalir)"
          />
          <p className="mt-1 text-xs text-gray-500">
            *Metode pencucian najis wajib menggunakan air mengalir sampai hilang bau, rasa, dan warna.
          </p>
        </div>
      </div>
    </div>
  );
}
