"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Link as LinkIcon,
  BookOpen,
  FileCheck,
  Car,
  Check,
  X,
} from "lucide-react";
import { useStepsAdmin } from "@/hooks/useSteps";
import { StepType } from "@/types/database";

const stepTypeConfig: Record<StepType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  link: { label: "Link/Orientação", icon: LinkIcon, color: "bg-blue-100 text-blue-700" },
  theoretical_class: { label: "Aula Teórica", icon: BookOpen, color: "bg-green-100 text-green-700" },
  simulation: { label: "Simulado", icon: FileCheck, color: "bg-purple-100 text-purple-700" },
  practical: { label: "Aula Prática", icon: Car, color: "bg-orange-100 text-orange-700" },
};

export default function EtapasPage() {
  const { steps, isLoading, deleteStep } = useStepsAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta etapa?")) {
      setDeleting(id);
      await deleteStep(id);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Etapas do Processo</h2>
          <p className="text-neutral-600">Gerencie as etapas que os candidatos devem seguir</p>
        </div>
        <Link
          href="/admin/etapas/nova"
          className="inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Etapa</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-neutral-600">Carregando etapas...</p>
          </div>
        ) : steps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-600 mb-4">Nenhuma etapa cadastrada</p>
            <Link
              href="/admin/etapas/nova"
              className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-deep"
            >
              <Plus className="w-4 h-4" />
              <span>Criar primeira etapa</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Requer Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {steps.map((step) => {
                  const typeConfig = stepTypeConfig[step.type];
                  const Icon = typeConfig.icon;
                  return (
                    <tr key={step.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-blue text-white rounded-full text-sm font-semibold">
                          {step.display_order}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-primary-deep">{step.title}</p>
                          {step.subtitle && (
                            <p className="text-sm text-neutral-500">{step.subtitle}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{typeConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {step.requires_payment ? (
                          <span className="inline-flex items-center space-x-1 text-amber-600">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Sim</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-neutral-400">
                            <X className="w-4 h-4" />
                            <span className="text-sm">Não</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {step.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/etapas/${step.id}`}
                            className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(step.id)}
                            disabled={deleting === step.id}
                            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === step.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

