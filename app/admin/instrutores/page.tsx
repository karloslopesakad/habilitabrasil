"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Phone, Mail, Car } from "lucide-react";
import { useInstructorsAdmin } from "@/hooks/usePracticalClasses";

export default function InstrutoresPage() {
  const { instructors, isLoading, deleteInstructor } = useInstructorsAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este instrutor?")) {
      setDeleting(id);
      await deleteInstructor(id);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Instrutores</h2>
          <p className="text-neutral-600">Gerencie os instrutores da plataforma</p>
        </div>
        <Link
          href="/admin/instrutores/novo"
          className="inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Instrutor</span>
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-neutral-600">Carregando instrutores...</p>
        </div>
      ) : instructors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600 mb-4">Nenhum instrutor cadastrado</p>
          <Link
            href="/admin/instrutores/novo"
            className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-deep"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar primeiro instrutor</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 ${
                !instructor.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-primary-blue font-bold text-lg">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-deep">{instructor.name}</h3>
                    {instructor.specialization && (
                      <p className="text-sm text-neutral-500">{instructor.specialization}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/instrutores/${instructor.id}`}
                    className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(instructor.id)}
                    disabled={deleting === instructor.id}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === instructor.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {instructor.bio && (
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{instructor.bio}</p>
              )}

              <div className="space-y-2 text-sm">
                {instructor.phone && (
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Phone className="w-4 h-4" />
                    <span>{instructor.phone}</span>
                  </div>
                )}
                {instructor.email && (
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Mail className="w-4 h-4" />
                    <span>{instructor.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Car className="w-4 h-4" />
                  <span>
                    {instructor.vehicle_types.map((t) => (t === "manual" ? "Manual" : "Automático")).join(", ")}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-1 rounded-full ${
                    instructor.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {instructor.is_active ? "Ativo" : "Inativo"}
                </span>
                {instructor.whatsapp && (
                  <a
                    href={`https://wa.me/${instructor.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

