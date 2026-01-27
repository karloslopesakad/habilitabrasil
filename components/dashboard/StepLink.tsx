"use client";

import { Step, ProgressStatus } from "@/types/database";
import { ExternalLink, Check, Clock, Circle } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

interface StepLinkProps {
  step: Step;
  status: ProgressStatus;
  hasWhatsappSupport: boolean;
  onStatusChange?: (stepId: string, status: ProgressStatus) => void;
}

export default function StepLink({
  step,
  status,
  hasWhatsappSupport,
  onStatusChange,
}: StepLinkProps) {
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

  const handleStartClick = () => {
    if (status === "not_started" && onStatusChange) {
      onStatusChange(step.id, "in_progress");
    }
  };

  const handleCompleteClick = () => {
    if (status === "in_progress" && onStatusChange) {
      onStatusChange(step.id, "completed");
    }
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors[status]} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {statusIcons[status]}
          <div>
            <h3 className="font-semibold text-primary-deep">{step.title}</h3>
            {step.subtitle && (
              <p className="text-sm text-neutral-600">{step.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {step.description && (
        <p className="text-neutral-700 mb-4">{step.description}</p>
      )}

      {step.instructions && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary-deep mb-2">Instruções</h4>
          <p className="text-sm text-neutral-600 whitespace-pre-line">
            {step.instructions}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {step.external_link && (
          <a
            href={step.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Acessar link</span>
          </a>
        )}

        {hasWhatsappSupport && (
          <WhatsAppButton
            message={step.whatsapp_message || undefined}
            variant="outline"
          />
        )}

        {status === "not_started" && (
          <button
            onClick={handleStartClick}
            className="inline-flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Iniciar etapa</span>
          </button>
        )}

        {status === "in_progress" && (
          <button
            onClick={handleCompleteClick}
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Marcar como concluída</span>
          </button>
        )}
      </div>
    </div>
  );
}


