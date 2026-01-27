"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Award, BarChart3, ArrowLeft, RotateCcw } from "lucide-react";
import { SimulationAttempt, SimulationQuestion } from "@/types/database";

interface ResultCardProps {
  attempt: SimulationAttempt;
  questions: SimulationQuestion[];
  stepId: string;
}

export default function ResultCard({ attempt, questions, stepId }: ResultCardProps) {
  const router = useRouter();
  const passed = attempt.passed;
  const percentage = attempt.percentage;

  // Calcular acertos por categoria
  const categoryStats = questions.reduce(
    (acc, question) => {
      const userAnswer = attempt.answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;

      if (!acc[question.category]) {
        acc[question.category] = { total: 0, correct: 0 };
      }
      acc[question.category].total++;
      if (isCorrect) {
        acc[question.category].correct++;
      }
      return acc;
    },
    {} as Record<string, { total: number; correct: number }>
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      legislacao: "Legislação",
      direcao_defensiva: "Direção Defensiva",
      primeiros_socorros: "Primeiros Socorros",
      meio_ambiente: "Meio Ambiente",
      mecanica: "Mecânica",
    };
    return labels[category] || category;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 p-8 shadow-lg">
      {/* Result Header */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600" />
          )}
        </div>
        <h2
          className={`text-3xl font-bold mb-2 ${
            passed ? "text-green-600" : "text-red-600"
          }`}
        >
          {passed ? "Aprovado!" : "Reprovado"}
        </h2>
        <p className="text-neutral-600">
          {passed
            ? "Parabéns! Você atingiu a nota mínima para aprovação."
            : "Não desanime! Continue estudando e tente novamente."}
        </p>
      </div>

      {/* Score */}
      <div className="bg-neutral-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-neutral-600 mb-1">Nota</p>
            <p className="text-3xl font-bold text-primary-deep">
              {attempt.score}/30
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-1">Percentual</p>
            <p className="text-3xl font-bold text-primary-deep">
              {percentage.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-1">Tempo</p>
            <p className="text-3xl font-bold text-primary-deep">
              {formatTime(attempt.time_spent_seconds)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-deep mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Desempenho por Categoria</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const percentage = (stats.correct / stats.total) * 100;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">
                    {getCategoryLabel(category)}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {stats.correct}/{stats.total} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage >= 70 ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
        <Link
          href={`/simulado/${stepId}/gabarito?attempt=${attempt.id}`}
          className="flex-1 inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Award className="w-5 h-5" />
          <span>Ver Gabarito</span>
        </Link>
        <button
          onClick={() => router.push(`/simulado/${stepId}`)}
          className="flex-1 inline-flex items-center justify-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Fazer Novo Simulado</span>
        </button>
        <Link
          href="/dashboard"
          className="flex-1 inline-flex items-center justify-center space-x-2 bg-neutral-100 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

