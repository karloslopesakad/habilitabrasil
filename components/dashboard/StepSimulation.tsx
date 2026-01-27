"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step, ProgressStatus } from "@/types/database";
import { FileCheck, Check, Clock, Circle, Award, Trophy, History } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useSimulation } from "@/hooks/useSimulation";
import { useAuth } from "@/hooks/useAuth";

interface StepSimulationProps {
  step: Step;
  status: ProgressStatus;
  hasWhatsappSupport: boolean;
  simulationsUsed: number;
  simulationsIncluded: number;
  onStatusChange?: (stepId: string, status: ProgressStatus) => void;
}

export default function StepSimulation({
  step,
  status,
  hasWhatsappSupport,
  simulationsUsed,
  simulationsIncluded,
  onStatusChange,
}: StepSimulationProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getBestScore, getAttemptHistory } = useSimulation();
  const [bestScore, setBestScore] = useState<{ score: number; percentage: number } | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (user && step.id) {
      getBestScore(user.id, step.id).then(({ data }) => {
        if (data) {
          setBestScore({ score: data.score, percentage: data.percentage });
        }
      });

      getAttemptHistory(user.id, step.id, 5).then(({ data }) => {
        if (data) {
          setRecentAttempts(data);
        }
      });
    }
  }, [user, step.id, getBestScore, getAttemptHistory]);

  const statusIcons = {
    not_started: <Circle className="w-5 h-5 text-neutral-400" />,
    in_progress: <Clock className="w-5 h-5 text-yellow-500" />,
    completed: <Check className="w-5 h-5 text-green-500" />,
  };

  const statusColors = {
    not_started: "bg-neutral-100 border-neutral-200",
    in_progress: "bg-yellow-50 border-yellow-200",
    completed: "bg-green-50 border-green-200",
  };

  const simulationsRemaining = simulationsIncluded === -1 
    ? Infinity 
    : simulationsIncluded - simulationsUsed;

  const canStartSimulation = simulationsIncluded === -1 || simulationsRemaining > 0;

  const handleStartSimulation = () => {
    if (!canStartSimulation) return;
    router.push(`/simulado/${step.id}`);
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors[status]} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {statusIcons[status]}
          <div>
            <h3 className="font-semibold text-primary-deep flex items-center space-x-2">
              <FileCheck className="w-5 h-5" />
              <span>{step.title}</span>
            </h3>
            {step.subtitle && (
              <p className="text-sm text-neutral-600">{step.subtitle}</p>
            )}
          </div>
        </div>

        {(simulationsIncluded > 0 || simulationsIncluded === -1) && (
          <div className="text-right">
            <p className="text-sm text-neutral-600">Simulados realizados</p>
            <p className="font-bold text-primary-deep">
              {simulationsUsed} / {simulationsIncluded === -1 ? "Ilimitados" : simulationsIncluded}
            </p>
          </div>
        )}
      </div>

      {step.description && (
        <p className="text-neutral-700 mb-4">{step.description}</p>
      )}

      {step.instructions && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary-deep mb-2">Como funciona</h4>
          <p className="text-sm text-neutral-600 whitespace-pre-line">
            {step.instructions}
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white/70 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Award className="w-10 h-10 text-primary-blue" />
          </div>
          <div>
            <h4 className="font-medium text-primary-deep">Formato da Prova</h4>
            <p className="text-sm text-neutral-600">
              30 questões • 70% para aprovação (21 acertos) • Tempo: ~60 minutos
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {simulationsIncluded > 0 && simulationsIncluded !== -1 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Progresso</span>
            <span>{Math.round((simulationsUsed / simulationsIncluded) * 100)}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-blue rounded-full transition-all"
              style={{ width: `${(simulationsUsed / simulationsIncluded) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Best Score */}
      {bestScore && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-neutral-600">Melhor nota</p>
              <p className="font-bold text-primary-deep">
                {bestScore.score}/30 ({bestScore.percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attempts */}
      {recentAttempts.length > 0 && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <History className="w-5 h-5 text-primary-blue" />
            <h4 className="font-medium text-primary-deep">Últimas tentativas</h4>
          </div>
          <div className="space-y-2">
            {recentAttempts.slice(0, 3).map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-600">
                  {new Date(attempt.completed_at || attempt.created_at).toLocaleDateString("pt-BR")}
                </span>
                <span
                  className={`font-semibold ${
                    attempt.passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {attempt.score}/30 ({attempt.percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStartSimulation}
          disabled={!canStartSimulation}
          className={`inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors ${
            !canStartSimulation ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Iniciar Simulado</span>
        </button>

        {hasWhatsappSupport && (
          <WhatsAppButton
            message={step.whatsapp_message || "Olá! Preciso de ajuda com os simulados."}
            variant="outline"
          />
        )}
      </div>

      {simulationsIncluded > 0 && simulationsIncluded !== -1 && simulationsRemaining <= 0 && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            Você já utilizou todos os simulados do seu plano.
            {hasWhatsappSupport && " Entre em contato para adquirir mais."}
          </p>
        </div>
      )}
    </div>
  );
}


