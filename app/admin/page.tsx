"use client";

import { Package, ListChecks, Users, Calendar, TrendingUp, Activity } from "lucide-react";
import { usePackagesAdmin } from "@/hooks/usePackages";
import { useStepsAdmin } from "@/hooks/useSteps";
import { useInstructorsAdmin } from "@/hooks/usePracticalClasses";
import { useTheoreticalClassesAdmin } from "@/hooks/useTheoreticalClasses";

export default function AdminDashboard() {
  const { packages, isLoading: packagesLoading } = usePackagesAdmin();
  const { steps, isLoading: stepsLoading } = useStepsAdmin();
  const { instructors, isLoading: instructorsLoading } = useInstructorsAdmin();
  const { classes: theoreticalClasses, isLoading: classesLoading } =
    useTheoreticalClassesAdmin();

  const stats = [
    {
      name: "Pacotes Ativos",
      value: packages.filter((p) => p.is_active).length,
      total: packages.length,
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/pacotes",
    },
    {
      name: "Etapas Cadastradas",
      value: steps.filter((s) => s.is_active).length,
      total: steps.length,
      icon: ListChecks,
      color: "bg-green-500",
      href: "/admin/etapas",
    },
    {
      name: "Instrutores",
      value: instructors.filter((i) => i.is_active).length,
      total: instructors.length,
      icon: Users,
      color: "bg-purple-500",
      href: "/admin/instrutores",
    },
    {
      name: "Aulas Agendadas",
      value: theoreticalClasses.filter((c) => c.is_active).length,
      total: theoreticalClasses.length,
      icon: Calendar,
      color: "bg-orange-500",
      href: "/admin/aulas-teoricas",
    },
  ];

  const isLoading =
    packagesLoading || stepsLoading || instructorsLoading || classesLoading;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-deep rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Painel Admin</h2>
        <p className="text-white/80">
          Gerencie pacotes, etapas, aulas e instrutores da plataforma HabilitaBrasil.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-primary-blue rounded-full animate-spin"></div>
                ) : (
                  <span className="text-xs text-neutral-500">
                    {stat.value} / {stat.total}
                  </span>
                )}
              </div>
              <h3 className="text-sm text-neutral-600 mb-1">{stat.name}</h3>
              <p className="text-2xl font-bold text-primary-deep group-hover:text-primary-blue transition-colors">
                {isLoading ? "..." : stat.value}
              </p>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-primary-blue" />
            <h3 className="font-semibold text-primary-deep">Ações Rápidas</h3>
          </div>
          <div className="space-y-3">
            <a
              href="/admin/pacotes/novo"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <p className="font-medium text-primary-deep">+ Criar novo pacote</p>
              <p className="text-sm text-neutral-500">Adicione um novo plano de serviço</p>
            </a>
            <a
              href="/admin/etapas/nova"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <p className="font-medium text-primary-deep">+ Criar nova etapa</p>
              <p className="text-sm text-neutral-500">Adicione uma nova etapa do processo</p>
            </a>
            <a
              href="/admin/aulas-teoricas/nova"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <p className="font-medium text-primary-deep">+ Agendar aula teórica</p>
              <p className="text-sm text-neutral-500">Crie uma nova aula para os alunos</p>
            </a>
            <a
              href="/admin/instrutores/novo"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <p className="font-medium text-primary-deep">+ Cadastrar instrutor</p>
              <p className="text-sm text-neutral-500">Adicione um novo instrutor à equipe</p>
            </a>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-blue" />
            <h3 className="font-semibold text-primary-deep">Visão Geral</h3>
          </div>
          <div className="space-y-4">
            {/* Packages by Type */}
            <div>
              <p className="text-sm text-neutral-500 mb-2">Pacotes por preço</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Gratuitos</span>
                  <span className="font-semibold text-primary-deep">
                    {packages.filter((p) => p.price === 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Até R$ 200</span>
                  <span className="font-semibold text-primary-deep">
                    {packages.filter((p) => p.price > 0 && p.price <= 200).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Acima de R$ 200</span>
                  <span className="font-semibold text-primary-deep">
                    {packages.filter((p) => p.price > 200).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Steps by Type */}
            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm text-neutral-500 mb-2">Etapas por tipo</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Link/Orientação</span>
                  <span className="font-semibold text-primary-deep">
                    {steps.filter((s) => s.type === "link").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Aula Teórica</span>
                  <span className="font-semibold text-primary-deep">
                    {steps.filter((s) => s.type === "theoretical_class").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Simulado</span>
                  <span className="font-semibold text-primary-deep">
                    {steps.filter((s) => s.type === "simulation").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Aula Prática</span>
                  <span className="font-semibold text-primary-deep">
                    {steps.filter((s) => s.type === "practical").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

