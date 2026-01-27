"use client";

import { Step, PracticalClass, Instructor, ProgressStatus, VehicleType } from "@/types/database";
import { Car, Calendar, Clock, MapPin, User, Check, Circle, Plus } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useState } from "react";

interface StepPracticalProps {
  step: Step;
  status: ProgressStatus;
  hasWhatsappSupport: boolean;
  practicalClasses: PracticalClass[];
  instructors: Instructor[];
  hoursUsed: number;
  hoursIncluded: number;
  onScheduleClass?: (data: {
    instructor_id: string;
    scheduled_at: string;
    vehicle_type: VehicleType;
  }) => void;
  onCancelClass?: (classId: string) => void;
}

export default function StepPractical({
  step,
  status,
  hasWhatsappSupport,
  practicalClasses,
  instructors,
  hoursUsed,
  hoursIncluded,
  onScheduleClass,
  onCancelClass,
}: StepPracticalProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    instructor_id: "",
    scheduled_at: "",
    vehicle_type: "manual" as VehicleType,
  });

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

  const hoursRemaining = hoursIncluded - hoursUsed;
  const upcomingClasses = practicalClasses.filter(
    (c) => new Date(c.scheduled_at) > new Date() && c.status === "scheduled"
  );
  const completedClasses = practicalClasses.filter((c) => c.status === "completed");

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScheduleClass) {
      onScheduleClass(scheduleData);
      setShowScheduleForm(false);
      setScheduleData({
        instructor_id: "",
        scheduled_at: "",
        vehicle_type: "manual",
      });
    }
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors[status]} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {statusIcons[status]}
          <div>
            <h3 className="font-semibold text-primary-deep flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>{step.title}</span>
            </h3>
            {step.subtitle && (
              <p className="text-sm text-neutral-600">{step.subtitle}</p>
            )}
          </div>
        </div>

        {hoursIncluded > 0 && (
          <div className="text-right">
            <p className="text-sm text-neutral-600">Horas utilizadas</p>
            <p className="font-bold text-primary-deep">
              {hoursUsed}h / {hoursIncluded}h
            </p>
          </div>
        )}
      </div>

      {step.description && (
        <p className="text-neutral-700 mb-4">{step.description}</p>
      )}

      {step.instructions && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary-deep mb-2">Informações</h4>
          <p className="text-sm text-neutral-600 whitespace-pre-line">
            {step.instructions}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {hoursIncluded > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Horas de aula</span>
            <span>{Math.round((hoursUsed / hoursIncluded) * 100)}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-blue rounded-full transition-all"
              style={{ width: `${(hoursUsed / hoursIncluded) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-primary-deep mb-4">Aulas agendadas</h4>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(cls.scheduled_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{cls.duration_minutes} min</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Car className="w-4 h-4" />
                        <span>{cls.vehicle_type === "manual" ? "Manual" : "Automático"}</span>
                      </span>
                    </div>
                    {cls.instructor && (
                      <p className="text-sm text-neutral-500 mt-2 flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Instrutor: {cls.instructor.name}</span>
                      </p>
                    )}
                    {cls.location && (
                      <p className="text-sm text-neutral-500 mt-1 flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{cls.location}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onCancelClass?.(cls.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-primary-deep mb-4">Aulas concluídas</h4>
          <div className="space-y-2">
            {completedClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-primary-deep">
                      {formatDate(cls.scheduled_at).split(",")[0]}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {cls.duration_minutes} min • {cls.instructor?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Button */}
      {hoursRemaining > 0 && !showScheduleForm && (
        <button
          onClick={() => setShowScheduleForm(true)}
          className="mt-6 w-full inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-4 py-3 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agendar nova aula</span>
        </button>
      )}

      {/* Schedule Form */}
      {showScheduleForm && (
        <form onSubmit={handleSubmitSchedule} className="mt-6 bg-white rounded-lg p-4 border border-neutral-200">
          <h4 className="font-medium text-primary-deep mb-4">Agendar aula prática</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Instrutor
              </label>
              <select
                value={scheduleData.instructor_id}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, instructor_id: e.target.value })
                }
                required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} - {instructor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Data e horário
              </label>
              <input
                type="datetime-local"
                value={scheduleData.scheduled_at}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, scheduled_at: e.target.value })
                }
                required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tipo de veículo
              </label>
              <select
                value={scheduleData.vehicle_type}
                onChange={(e) =>
                  setScheduleData({
                    ...scheduleData,
                    vehicle_type: e.target.value as VehicleType,
                  })
                }
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automático</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
              >
                Confirmar agendamento
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {hoursIncluded > 0 && hoursRemaining <= 0 && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            Você já utilizou todas as horas de aula prática do seu plano.
            {hasWhatsappSupport && " Entre em contato para adquirir mais horas."}
          </p>
        </div>
      )}

      {hasWhatsappSupport && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-2">Precisa de ajuda?</p>
          <WhatsAppButton
            message={step.whatsapp_message || "Olá! Preciso de ajuda com as aulas práticas."}
            variant="outline"
          />
        </div>
      )}
    </div>
  );
}


