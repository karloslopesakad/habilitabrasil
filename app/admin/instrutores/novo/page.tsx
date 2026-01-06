"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useInstructorsAdmin } from "@/hooks/usePracticalClasses";
import { VehicleType } from "@/types/database";

export default function NovoInstrutorPage() {
  const router = useRouter();
  const { createInstructor } = useInstructorsAdmin();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_id: null as string | null,
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    specialization: "",
    vehicle_types: ["manual"] as VehicleType[],
    bio: "",
    avatar_url: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await createInstructor(formData);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/instrutores");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleVehicleTypeChange = (type: VehicleType) => {
    if (formData.vehicle_types.includes(type)) {
      setFormData({
        ...formData,
        vehicle_types: formData.vehicle_types.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        vehicle_types: [...formData.vehicle_types, type],
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/instrutores"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Novo Instrutor</h2>
          <p className="text-neutral-600">Cadastre um novo instrutor na equipe</p>
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Nome do instrutor"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="5511999999999"
              />
              <p className="text-xs text-neutral-500 mt-1">Formato: código do país + DDD + número</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="instrutor@email.com"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Especialização
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Ex: Aulas práticas - Manual e Automático"
            />
          </div>

          {/* Vehicle Types */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipos de Veículo
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vehicle_types.includes("manual")}
                  onChange={() => handleVehicleTypeChange("manual")}
                  className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">Manual</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vehicle_types.includes("automatic")}
                  onChange={() => handleVehicleTypeChange("automatic")}
                  className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">Automático</span>
              </label>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Biografia
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Descrição sobre o instrutor, experiência, qualificações..."
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              URL da Foto
            </label>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="https://..."
            />
          </div>

          {/* Active */}
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
              Instrutor ativo
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <Link
              href="/admin/instrutores"
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
                  <span>Cadastrar Instrutor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

