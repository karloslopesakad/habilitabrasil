"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useStepsAdmin, useStep } from "@/hooks/useSteps";
import { usePackagesAdmin } from "@/hooks/usePackages";
import { StepType } from "@/types/database";

export default function EditarEtapaPage() {
  const router = useRouter();
  const params = useParams();
  const stepId = params.id as string;

  const { step, isLoading: stepLoading } = useStep(stepId);
  const { updateStep } = useStepsAdmin();
  const { packages } = usePackagesAdmin();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "link" as StepType,
    title: "",
    subtitle: "",
    description: "",
    instructions: "",
    external_link: "",
    whatsapp_message: "",
    icon: "",
    display_order: 1,
    is_active: true,
    requires_payment: false,
    min_package_id: null as string | null,
  });

  useEffect(() => {
    if (step) {
      setFormData({
        type: step.type,
        title: step.title,
        subtitle: step.subtitle || "",
        description: step.description || "",
        instructions: step.instructions || "",
        external_link: step.external_link || "",
        whatsapp_message: step.whatsapp_message || "",
        icon: step.icon || "",
        display_order: step.display_order,
        is_active: step.is_active,
        requires_payment: step.requires_payment,
        min_package_id: step.min_package_id,
      });
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await updateStep(stepId, formData);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/etapas");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (stepLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-neutral-600">Carregando etapa...</p>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-neutral-600 mb-4">Etapa não encontrada</p>
        <Link href="/admin/etapas" className="text-primary-blue hover:text-primary-deep">
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/etapas"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Editar Etapa</h2>
          <p className="text-neutral-600">{step.title}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo da Etapa *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="link">Link/Orientação</option>
              <option value="theoretical_class">Aula Teórica</option>
              <option value="simulation">Simulado</option>
              <option value="practical">Aula Prática</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Subtítulo
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Instruções Detalhadas
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={6}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* External Link */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Link Externo
            </label>
            <input
              type="url"
              name="external_link"
              value={formData.external_link}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* WhatsApp Message */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mensagem WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp_message"
              value={formData.whatsapp_message}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ícone
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ordem de Exibição *
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Min Package */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pacote Mínimo Necessário
            </label>
            <select
              name="min_package_id"
              value={formData.min_package_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  min_package_id: e.target.value || null,
                })
              }
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="">Nenhum (disponível para todos)</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - R$ {pkg.price}
                </option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm text-neutral-700">
                Etapa ativa
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requires_payment"
                name="requires_payment"
                checked={formData.requires_payment}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="requires_payment" className="text-sm text-neutral-700">
                Requer pagamento
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <Link
              href="/admin/etapas"
              className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-deep transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

