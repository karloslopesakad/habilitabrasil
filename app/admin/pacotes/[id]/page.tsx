"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { usePackagesAdmin, usePackage } from "@/hooks/usePackages";

export default function EditarPacotePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const { package: pkg, isLoading: packageLoading } = usePackage(packageId);
  const { updatePackage } = usePackagesAdmin();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    description: "",
    features: [""] as string[],
    practical_hours: 0,
    theoretical_classes_included: 0,
    simulations_included: 0,
    has_whatsapp_support: false,
    has_instructor_support: false,
    is_highlighted: false,
    highlight_label: "",
    display_order: 1,
    is_active: true,
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        slug: pkg.slug,
        price: pkg.price,
        description: pkg.description || "",
        features: (pkg.features as string[]).length > 0 ? (pkg.features as string[]) : [""],
        practical_hours: pkg.practical_hours,
        theoretical_classes_included: pkg.theoretical_classes_included,
        simulations_included: pkg.simulations_included,
        has_whatsapp_support: pkg.has_whatsapp_support,
        has_instructor_support: pkg.has_instructor_support,
        is_highlighted: pkg.is_highlighted,
        highlight_label: pkg.highlight_label || "",
        display_order: pkg.display_order,
        is_active: pkg.is_active,
      });
    }
  }, [pkg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const features = formData.features.filter((f) => f.trim() !== "");

    const { error } = await updatePackage(packageId, {
      ...formData,
      features,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/pacotes");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...formData.features];
    features[index] = value;
    setFormData({ ...formData, features });
  };

  if (packageLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-neutral-600">Carregando pacote...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-neutral-600 mb-4">Pacote não encontrado</p>
        <Link href="/admin/pacotes" className="text-primary-blue hover:text-primary-deep">
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
          href="/admin/pacotes"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Editar Pacote</h2>
          <p className="text-neutral-600">{pkg.name}</p>
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
          {/* Name & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          {/* Price & Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
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
              rows={2}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Recursos incluídos
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center space-x-1 text-primary-blue hover:text-primary-deep text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar recurso</span>
              </button>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Horas práticas
              </label>
              <input
                type="number"
                name="practical_hours"
                value={formData.practical_hours}
                onChange={handleChange}
                min={0}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Aulas teóricas
              </label>
              <input
                type="number"
                name="theoretical_classes_included"
                value={formData.theoretical_classes_included}
                onChange={handleChange}
                min={0}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Simulados
              </label>
              <input
                type="number"
                name="simulations_included"
                value={formData.simulations_included}
                onChange={handleChange}
                min={0}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          {/* Highlight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_highlighted"
                name="is_highlighted"
                checked={formData.is_highlighted}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="is_highlighted" className="text-sm text-neutral-700">
                Destacar pacote
              </label>
            </div>
            <div>
              <input
                type="text"
                name="highlight_label"
                value={formData.highlight_label}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="Label do destaque"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="has_whatsapp_support"
                name="has_whatsapp_support"
                checked={formData.has_whatsapp_support}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="has_whatsapp_support" className="text-sm text-neutral-700">
                Suporte WhatsApp
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="has_instructor_support"
                name="has_instructor_support"
                checked={formData.has_instructor_support}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="has_instructor_support" className="text-sm text-neutral-700">
                Suporte instrutor
              </label>
            </div>
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
                Pacote ativo
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <Link
              href="/admin/pacotes"
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

