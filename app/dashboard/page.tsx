"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  LogOut,
  ExternalLink,
  Info,
  Stethoscope,
  BookOpen,
  GraduationCap,
  Car,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verifica se o usuário está logado (mockado)
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-medium/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-primary-deep mb-2">
                  Olá, {user.name || user.email}!
                </h1>
                <p className="text-neutral-600">
                  Acompanhe seu processo de habilitação
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Etapa Atual
                  </p>
                  <p className="text-2xl font-bold text-primary-deep">
                    Documentação
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-blue" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Progresso
                  </p>
                  <p className="text-2xl font-bold text-primary-deep">25%</p>
                </div>
                <div className="w-12 h-12 bg-success-DEFAULT/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-DEFAULT" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Aulas Realizadas
                  </p>
                  <p className="text-2xl font-bold text-primary-deep">0/2</p>
                </div>
                <div className="w-12 h-12 bg-accent-purple/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-purple" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Próxima Ação
                  </p>
                  <p className="text-sm font-semibold text-primary-deep">
                    Exames médicos
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent-teal" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Process Timeline with Instructions */}
              <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
                <h2 className="text-xl font-semibold text-primary-deep mb-6">
                  Etapas do Processo
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: "Documentação",
                      status: "in-progress",
                      progress: 50,
                      icon: FileText,
                      instructions: [
                        "Reúna os documentos necessários: RG original e cópia, CPF, comprovante de residência atualizado (últimos 3 meses), foto 3x4 recente com fundo branco.",
                        "Certifique-se de que todos os documentos estão legíveis e em dia.",
                        "Faça cópias autenticadas quando necessário.",
                      ],
                      links: [
                        { label: "Lista completa de documentos DETRAN", url: "https://www.gov.br/denatran/pt-br" },
                        { label: "Portal Gov.br - Documentos", url: "https://www.gov.br" },
                      ],
                    },
                    {
                      step: "Exames Médicos",
                      status: "pending",
                      progress: 0,
                      icon: Stethoscope,
                      instructions: [
                        "Agende os exames médicos e psicológicos em clínicas credenciadas pelo DETRAN do seu estado.",
                        "Exame médico: avaliação clínica geral e oftalmológica.",
                        "Exame psicológico: avaliação psicotécnica obrigatória.",
                        "Os laudos têm validade de 90 dias - planeje bem o agendamento.",
                      ],
                      links: [
                        { label: "Buscar clínicas credenciadas", url: "https://www.gov.br/denatran/pt-br" },
                        { label: "Agendar exames online", url: "https://www.gov.br" },
                      ],
                    },
                    {
                      step: "Curso Teórico",
                      status: "pending",
                      progress: 0,
                      icon: BookOpen,
                      instructions: [
                        "Complete o curso teórico de 45 horas/aula (pode ser feito online).",
                        "Aproveite as aulas gravadas e simulados disponíveis na plataforma.",
                        "Estude os conteúdos sobre legislação de trânsito, direção defensiva e primeiros socorros.",
                        "Após concluir, você receberá o certificado para agendar a prova teórica.",
                      ],
                      links: [
                        { label: "Acessar aulas gravadas", url: "/pacotes" },
                        { label: "Fazer simulados", url: "/pacotes" },
                        { label: "Portal DETRAN - Curso teórico", url: "https://www.gov.br/denatran/pt-br" },
                      ],
                    },
                    {
                      step: "Prova Teórica",
                      status: "pending",
                      progress: 0,
                      icon: GraduationCap,
                      instructions: [
                        "Agende a prova teórica no portal do DETRAN do seu estado após concluir o curso.",
                        "A prova tem 30 questões e você precisa acertar pelo menos 21 (70%) para ser aprovado.",
                        "Leve documento de identidade original no dia da prova.",
                        "Se reprovar, pode refazer após 15 dias.",
                      ],
                      links: [
                        { label: "Agendar prova teórica", url: "https://www.gov.br/denatran/pt-br" },
                        { label: "Simulados preparatórios", url: "/pacotes" },
                        { label: "Portal DETRAN", url: "https://www.gov.br/denatran/pt-br" },
                      ],
                    },
                    {
                      step: "Aulas Práticas",
                      status: "pending",
                      progress: 0,
                      icon: Car,
                      instructions: [
                        "Após aprovação na prova teórica, você pode iniciar as aulas práticas.",
                        "Mínimo obrigatório: 2 aulas práticas (conforme nova legislação).",
                        "Recomendamos fazer mais aulas se não se sentir confiante.",
                        "As aulas são realizadas com instrutor qualificado em veículo da autoescola.",
                      ],
                      links: [
                        { label: "Agendar aulas práticas", url: "/pacotes" },
                        { label: "Ver pacotes com aulas", url: "/pacotes" },
                        { label: "Falar com instrutor", url: "/assistente" },
                      ],
                    },
                    {
                      step: "Prova Prática",
                      status: "pending",
                      progress: 0,
                      icon: CheckCircle,
                      instructions: [
                        "Após completar as aulas práticas, agende a prova prática de direção.",
                        "A prova avalia suas habilidades de direção, estacionamento e respeito às leis de trânsito.",
                        "Se aprovado, você receberá a CNH provisória (PPD) válida por 1 ano.",
                        "Após 1 ano sem infrações graves, você recebe a CNH definitiva automaticamente.",
                      ],
                      links: [
                        { label: "Agendar prova prática", url: "https://www.gov.br/denatran/pt-br" },
                        { label: "Dicas para aprovação", url: "/assistente" },
                        { label: "Portal DETRAN", url: "https://www.gov.br/denatran/pt-br" },
                      ],
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="border border-neutral-medium/50 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.status === "completed"
                                ? "bg-success-DEFAULT text-white"
                                : item.status === "in-progress"
                                ? "bg-primary-blue text-white"
                                : "bg-neutral-medium text-neutral-600"
                            }`}
                          >
                            {item.status === "completed" ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-primary-deep text-lg">
                                {index + 1}. {item.step}
                              </h3>
                              {item.status === "in-progress" && (
                                <span className="bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full text-xs font-semibold">
                                  Em andamento
                                </span>
                              )}
                              {item.status === "completed" && (
                                <span className="bg-success-DEFAULT/10 text-success-DEFAULT px-2 py-1 rounded-full text-xs font-semibold">
                                  Concluída
                                </span>
                              )}
                            </div>

                            {item.status === "in-progress" && (
                              <div className="mb-3 w-full bg-neutral-light rounded-full h-2">
                                <div
                                  className="bg-primary-blue h-2 rounded-full transition-all"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            )}

                            {/* Instructions */}
                            <div className="mb-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-primary-blue" />
                                <span className="text-sm font-semibold text-primary-deep">
                                  Instruções:
                                </span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 ml-6">
                                {item.instructions.map((instruction, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-neutral-700 leading-relaxed"
                                  >
                                    {instruction}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Links */}
                            {item.links && item.links.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-neutral-medium/50">
                                <p className="text-xs font-semibold text-neutral-600 mb-2">
                                  Links úteis:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.links.map((link, linkIdx) => (
                                    <a
                                      key={linkIdx}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-1 text-xs bg-primary-blue/10 text-primary-blue px-3 py-1.5 rounded-lg hover:bg-primary-blue/20 transition-colors font-medium"
                                    >
                                      <span>{link.label}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
                <h2 className="text-xl font-semibold text-primary-deep mb-4">
                  Atividades Recentes
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-neutral-light rounded-lg">
                    <div className="w-8 h-8 bg-primary-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-deep">
                        Conta criada com sucesso
                      </p>
                      <p className="text-xs text-neutral-600">
                        Há alguns minutos
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 text-center py-4">
                    Nenhuma outra atividade ainda
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-deep">
                      {user.name || "Usuário"}
                    </p>
                    <p className="text-sm text-neutral-600">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/perfil"
                  className="block w-full text-center bg-neutral-light text-primary-blue py-2 rounded-lg font-medium border border-primary-blue hover:bg-primary-blue/5 transition-all text-sm"
                >
                  Editar Perfil
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
                <h3 className="font-semibold text-primary-deep mb-4">
                  Ações Rápidas
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/pacotes"
                    className="block w-full bg-primary-blue text-white py-2 rounded-lg font-medium hover:bg-primary-deep transition-all text-center text-sm"
                  >
                    Ver Pacotes
                  </Link>
                  <Link
                    href="/como-funciona"
                    className="block w-full bg-neutral-light text-primary-blue py-2 rounded-lg font-medium border border-primary-blue hover:bg-primary-blue/5 transition-all text-center text-sm"
                  >
                    Como Funciona
                  </Link>
                  <Link
                    href="/assistente"
                    className="block w-full bg-neutral-light text-primary-blue py-2 rounded-lg font-medium border border-primary-blue hover:bg-primary-blue/5 transition-all text-center text-sm"
                  >
                    Falar com Instrutor
                  </Link>
                </div>
              </div>

              {/* External Links */}
              <div className="bg-white rounded-xl p-6 border border-neutral-medium/50 shadow-sm">
                <h3 className="font-semibold text-primary-deep mb-4 flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>Links Oficiais Importantes</span>
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.gov.br/denatran/pt-br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-light rounded-lg hover:bg-primary-blue/5 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-blue" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary-deep">
                          DENATRAN
                        </p>
                        <p className="text-xs text-neutral-600">
                          Departamento Nacional
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-blue" />
                  </a>

                  <a
                    href="https://www.gov.br/dnit/pt-br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-light rounded-lg hover:bg-primary-blue/5 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-blue" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary-deep">
                          DNIT
                        </p>
                        <p className="text-xs text-neutral-600">
                          Departamento Nacional de Infraestrutura
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-blue" />
                  </a>

                  <a
                    href="https://www.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-neutral-light rounded-lg hover:bg-primary-blue/5 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-blue" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary-deep">
                          Portal Gov.br
                        </p>
                        <p className="text-xs text-neutral-600">
                          Serviços do governo
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-blue" />
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-medium/50">
                  <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      <strong>Importante:</strong> Sempre consulte o site do
                      DETRAN do seu estado para informações específicas e
                      atualizadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

