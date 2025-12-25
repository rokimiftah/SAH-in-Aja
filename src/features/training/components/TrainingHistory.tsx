import type { TrainingSession } from "../types";

import { Award, Calendar, CheckCircle, XCircle } from "lucide-react";

interface TrainingHistoryProps {
  sessions: TrainingSession[];
}

export function TrainingHistory({ sessions }: TrainingHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
        <Award className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-3 font-medium text-gray-900">Belum Ada Riwayat Pelatihan</h3>
        <p className="mt-1 text-sm text-gray-600">Mulai quiz pelatihan untuk mendapatkan sertifikat kesadaran halal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Riwayat Pelatihan</h3>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session._id} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    session.passed ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  {session.passed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.participantName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(session.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${session.passed ? "text-emerald-600" : "text-red-600"}`}>
                  {session.quizScore}%
                </p>
                <p className={`text-xs ${session.passed ? "text-emerald-600" : "text-red-600"}`}>
                  {session.passed ? "LULUS" : "TIDAK LULUS"}
                </p>
              </div>
            </div>
            {session.certificateNumber && (
              <div className="mt-3 rounded-lg bg-emerald-50 p-2">
                <p className="text-xs text-emerald-600">Sertifikat: {session.certificateNumber}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
