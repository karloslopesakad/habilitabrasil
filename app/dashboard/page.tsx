"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StepCard from "@/components/dashboard/StepCard";
import {
  User,
  Package,
  Trophy,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSteps, useUserProgress } from "@/hooks/useSteps";
import { useTheoreticalClasses, useUserClassRegistrations } from "@/hooks/useTheoreticalClasses";
import { useUserPracticalClasses, useInstructors } from "@/hooks/usePracticalClasses";
import { ProgressStatus, VehicleType } from "@/types/database";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plano");

  const {
    user,
    profile,
    userPackage,
    allUserPackages,
    isLoading: authLoading,
    isPaying,
    hasWhatsappSupport,
    practicalHoursRemaining,
    theoreticalClassesRemaining,
    simulationsRemaining,
    totalPracticalHours,
    totalPracticalHoursUsed,
  } = useAuth();

  const { steps, isLoading: stepsLoading } = useSteps();
  const {
    progress,
    updateProgress,
    getStepStatus,
    isLoading: progressLoading,
  } = useUserProgress(user?.id);

  const { classes: theoreticalClasses, isLoading: classesLoading } =
    useTheoreticalClasses();
  const {
    registrations,
    registerForClass,
    cancelRegistration,
    isRegisteredForClass,
    isLoading: registrationsLoading,
  } = useUserClassRegistrations(user?.id);

  const {
    classes: practicalClasses,
    scheduleClass,
    cancelClass,
    isLoading: practicalLoading,
  } = useUserPracticalClasses(user?.id);
  const { instructors, isLoading: instructorsLoading } = useInstructors();

  const isLoading =
    authLoading ||
    stepsLoading ||
    progressLoading ||
    classesLoading ||
    registrationsLoading ||
    practicalLoading ||
    instructorsLoading;

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Cálculos de progresso
  const completedSteps = progress.filter((p) => p.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const handleStatusChange = async (stepId: string, status: ProgressStatus) => {
    await updateProgress(stepId, status);
  };

  const handleRegisterClass = async (classId: string) => {
    await registerForClass(classId);
  };

  const handleCancelClassRegistration = async (classId: string) => {
    const registration = registrations.find((r) => r.theoretical_class_id === classId);
    if (registration) {
      await cancelRegistration(registration.id);
    }
  };

  const handleSchedulePracticalClass = async (data: {
    instructor_id: string;
    scheduled_at: string;
    vehicle_type: VehicleType;
  }) => {
    await scheduleClass(data);
  };

  const handleCancelPracticalClass = async (classId: string) => {
    await cancelClass(classId);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando seu painel...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plan Selection Notice */}
          {planParam && !userPackage && (
            <div className="mb-6 bg-primary-blue/10 border border-primary-blue/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-deep">
                  Você selecionou o plano: {planParam}
                </p>
                <p className="text-sm text-neutral-600">
                  Entre em contato para finalizar a contratação
                </p>
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Olá! Gostaria de contratar o plano ${planParam}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Contratar via WhatsApp
              </a>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-2">
              Olá, {profile?.name || "Candidato"}! 👋
            </h1>
            <p className="text-neutral-600">
              Acompanhe seu progresso e continue sua jornada para a CNH
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-medium/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-primary-deep">
                    Progresso Geral
                  </h2>
                  <span className="text-2xl font-bold text-primary-blue">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="h-4 bg-neutral-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-primary-blue to-primary-deep rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-neutral-100 rounded-lg">
                    <p className="text-2xl font-bold text-primary-deep">
                      {completedSteps}
                    </p>
                    <p className="text-xs text-neutral-600">Concluídas</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {progress.filter((p) => p.status === "in_progress").length}
                    </p>
                    <p className="text-xs text-neutral-600">Em andamento</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-500">
                      {totalSteps - completedSteps - progress.filter((p) => p.status === "in_progress").length}
                    </p>
                    <p className="text-xs text-neutral-600">Pendentes</p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold text-primary-deep">
                  Etapas do Processo
                </h2>

                {steps.map((step) => {
                  const registeredIds = registrations
                    .filter((r) => r.theoretical_class_id)
                    .map((r) => r.theoretical_class_id);

                  return (
                    <StepCard
                      key={step.id}
                      step={step}
                      status={getStepStatus(step.id)}
                      hasWhatsappSupport={hasWhatsappSupport}
                      isPaying={isPaying}
                      // Teóricas
                      theoreticalClasses={theoreticalClasses.filter(
                        (c) => c.step_id === step.id || step.type === "theoretical_class"
                      )}
                      registeredClassIds={registeredIds}
                      classesUsed={userPackage?.theoretical_classes_used || 0}
                      classesIncluded={userPackage?.package?.theoretical_classes_included || 0}
                      onRegisterClass={handleRegisterClass}
                      onCancelClassRegistration={handleCancelClassRegistration}
                      // Simulados
                      simulationsUsed={userPackage?.simulations_used || 0}
                      simulationsIncluded={userPackage?.package?.simulations_included || 0}
                      // Práticas
                      practicalClasses={practicalClasses.filter(
                        (c) => c.step_id === step.id || step.type === "practical"
                      )}
                      instructors={instructors}
                      hoursUsed={userPackage?.practical_hours_used || 0}
                      hoursIncluded={userPackage?.package?.practical_hours || 0}
                      onSchedulePracticalClass={handleSchedulePracticalClass}
                      onCancelPracticalClass={handleCancelPracticalClass}
                      // Status
                      onStatusChange={handleStatusChange}
                    />
                  );
                })}

                {steps.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center border border-neutral-200">
                    <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">Nenhuma etapa disponível no momento.</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      As etapas serão carregadas em breve.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-medium/50 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-deep rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-deep">
                      {profile?.name || "Usuário"}
                    </h3>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                </div>

                {/* Package Info */}
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="w-5 h-5 text-primary-blue" />
                    <span className="font-medium text-primary-deep">Seu Plano</span>
                  </div>
                  {userPackage ? (
                    <div className="bg-primary-blue/10 rounded-lg p-3">
                      <p className="font-bold text-primary-deep">
                        {userPackage.package?.name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {userPackage.package?.description}
                      </p>

                      {/* Horas práticas cumulativas */}
                      {totalPracticalHours > 0 && (
                        <div className="mt-3 bg-white rounded-lg p-3 border border-primary-blue/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-primary-deep">Aulas Práticas</span>
                            <span className="text-sm font-bold text-primary-blue">
                              {practicalHoursRemaining}h disponíveis
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-1">
                            <div
                              className="bg-primary-blue h-2.5 rounded-full transition-all"
                              style={{ width: `${Math.min(100, (totalPracticalHoursUsed / totalPracticalHours) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-neutral-500">
                            {totalPracticalHoursUsed}h usadas de {totalPracticalHours}h totais
                            {allUserPackages && allUserPackages.length > 1 && (
                              <span className="text-primary-blue"> ({allUserPackages.filter(p => (p.package?.practical_hours ?? 0) > 0).length} pacotes acumulados)</span>
                            )}
                          </p>
                        </div>
                      )}

                      <div className="mt-2 text-xs text-neutral-500 space-y-1">
                        {theoreticalClassesRemaining > 0 && (
                          <p>
                            Aulas teóricas disponíveis: <strong>{theoreticalClassesRemaining}</strong>
                          </p>
                        )}
                        {simulationsRemaining > 0 && (
                          <p>
                            Simulados disponíveis: <strong>{simulationsRemaining === Infinity ? "Ilimitados" : simulationsRemaining}</strong>
                          </p>
                        )}
                        {userPackage.expires_at && (
                          <p className="text-neutral-400">
                            Expira em: {new Date(userPackage.expires_at).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-neutral-500 text-sm mb-3">
                        Você está no plano gratuito
                      </p>
                      <a
                        href="/pacotes"
                        className="inline-flex items-center space-x-1 text-primary-blue hover:text-primary-deep font-medium text-sm"
                      >
                        <span>Ver planos disponíveis</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-medium/50 p-6">
                <h3 className="font-semibold text-primary-deep mb-4 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Conquistas</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Etapas concluídas</span>
                    <span className="font-bold text-primary-deep">{completedSteps}</span>
                  </div>
                  {practicalClasses.filter((c) => c.status === "completed").length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Aulas práticas</span>
                      <span className="font-bold text-primary-deep">
                        {practicalClasses.filter((c) => c.status === "completed").length}
                      </span>
                    </div>
                  )}
                  {registrations.filter((r) => r.attended).length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Aulas teóricas</span>
                      <span className="font-bold text-primary-deep">
                        {registrations.filter((r) => r.attended).length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-medium/50 p-6">
                <h3 className="font-semibold text-primary-deep mb-4">
                  Links Externos Importantes
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.gov.br/denatran/pt-br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-sm text-neutral-700">DENATRAN</span>
                    <ExternalLink className="w-4 h-4 text-primary-blue" />
                  </a>
                  <a
                    href="https://www.gov.br/pt-br/servicos/obter-carteira-nacional-de-habilitacao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-sm text-neutral-700">Portal Gov.br - CNH</span>
                    <ExternalLink className="w-4 h-4 text-primary-blue" />
                  </a>
                  <a
                    href="https://www.detran.sp.gov.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-sm text-neutral-700">DETRAN SP</span>
                    <ExternalLink className="w-4 h-4 text-primary-blue" />
                  </a>
                </div>
              </div>

              {/* Support */}
              {hasWhatsappSupport && (
                <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                  <h3 className="font-semibold text-green-800 mb-2">Suporte Premium</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Você tem acesso ao suporte via WhatsApp. Estamos aqui para ajudar!
                  </p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Olá! Preciso de ajuda com meu processo de habilitação."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full justify-center"
                  >
                    <span>Falar com Suporte</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-light">
          <Navbar />
          <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Carregando...</p>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
