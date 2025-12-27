"use client";

import { Calendar, Clock, Car, User, MapPin } from "lucide-react";
import { usePracticalClassesAdmin } from "@/hooks/usePracticalClasses";
import { ClassStatus } from "@/types/database";

const statusConfig: Record<ClassStatus, { label: string; color: string }> = {
  scheduled: { label: "Agendada", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Concluída", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
  no_show: { label: "Não compareceu", color: "bg-yellow-100 text-yellow-800" },
};

export default function AulasPráticasPage() {
  const { classes, isLoading, updateClassStatus } = usePracticalClassesAdmin();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (id: string, status: ClassStatus) => {
    await updateClassStatus(id, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Aulas Práticas</h2>
          <p className="text-neutral-600">Visualize e gerencie as aulas práticas agendadas pelos alunos</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          As aulas práticas são agendadas pelos próprios alunos através do painel. Aqui você pode
          visualizar todas as aulas e atualizar o status de cada uma.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-neutral-600">Carregando aulas...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-600">Nenhuma aula prática agendada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Instrutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {classes.map((cls) => {
                  const status = statusConfig[cls.status];
                  return (
                    <tr key={cls.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-900">{formatDate(cls.scheduled_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cls.instructor ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-700">{cls.instructor.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 text-xs text-neutral-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{cls.duration_minutes}min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Car className="w-3 h-3" />
                            <span>{cls.vehicle_type === "manual" ? "Manual" : "Automático"}</span>
                          </span>
                          {cls.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[100px]">{cls.location}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={cls.status}
                          onChange={(e) =>
                            handleStatusChange(cls.id, e.target.value as ClassStatus)
                          }
                          className="text-sm border border-neutral-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                          <option value="scheduled">Agendada</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                          <option value="no_show">Não compareceu</option>
                        </select>
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

