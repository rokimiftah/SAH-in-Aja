import type { Doc } from "../../../convex/_generated/dataModel";
import type { TemplateType } from "@features/dokumen-halal";

import { useState } from "react";

import { useQuery } from "convex/react";
import { ArrowLeft, Calendar, Clock, Copy, Download, FileText, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";

import { generateAndDownloadDocx, TEMPLATE_INFO } from "@features/dokumen-halal";
import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { PageContainer } from "./components";

type HalalDocument = Doc<"halal_documents">;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DocumentListItem({ doc, onClick }: { doc: HalalDocument; onClick: () => void }) {
  const templateInfo = TEMPLATE_INFO[doc.templateType as TemplateType];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl sm:h-14 sm:w-14">
            {templateInfo?.icon || "📄"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-dark truncate font-semibold">{templateInfo?.name || doc.templateType}</p>
            <p className="truncate text-sm text-gray-500">{doc.businessInfo.name}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{formatDate(doc.createdAt)}</span>
            </div>
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 shrink-0 rotate-180 text-gray-400" />
      </div>
    </button>
  );
}

function DocumentDetail({ doc }: { doc: HalalDocument }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const templateInfo = TEMPLATE_INFO[doc.templateType as TemplateType];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(doc.generatedContent);
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
        title: templateInfo?.name || "Dokumen",
        businessName: doc.businessInfo.name,
        content: doc.generatedContent,
      });
    } catch (err) {
      console.error("Failed to generate docx:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{templateInfo?.icon || "📄"}</span>
          <div>
            <h3 className="text-text-dark font-semibold">{templateInfo?.name || doc.templateType}</h3>
            <p className="mt-0.5 text-sm text-gray-600">{doc.businessInfo.name}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(doc.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Informasi Usaha</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="text-gray-500">Pemilik:</span> {doc.businessInfo.owner}
          </p>
          <p>
            <span className="text-gray-500">Alamat:</span> {doc.businessInfo.address}
          </p>
          <p>
            <span className="text-gray-500">Jenis Produk:</span> {doc.businessInfo.productType}
          </p>
        </div>
      </div>

      {/* Document Content */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Isi Dokumen</span>
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
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{doc.generatedContent}</pre>
        </div>
      </div>
    </div>
  );
}

export function DokumenHalalHistoryPage() {
  const [, navigate] = useLocation();
  const [selectedDoc, setSelectedDoc] = useState<HalalDocument | null>(null);
  const documents = useQuery(api.halalDocuments.getMyDocuments);

  const isLoading = documents === undefined;

  // Detail view
  if (selectedDoc) {
    return (
      <PageContainer backButton={{ onClick: () => setSelectedDoc(null) }} centered maxWidth="3xl">
        <DocumentDetail doc={selectedDoc} />
      </PageContainer>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  // List view
  return (
    <PageContainer backButton={{ onClick: () => navigate("/dashboard/dokumen-halal") }} maxWidth="3xl">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-text-dark mb-2 text-2xl font-bold">Riwayat {FEATURES.dokumenHalal.name}</h1>
      </div>

      {documents.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-text-dark mb-2 text-lg font-semibold">Belum Ada Dokumen</h3>
          <p className="mb-6 text-gray-600">Buat dokumen pertama Anda untuk melihat riwayat di sini.</p>
          <Link
            href="/dashboard/dokumen-halal"
            className="bg-primary-blue inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
          >
            <FileText className="h-4 w-4" />
            Buat Dokumen
          </Link>
        </div>
      )}

      {documents.length > 0 && (
        <>
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentListItem key={doc._id} doc={doc} onClick={() => setSelectedDoc(doc)} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/dokumen-halal"
              className="bg-primary-blue inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
            >
              <FileText className="h-4 w-4" />
              Buat Dokumen Baru
            </Link>
          </div>
        </>
      )}
    </PageContainer>
  );
}
