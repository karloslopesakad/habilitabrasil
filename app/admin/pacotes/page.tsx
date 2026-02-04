"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Check, X, Copy } from "lucide-react";
import { usePackagesAdmin } from "@/hooks/usePackages";

export default function PacotesPage() {
  const { packages, isLoading, deletePackage, refetch } = usePackagesAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError(null);
    
    const pkg = packages.find((p) => p.id === id);
    const isActive = pkg?.is_active ?? true;
    
    if (isActive) {
      // Se está ativo, fazer soft delete (marcar como inativo)
      if (confirm("Tem certeza que deseja desativar este pacote? Ele será marcado como inativo mas não será removido.")) {
        setDeleting(id);
        const { error } = await deletePackage(id, false);
        setDeleting(null);
        
        if (error) {
          setError(error.message);
          // Se soft delete falhou, oferecer deletar fisicamente
          if (error.message.includes("foreign key") || error.message.includes("referenced")) {
            const forceDelete = confirm(
              "Este pacote está sendo usado por usuários. Deseja deletá-lo permanentemente? Isso também removerá os registros relacionados (user_packages e payments)."
            );
            if (forceDelete) {
              setDeleting(id);
              const { error: forceError } = await deletePackage(id, true);
              setDeleting(null);
              if (forceError) {
                setError(forceError.message);
              } else {
                await refetch();
              }
            }
          }
        } else {
          await refetch();
        }
      }
    } else {
      // Se já está inativo, oferecer deletar fisicamente
      if (confirm("Este pacote já está inativo. Deseja deletá-lo permanentemente? Isso também removerá os registros relacionados (user_packages e payments).")) {
        setDeleting(id);
        const { error } = await deletePackage(id, true);
        setDeleting(null);
        
        if (error) {
          setError(error.message);
        } else {
          await refetch();
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Pacotes</h2>
          <p className="text-neutral-600">Gerencie os planos disponíveis na plataforma</p>
        </div>
        <Link
          href="/admin/pacotes/novo"
          className="inline-flex items-center space-x-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-deep transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Pacote</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Erro ao deletar pacote:</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-neutral-600">Carregando pacotes...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600 mb-4">Nenhum pacote cadastrado</p>
          <Link
            href="/admin/pacotes/novo"
            className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-deep"
          >
            <Plus className="w-4 h-4" />
            <span>Criar primeiro pacote</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
                pkg.is_highlighted ? "border-primary-blue" : "border-neutral-200"
              } ${!pkg.is_active ? "opacity-60" : ""}`}
            >
              {pkg.is_highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{pkg.highlight_label || "Destaque"}</span>
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary-deep">{pkg.name}</h3>
                  <p className="text-sm text-neutral-500">{pkg.slug}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/pacotes/novo?clonar=${pkg.id}`}
                    className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Clonar pacote"
                  >
                    <Copy className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/pacotes/${pkg.id}`}
                    className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Editar pacote"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    disabled={deleting === pkg.id}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Excluir pacote"
                  >
                    {deleting === pkg.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                {pkg.price === 0 ? (
                  <span className="text-3xl font-bold text-success-DEFAULT">Grátis</span>
                ) : (
                  <span className="text-3xl font-bold text-primary-deep">
                    R$ {pkg.price.toFixed(0)}
                  </span>
                )}
              </div>

              <p className="text-neutral-600 text-sm mb-4">{pkg.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                {pkg.practical_hours > 0 && (
                  <p className="text-neutral-600">
                    <span className="font-medium">{pkg.practical_hours}h</span> aulas práticas
                  </p>
                )}
                {pkg.theoretical_classes_included > 0 && (
                  <p className="text-neutral-600">
                    <span className="font-medium">{pkg.theoretical_classes_included}</span> aulas
                    teóricas
                  </p>
                )}
                {pkg.simulations_included > 0 && (
                  <p className="text-neutral-600">
                    <span className="font-medium">{pkg.simulations_included}</span> simulados
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm border-t border-neutral-200 pt-4">
                <span
                  className={`flex items-center space-x-1 ${
                    pkg.has_whatsapp_support ? "text-green-600" : "text-neutral-400"
                  }`}
                >
                  {pkg.has_whatsapp_support ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>WhatsApp</span>
                </span>
                <span
                  className={`flex items-center space-x-1 ${
                    pkg.has_instructor_support ? "text-green-600" : "text-neutral-400"
                  }`}
                >
                  {pkg.has_instructor_support ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>Instrutor</span>
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                <span>Ordem: {pkg.display_order}</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    pkg.is_active ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {pkg.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


