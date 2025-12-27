"use client";

import { Step, ProgressStatus } from "@/types/database";
import { FileCheck, ExternalLink, Check, Clock, Circle, Award } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

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

  const simulationsRemaining = simulationsIncluded - simulationsUsed;

  const handleStartClick = () => {
    if (status === "not_started" && onStatusChange) {
      onStatusChange(step.id, "in_progress");
    }
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

        {simulationsIncluded > 0 && (
          <div className="text-right">
            <p className="text-sm text-neutral-600">Simulados realizados</p>
            <p className="font-bold text-primary-deep">
              {simulationsUsed} / {simulationsIncluded}
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
      {simulationsIncluded > 0 && (
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

      <div className="flex flex-wrap items-center gap-3">
        {step.external_link && (
          <a
            href={step.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors ${
              simulationsIncluded > 0 && simulationsRemaining <= 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={(e) => {
              if (simulationsIncluded > 0 && simulationsRemaining <= 0) {
                e.preventDefault();
              }
            }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Iniciar Simulado</span>
          </a>
        )}

        {status === "not_started" && (
          <button
            onClick={handleStartClick}
            className="inline-flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Começar a praticar</span>
          </button>
        )}

        {hasWhatsappSupport && (
          <WhatsAppButton
            message={step.whatsapp_message || "Olá! Preciso de ajuda com os simulados."}
            variant="outline"
          />
        )}
      </div>

      {simulationsIncluded > 0 && simulationsRemaining <= 0 && (
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

