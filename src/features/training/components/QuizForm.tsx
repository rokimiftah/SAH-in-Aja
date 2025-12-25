import type { QuizAnswer, QuizQuestion } from "../types";

import { useEffect, useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import { getShuffledQuestions } from "../types";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface QuizFormProps {
  participantName: string;
  onComplete: (answers: QuizAnswer[]) => void;
}

export function QuizForm({ participantName, onComplete }: QuizFormProps) {
  const questions = useMemo<QuizQuestion[]>(() => getShuffledQuestions(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

  // Prevent accidental page close/refresh during quiz
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleSelectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const quizAnswers: QuizAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || "",
      isCorrect: answers[q.id] === q.correctAnswer,
    }));

    onComplete(quizAnswers);
  };

  const isAllAnswered = answeredCount === totalQuestions;
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-right">
        <p className="text-sm text-gray-600">
          Peserta: <span className="font-medium">{toTitleCase(participantName)}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-gray-600">{answeredCount} dijawab</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-cyan-500 transition-all"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{currentQuestion.question}</h3>
        <div className="mt-4 space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelectAnswer(option.value)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left transition-all sm:p-4 ${
                selectedAnswer === option.value ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium sm:h-8 sm:w-8 ${
                  selectedAnswer === option.value ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.value.toUpperCase()}
              </span>
              <span className="text-sm text-gray-700 sm:text-base">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Sebelumnya
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
          >
            <CheckCircle className="h-4 w-4" />
            Selesai & Lihat Hasil
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-600 sm:w-auto sm:py-2"
          >
            Selanjutnya
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Question navigator */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Navigasi Soal:</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all ${
                idx === currentIndex
                  ? "bg-cyan-500 text-white"
                  : answers[q.id]
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
