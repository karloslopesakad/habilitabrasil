"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Calendar, Clock, Users, Video } from "lucide-react";
import { useTheoreticalClassesAdmin } from "@/hooks/useTheoreticalClasses";

export default function AulasTeóricasPage() {
  const { classes, isLoading, deleteClass } = useTheoreticalClassesAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
      setDeleting(id);
      await deleteClass(id);
      setDeleting(null);
    }
  };

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

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Aulas Teóricas</h2>
          <p className="text-neutral-600">Gerencie as aulas teóricas agendadas</p>
        </div>
        <Link
          href="/admin/aulas-teoricas/nova"
          className="inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Aula</span>
        </Link>
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
            <p className="text-neutral-600 mb-4">Nenhuma aula cadastrada</p>
            <Link
              href="/admin/aulas-teoricas/nova"
              className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-deep"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar primeira aula</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Aula
                  </th>
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
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {classes.map((cls) => (
                  <tr key={cls.id} className={`hover:bg-neutral-50 ${isPast(cls.scheduled_at) ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-primary-deep">{cls.title}</p>
                        {cls.description && (
                          <p className="text-sm text-neutral-500 truncate max-w-xs">
                            {cls.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(cls.scheduled_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cls.instructor ? (
                        <span className="text-sm text-neutral-700">{cls.instructor.name}</span>
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
                          <Users className="w-3 h-3" />
                          <span>Máx. {cls.max_participants}</span>
                        </span>
                        {cls.meeting_link && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <Video className="w-3 h-3" />
                            <span>Link</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isPast(cls.scheduled_at) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                          Encerrada
                        </span>
                      ) : cls.is_active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                          Inativa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/aulas-teoricas/${cls.id}`}
                          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cls.id)}
                          disabled={deleting === cls.id}
                          className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === cls.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



