"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { usePackagesAdmin } from "@/hooks/usePackages";

export default function NovoPacotePage() {
  const router = useRouter();
  const { createPackage } = usePackagesAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    description: "",
    features: [""],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Filtrar features vazias
    const features = formData.features.filter((f) => f.trim() !== "");

    const { error } = await createPackage({
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
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
          <h2 className="text-2xl font-bold text-primary-deep">Novo Pacote</h2>
          <p className="text-neutral-600">Adicione um novo plano à plataforma</p>
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
                onChange={handleNameChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="Ex: Driver +10"
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
                placeholder="driver-plus-10"
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
              placeholder="Descrição curta do pacote"
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
                    placeholder="Ex: Suporte via WhatsApp"
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
                placeholder="Label do destaque (ex: Mais Popular)"
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
                  <span>Salvar Pacote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

