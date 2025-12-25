import type { QuizAnswer } from "../types";

import { Award, CheckCircle, Download, RefreshCw, XCircle } from "lucide-react";

import { PASSING_SCORE, QUIZ_QUESTIONS } from "../types";

interface QuizResultProps {
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  certificateNumber?: string;
  onRetry: () => void;
  onDownloadCertificate?: () => void;
}

export function QuizResult({ answers, score, passed, certificateNumber, onRetry, onDownloadCertificate }: QuizResultProps) {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Result Card */}
      <div
        className={`rounded-2xl p-4 text-center sm:p-6 ${
          passed ? "bg-linear-to-br from-emerald-50 to-cyan-50" : "bg-linear-to-br from-red-50 to-orange-50"
        }`}
      >
        <div
          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full sm:mb-4 sm:h-20 sm:w-20 ${
            passed ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <Award className="h-8 w-8 text-emerald-600 sm:h-10 sm:w-10" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600 sm:h-10 sm:w-10" />
          )}
        </div>

        <h2 className={`text-xl font-bold sm:text-2xl ${passed ? "text-emerald-700" : "text-red-700"}`}>
          {passed ? "Selamat, Anda Lulus!" : "Maaf, Anda Belum Lulus"}
        </h2>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          {passed
            ? "Anda telah memahami dasar-dasar kehalalan produk."
            : `Nilai minimum kelulusan adalah ${PASSING_SCORE}%. Silakan coba lagi.`}
        </p>

        <div className="mt-4 inline-flex items-center gap-4 sm:mt-6 sm:gap-6">
          <div className="text-center">
            <p className={`text-3xl font-bold sm:text-4xl ${passed ? "text-emerald-600" : "text-red-600"}`}>{score}%</p>
            <p className="text-xs text-gray-500 sm:text-sm">Nilai Anda</p>
          </div>
          <div className="h-10 w-px bg-gray-300 sm:h-12" />
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-700 sm:text-4xl">
              {correctCount}/{totalQuestions}
            </p>
            <p className="text-xs text-gray-500 sm:text-sm">Jawaban Benar</p>
          </div>
        </div>

        {passed && certificateNumber && (
          <div className="mt-4 rounded-xl bg-white/80 p-3 sm:mt-6 sm:p-4">
            <p className="text-xs text-gray-600 sm:text-sm">Nomor Sertifikat:</p>
            <p className="font-mono text-sm font-bold text-emerald-700 sm:text-lg">{certificateNumber}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 ${
            passed ? "sm:flex-none" : "flex-1"
          }`}
        >
          <RefreshCw className="h-5 w-5" />
          {passed ? "Ulangi Quiz" : "Coba Lagi"}
        </button>
        {passed && onDownloadCertificate && (
          <button
            type="button"
            onClick={onDownloadCertificate}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <Download className="h-5 w-5" />
            Unduh Sertifikat
          </button>
        )}
      </div>

      {/* Answer Review */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Review Jawaban</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {answers.map((answer, idx) => {
            const q = QUIZ_QUESTIONS.find((question) => question.id === answer.questionId);
            if (!q) return null;
            const isCorrect = answer.isCorrect;
            const selectedOption = q.options.find((o) => o.value === answer.selectedAnswer);

            return (
              <div key={q.id} className="p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs sm:h-6 sm:w-6 ${
                      isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 sm:text-sm">
                      {idx + 1}. {q.question}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                      Jawaban Anda:{" "}
                      <span className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                        {selectedOption?.label || "Tidak dijawab"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-xs text-emerald-600 sm:text-sm">
                        Jawaban benar: {q.options.find((o) => o.value === q.correctAnswer)?.label}
                      </p>
                    )}
                    <p className="mt-2 rounded-lg bg-blue-50 p-2 text-[11px] leading-relaxed text-blue-700 sm:text-xs">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
