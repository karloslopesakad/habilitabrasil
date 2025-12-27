"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useTheoreticalClassesAdmin } from "@/hooks/useTheoreticalClasses";
import { useInstructorsAdmin } from "@/hooks/usePracticalClasses";
import { useStepsAdmin } from "@/hooks/useSteps";

export default function NovaAulaTeóricaPage() {
  const router = useRouter();
  const { createClass } = useTheoreticalClassesAdmin();
  const { instructors } = useInstructorsAdmin();
  const { steps } = useStepsAdmin();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    step_id: null as string | null,
    instructor_id: null as string | null,
    scheduled_at: "",
    duration_minutes: 60,
    meeting_link: "",
    max_participants: 50,
    is_recorded: false,
    recording_url: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await createClass(formData);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/aulas-teoricas");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const theoreticalSteps = steps.filter((s) => s.type === "theoretical_class");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/aulas-teoricas"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Nova Aula Teórica</h2>
          <p className="text-neutral-600">Agende uma nova aula para os alunos</p>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Título da Aula *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Ex: Legislação de Trânsito - Módulo 1"
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
              placeholder="Descrição do conteúdo da aula"
            />
          </div>

          {/* Step & Instructor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Etapa Relacionada
              </label>
              <select
                name="step_id"
                value={formData.step_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    step_id: e.target.value || null,
                  })
                }
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Nenhuma</option>
                {theoreticalSteps.map((step) => (
                  <option key={step.id} value={step.id}>
                    {step.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Instrutor
              </label>
              <select
                name="instructor_id"
                value={formData.instructor_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instructor_id: e.target.value || null,
                  })
                }
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Duração (minutos) *
              </label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                required
                min={15}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          {/* Meeting Link & Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Link da Reunião
              </label>
              <input
                type="url"
                name="meeting_link"
                value={formData.meeting_link}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Máximo de Participantes
              </label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                min={1}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          {/* Recording */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_recorded"
                name="is_recorded"
                checked={formData.is_recorded}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-neutral-300 rounded"
              />
              <label htmlFor="is_recorded" className="text-sm text-neutral-700">
                Será gravada
              </label>
            </div>
            <div>
              <input
                type="url"
                name="recording_url"
                value={formData.recording_url}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="URL da gravação (após a aula)"
              />
            </div>
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
              Aula ativa (visível para alunos)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <Link
              href="/admin/aulas-teoricas"
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
                  <span>Agendar Aula</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

