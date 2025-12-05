import type { TemplateType } from "../types";

import { useState } from "react";

import { AlertTriangle, CheckCircle2, Copy, Download, FileText, Loader2, RefreshCw } from "lucide-react";

import { FEATURES } from "@shared/config/branding";

import { TEMPLATE_INFO } from "../types";
import { generateAndDownloadDocx } from "../utils/generateDocx";

interface DocumentPreviewProps {
  content: string;
  templateType: TemplateType;
  businessName: string;
  onNewDocument: () => void;
}

export function DocumentPreview({ content, templateType, businessName, onNewDocument }: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const templateInfo = TEMPLATE_INFO[templateType];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateAndDownloadDocx({
        title: templateInfo.name,
        businessName,
        content,
      });
    } catch (err) {
      console.error("Failed to generate docx:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="rounded-xl bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle2 className="text-primary-green h-5 w-5" />
          </div>
          <div>
            <h3 className="text-text-dark font-semibold">Dokumen Berhasil Dibuat!</h3>
            <p className="mt-0.5 text-sm text-gray-600">
              {templateInfo.icon} {templateInfo.name}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Template Dokumen - Perlu Review</p>
            <p className="mt-1 text-amber-700">
              Ini adalah template auto-generated. Review dan sesuaikan dengan kondisi usaha Anda sebelum submit ke BPJPH.
            </p>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Preview Dokumen</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={handleCopy}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-3"
            >
              <Copy className="h-3.5 w-3.5 shrink-0" />
              <span>{copied ? "Tersalin!" : "Salin"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="bg-primary-blue flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:px-3"
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{downloading ? "..." : ".docx"}</span>
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{content}</pre>
        </div>
      </div>

      {/* Official Resources */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Sumber Resmi:</p>
        <div className="space-y-2">
          {FEATURES.dokumenHalal.officialResources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-blue block text-sm hover:underline"
            >
              {resource.name} - {resource.description}
            </a>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onNewDocument}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Buat Dokumen Baru
        </button>
      </div>
    </div>
  );
}
