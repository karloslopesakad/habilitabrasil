"use client";

import {
  Step,
  ProgressStatus,
  TheoreticalClass,
  PracticalClass,
  Instructor,
  VehicleType,
} from "@/types/database";
import StepLink from "./StepLink";
import StepTheoretical from "./StepTheoretical";
import StepSimulation from "./StepSimulation";
import StepPractical from "./StepPractical";

interface StepCardProps {
  step: Step;
  status: ProgressStatus;
  hasWhatsappSupport: boolean;
  isPaying: boolean;
  // Dados de aulas teóricas
  theoreticalClasses?: TheoreticalClass[];
  registeredClassIds?: string[];
  classesUsed?: number;
  classesIncluded?: number;
  onRegisterClass?: (classId: string) => void;
  onCancelClassRegistration?: (classId: string) => void;
  // Dados de simulados
  simulationsUsed?: number;
  simulationsIncluded?: number;
  // Dados de aulas práticas
  practicalClasses?: PracticalClass[];
  instructors?: Instructor[];
  hoursUsed?: number;
  hoursIncluded?: number;
  onSchedulePracticalClass?: (data: {
    instructor_id: string;
    scheduled_at: string;
    vehicle_type: VehicleType;
  }) => void;
  onCancelPracticalClass?: (classId: string) => void;
  // Status change
  onStatusChange?: (stepId: string, status: ProgressStatus) => void;
}

export default function StepCard({
  step,
  status,
  hasWhatsappSupport,
  isPaying,
  // Teóricas
  theoreticalClasses = [],
  registeredClassIds = [],
  classesUsed = 0,
  classesIncluded = 0,
  onRegisterClass,
  onCancelClassRegistration,
  // Simulados
  simulationsUsed = 0,
  simulationsIncluded = 0,
  // Práticas
  practicalClasses = [],
  instructors = [],
  hoursUsed = 0,
  hoursIncluded = 0,
  onSchedulePracticalClass,
  onCancelPracticalClass,
  // Status
  onStatusChange,
}: StepCardProps) {
  // Verificar se a etapa requer pagamento e o usuário não é pagante
  if (step.requires_payment && !isPaying) {
    return (
      <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500">🔒</span>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-500">{step.title}</h3>
            <p className="text-sm text-neutral-400">{step.subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-neutral-500 mt-3">
          Esta etapa está disponível apenas para planos pagos. Faça upgrade para ter acesso.
        </p>
      </div>
    );
  }

  switch (step.type) {
    case "link":
      return (
        <StepLink
          step={step}
          status={status}
          hasWhatsappSupport={hasWhatsappSupport}
          onStatusChange={onStatusChange}
        />
      );

    case "theoretical_class":
      return (
        <StepTheoretical
          step={step}
          status={status}
          hasWhatsappSupport={hasWhatsappSupport}
          classes={theoreticalClasses}
          registeredClassIds={registeredClassIds}
          classesUsed={classesUsed}
          classesIncluded={classesIncluded}
          onRegisterClass={onRegisterClass}
          onCancelRegistration={onCancelClassRegistration}
        />
      );

    case "simulation":
      return (
        <StepSimulation
          step={step}
          status={status}
          hasWhatsappSupport={hasWhatsappSupport}
          simulationsUsed={simulationsUsed}
          simulationsIncluded={simulationsIncluded}
          onStatusChange={onStatusChange}
        />
      );

    case "practical":
      return (
        <StepPractical
          step={step}
          status={status}
          hasWhatsappSupport={hasWhatsappSupport}
          practicalClasses={practicalClasses}
          instructors={instructors}
          hoursUsed={hoursUsed}
          hoursIncluded={hoursIncluded}
          onScheduleClass={onSchedulePracticalClass}
          onCancelClass={onCancelPracticalClass}
        />
      );

    default:
      return (
        <StepLink
          step={step}
          status={status}
          hasWhatsappSupport={hasWhatsappSupport}
          onStatusChange={onStatusChange}
        />
      );
  }
}


