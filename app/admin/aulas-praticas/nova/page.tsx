"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { usePracticalClassesAdmin, useInstructorsAdmin } from "@/hooks/usePracticalClasses";
import { useStepsAdmin } from "@/hooks/useSteps";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Profile, VehicleType, UserRole } from "@/types/database";

export default function NovaAulaPráticaPage() {
  const router = useRouter();
  const { createClass } = usePracticalClassesAdmin();
  const { instructors } = useInstructorsAdmin();
  const { steps } = useStepsAdmin();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [formData, setFormData] = useState({
    user_id: "",
    step_id: null as string | null,
    instructor_id: null as string | null,
    scheduled_at: "",
    duration_minutes: 50,
    vehicle_type: "manual" as VehicleType,
    location: "",
    notes: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      
      if (!isSupabaseConfigured()) {
        setUsers([]);
        setIsLoadingUsers(false);
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        setUsers([]);
        setIsLoadingUsers(false);
        return;
      }

      try {
        // Tentar usar a função RPC primeiro (mais seguro)
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_users_for_admin');
        
        if (!rpcError && rpcData) {
          // Função RPC funcionou
          const usersWithEmail = (rpcData || []).map((user: any) => ({
            id: user.id,
            name: user.name || null,
            phone: user.phone || null,
            role: (user.role || "user") as UserRole,
            avatar_url: user.avatar_url || null,
            state_id: user.state_id || null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          }));
          setUsers(usersWithEmail);
          console.log("Usuários encontrados via RPC:", usersWithEmail.length);
        } else {
          // Fallback: tentar query direta
          console.log("RPC não disponível, tentando query direta...", rpcError);
          const { data, error } = await supabase
            .from("profiles")
            .select("id, name, phone, role, avatar_url, state_id, created_at, updated_at")
            .eq("role", "user")
            .order("name");

          if (error) {
            console.error("Erro ao buscar usuários:", error);
            setError(`Erro ao buscar usuários: ${error.message}`);
            setUsers([]);
          } else {
            const usersProfiles = (data || []).map((user) => ({
              id: user.id,
              name: user.name || null,
              phone: user.phone || null,
              role: (user.role || "user") as UserRole,
              avatar_url: user.avatar_url || null,
              state_id: user.state_id || null,
              created_at: user.created_at || new Date().toISOString(),
              updated_at: user.updated_at || new Date().toISOString(),
            }));
            setUsers(usersProfiles);
            console.log("Usuários encontrados via query direta:", usersProfiles.length);
          }
        }
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err);
        setError(`Erro ao buscar usuários: ${err.message || "Erro desconhecido"}`);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.user_id) {
      setError("Selecione um aluno");
      return;
    }

    if (!formData.instructor_id) {
      setError("Selecione um instrutor");
      return;
    }

    setIsLoading(true);

    const { error } = await createClass({
      user_id: formData.user_id,
      step_id: formData.step_id,
      instructor_id: formData.instructor_id,
      scheduled_at: formData.scheduled_at,
      duration_minutes: formData.duration_minutes,
      vehicle_type: formData.vehicle_type,
      location: formData.location || null,
      notes: formData.notes || null,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/aulas-praticas");
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

  const practicalSteps = steps.filter((s) => s.type === "practical");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/aulas-praticas"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Nova Aula Prática</h2>
          <p className="text-neutral-600">Agende uma nova aula prática para um aluno</p>
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
          {/* Aluno */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Aluno *
            </label>
            {isLoadingUsers ? (
              <div className="w-full border border-neutral-300 rounded-lg px-4 py-2 bg-neutral-50">
                <span className="text-neutral-500">Carregando alunos...</span>
              </div>
            ) : (
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Selecione um aluno</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || `Usuário ${user.id.substring(0, 8)}`}
                  </option>
                ))}
              </select>
            )}
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
                {practicalSteps.map((step) => (
                  <option key={step.id} value={step.id}>
                    {step.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Instrutor *
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
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">Selecione um instrutor</option>
                {instructors
                  .filter((i) => i.is_active)
                  .map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name} - {instructor.specialization}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Date, Duration & Vehicle Type */}
          <div className="grid grid-cols-3 gap-4">
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
                step={5}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de Veículo *
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automático</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Localização
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Ex: Autoescola XYZ - Rua ABC, 123"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Observações sobre a aula (opcional)"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <Link
              href="/admin/aulas-praticas"
              className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading || isLoadingUsers}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-deep transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Agendando...</span>
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

