import { useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Check, Coins, Copy, Plus, Power, Search, Tag, User } from "lucide-react";
import { Link } from "wouter";

import { DatePicker } from "@shared/components/ui";

import { api } from "../../../convex/_generated/api";

export function PromoCodesPage() {
  const promos = useQuery(api.admin.getAllPromoCodes);
  const createPromo = useMutation(api.admin.createPromoCode);
  const togglePromo = useMutation(api.admin.togglePromoCode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    credits: 10,
    maxUsage: "",
    expiresAt: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createPromo({
        code: formData.code,
        credits: Number(formData.credits),
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : undefined,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined,
      });
      setIsModalOpen(false);
      setFormData({ code: "", credits: 10, maxUsage: "", expiresAt: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Gagal membuat promo code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredPromos = promos?.filter((p) => p.code.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!promos)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Mobile Back Button - Sticky at top */}
      <div className="shrink-0 px-1 pt-1 sm:hidden">
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Link
            href="/admin"
            className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
            <p className="mt-1 text-gray-500">Manage promotional credits and usage limits</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-orange-700 hover:shadow-md sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Search Bar */}
          <div className="border-b border-gray-100 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Code</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Credits</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Usage</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Expires</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPromos?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No promo codes found
                    </td>
                  </tr>
                ) : (
                  filteredPromos?.map((promo) => (
                    <tr key={promo._id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-gray-900">{promo.code}</span>
                          <button
                            onClick={() => handleCopy(promo.code)}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            {copiedCode === promo.code ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Coins className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">+{promo.credits}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{promo.usageCount}</span>
                          <span className="text-gray-400">/</span>
                          <span>{promo.maxUsage ?? "∞"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {promo.expiresAt ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {format(promo.expiresAt, "MMM d, yyyy")}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            promo.isActive
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          {promo.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => togglePromo({ id: promo._id })}
                          className={`cursor-pointer rounded-lg p-2 transition-colors ${
                            promo.isActive ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="animate-in fade-in zoom-in w-full max-w-md rounded-2xl bg-white p-6 shadow-xl duration-200">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Create Promo Code</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="promo-code" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Code
                  </label>
                  <div className="relative">
                    <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="promo-code"
                      type="text"
                      required
                      placeholder="e.g. HALALBERKAH"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="promo-credits" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Credits Amount
                  </label>
                  <div className="relative">
                    <Coins className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="promo-credits"
                      type="number"
                      required
                      min="1"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="promo-usage" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Max Usage
                    </label>
                    <input
                      id="promo-usage"
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={formData.maxUsage}
                      onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="promo-expiration" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Expiration
                    </label>
                    <DatePicker
                      value={formData.expiresAt}
                      onChange={(value) => setFormData({ ...formData, expiresAt: value })}
                      placeholder="Pilih tanggal..."
                    />
                  </div>
                </div>
                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</div>
                )}
                <div className="mt-8 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitError(null);
                    }}
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Create Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
