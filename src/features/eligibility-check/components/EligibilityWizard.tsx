import type { EligibilityAnswers, ProductionScale } from "../types";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ELIGIBILITY_QUESTIONS, PRODUCTION_SCALE_OPTIONS } from "../types";

interface EligibilityWizardProps {
  onSubmit: (answers: EligibilityAnswers) => Promise<void>;
  isSubmitting?: boolean;
}

export function EligibilityWizard({ onSubmit, isSubmitting }: EligibilityWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EligibilityAnswers>({
    hasSlaughteredMeat: false,
    hasHighTechProcess: false,
    hasAnimalDerivatives: false,
    productionScale: "mikro",
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  const totalSteps = ELIGIBILITY_QUESTIONS.length + 1;

  const handleMouseEnter = useCallback(() => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
      setShowTooltip(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handleBooleanAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleScaleAnswer = (value: ProductionScale) => {
    setAnswers((prev) => ({ ...prev, productionScale: value }));
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentQuestion = step < ELIGIBILITY_QUESTIONS.length ? ELIGIBILITY_QUESTIONS[step] : null;
  const isLastStep = step === totalSteps - 1;

  const hasAnyRiskFactor = answers.hasSlaughteredMeat || answers.hasHighTechProcess || answers.hasAnimalDerivatives;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>
            Langkah {step + 1} dari {totalSteps}
          </span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentQuestion ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h2>
                <p className="mt-2 text-sm text-gray-600">{currentQuestion.description}</p>
                <button
                  ref={helpButtonRef}
                  type="button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle className="h-4 w-4" />
                  Mengapa ini penting?
                </button>
                {showTooltip &&
                  createPortal(
                    <div
                      style={{ top: tooltipPos.top, left: tooltipPos.left }}
                      className="fixed z-50 max-w-xs -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
                    >
                      {currentQuestion.helpText}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                    </div>,
                    document.body,
                  )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleBooleanAnswer(currentQuestion.id, true)}
                  className={`flex min-w-32 cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${
                    answers[currentQuestion.id as keyof EligibilityAnswers] === true
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <AlertTriangle
                    className={`h-8 w-8 ${
                      answers[currentQuestion.id as keyof EligibilityAnswers] === true ? "text-amber-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">Ya</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanAnswer(currentQuestion.id, false)}
                  className={`flex min-w-32 cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${
                    answers[currentQuestion.id as keyof EligibilityAnswers] === false
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <CheckCircle
                    className={`h-8 w-8 ${
                      answers[currentQuestion.id as keyof EligibilityAnswers] === false ? "text-emerald-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">Tidak</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Skala Produksi Usaha Anda</h2>
                <p className="mt-2 text-sm text-gray-600">Pilih kategori usaha berdasarkan omzet tahunan</p>
              </div>

              <div className="space-y-3">
                {PRODUCTION_SCALE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleScaleAnswer(option.value)}
                    className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all ${
                      answers.productionScale === option.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>

              {hasAnyRiskFactor && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Perhatian</p>
                      <p className="mt-1 text-sm text-amber-700">
                        Berdasarkan jawaban Anda, usaha ini memerlukan jalur sertifikasi Reguler. Jalur Self-Declare tidak dapat
                        digunakan untuk produk dengan risiko tinggi.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:border-0 sm:py-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Kembali
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {isSubmitting ? (
            "Memproses..."
          ) : isLastStep ? (
            "Lihat Hasil"
          ) : (
            <>
              Lanjut
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
