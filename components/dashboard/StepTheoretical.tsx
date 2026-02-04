"use client";

import { Step, TheoreticalClass, ProgressStatus } from "@/types/database";
import { BookOpen, Calendar, Clock, Users, Video, Check, Circle } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

interface StepTheoreticalProps {
  step: Step;
  status: ProgressStatus;
  hasWhatsappSupport: boolean;
  classes: TheoreticalClass[];
  registeredClassIds: string[];
  classesUsed: number;
  classesIncluded: number;
  onRegisterClass?: (classId: string) => void;
  onCancelRegistration?: (classId: string) => void;
}

export default function StepTheoretical({
  step,
  status,
  hasWhatsappSupport,
  classes,
  registeredClassIds,
  classesUsed,
  classesIncluded,
  onRegisterClass,
  onCancelRegistration,
}: StepTheoreticalProps) {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const classesRemaining = classesIncluded - classesUsed;

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors[status]} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {statusIcons[status]}
          <div>
            <h3 className="font-semibold text-primary-deep flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{step.title}</span>
            </h3>
            {step.subtitle && (
              <p className="text-sm text-neutral-600">{step.subtitle}</p>
            )}
          </div>
        </div>
        
        {classesIncluded > 0 && (
          <div className="text-right">
            <p className="text-sm text-neutral-600">Aulas disponíveis</p>
            <p className="font-bold text-primary-deep">
              {classesRemaining} / {classesIncluded}
            </p>
          </div>
        )}
      </div>

      {step.description && (
        <p className="text-neutral-700 mb-4">{step.description}</p>
      )}

      {step.instructions && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary-deep mb-2">Conteúdo do curso</h4>
          <p className="text-sm text-neutral-600 whitespace-pre-line">
            {step.instructions}
          </p>
        </div>
      )}

      {/* Classes List */}
      {classes.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-primary-deep mb-4">Próximas aulas</h4>
          <div className="space-y-3">
            {classes.map((cls) => {
              const isRegistered = registeredClassIds.includes(cls.id);
              
              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-lg p-4 border ${
                    isRegistered ? "border-green-300 bg-green-50" : "border-neutral-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-primary-deep">{cls.title}</h5>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(cls.scheduled_at)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{cls.duration_minutes} min</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Máx. {cls.max_participants}</span>
                        </span>
                      </div>
                      {cls.instructor && (
                        <p className="text-sm text-neutral-500 mt-1">
                          Instrutor: {cls.instructor.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {isRegistered ? (
                        <>
                          <span className="text-sm text-green-600 font-medium flex items-center space-x-1">
                            <Check className="w-4 h-4" />
                            <span>Inscrito</span>
                          </span>
                          {cls.meeting_link && (
                            <a
                              href={cls.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 bg-primary-blue text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-deep transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              <span>Entrar na aula</span>
                            </a>
                          )}
                          <button
                            onClick={() => onCancelRegistration?.(cls.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Cancelar inscrição
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRegisterClass?.(cls.id)}
                          disabled={classesRemaining <= 0}
                          className="inline-flex items-center space-x-1 bg-primary-blue text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Inscrever-se</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {classes.length === 0 && (
        <div className="bg-white/70 rounded-lg p-6 text-center">
          <p className="text-neutral-600">
            Nenhuma aula agendada no momento.
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Novas aulas serão divulgadas em breve.
          </p>
        </div>
      )}

      {hasWhatsappSupport && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-2">Precisa de ajuda?</p>
          <WhatsAppButton
            message={step.whatsapp_message || "Olá! Preciso de ajuda com as aulas teóricas."}
            variant="outline"
          />
        </div>
      )}
    </div>
  );
}



