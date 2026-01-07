"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlanButton from "@/components/ui/PlanButton";
import { usePackages } from "@/hooks/usePackages";
import {
  UserPlus,
  ClipboardList,
  BookOpen,
  FileCheck,
  Car,
  GraduationCap,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const platformSteps = [
  {
    number: 1,
    title: "Cadastre-se na Plataforma",
    description:
      "Crie sua conta gratuita no HabilitaBrasil. O cadastro é simples e rápido, e você terá acesso imediato à plataforma.",
    icon: UserPlus,
    highlight: "Grátis e sem compromisso",
  },
  {
    number: 2,
    title: "Acesse as Etapas do Processo",
    description:
      "Tenha acesso completo a todas as etapas para tirar sua CNH, desde a abertura do processo no DETRAN até a emissão da habilitação definitiva.",
    icon: ClipboardList,
    highlight: "Do início ao fim",
  },
  {
    number: 3,
    title: "Escolha seu Plano de Auxílio",
    description:
      "Selecione o plano que melhor se adapta às suas necessidades. Do plano gratuito com instruções até o acompanhamento completo com instrutores.",
    icon: Sparkles,
    highlight: "Planos flexíveis",
  },
  {
    number: 4,
    title: "Aulas Teóricas Agendadas",
    description:
      "Acesse aulas teóricas focadas especificamente para a prova do DETRAN. Conteúdo objetivo e direto ao ponto para maximizar sua preparação.",
    icon: BookOpen,
    highlight: "Foco na aprovação",
  },
  {
    number: 5,
    title: "Simulados Preparatórios",
    description:
      "Realize simulados que atestam sua preparação para a prova teórica. Questões no formato oficial do DETRAN para você treinar até se sentir pronto.",
    icon: FileCheck,
    highlight: "Avalie seu progresso",
  },
  {
    number: 6,
    title: "Aulas Práticas de Direção",
    description:
      "Agende aulas práticas de direção com instrutores licenciados e credenciados. Aprenda a dirigir com profissionais qualificados.",
    icon: Car,
    highlight: "Instrutores licenciados",
  },
  {
    number: 7,
    title: "Conquiste sua CNH",
    description:
      "Com toda a preparação e acompanhamento, você estará pronto para conquistar sua Carteira Nacional de Habilitação.",
    icon: GraduationCap,
    highlight: "Objetivo alcançado",
  },
];

const officialLinks = [
  {
    name: "DENATRAN",
    description: "Departamento Nacional de Trânsito",
    url: "https://www.gov.br/denatran/pt-br",
  },
  {
    name: "DNIT",
    description: "Departamento Nacional de Infraestrutura de Transportes",
    url: "https://www.gov.br/dnit/pt-br",
  },
  {
    name: "Portal Gov.br",
    description: "Portal de serviços do governo",
    url: "https://www.gov.br",
  },
];

export default function ComoFunciona() {
  const { packages, isLoading } = usePackages();

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-deep text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Como Funciona a Plataforma
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              O HabilitaBrasil te acompanha em todo o processo de habilitação.
              Desde o cadastro até a conquista da sua CNH, com instruções claras
              e suporte de instrutores especializados.
            </p>
          </div>
        </section>

        {/* Platform Steps */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
                Sua jornada até a CNH
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Acompanhe o passo a passo de como a plataforma funciona e como
                vamos te ajudar em cada etapa
              </p>
            </div>

            <div className="space-y-8">
              {platformSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < platformSteps.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary-blue to-primary-blue/20"></div>
                    )}

                    <div className="flex items-start space-x-6">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-neutral-light rounded-xl p-6 border border-neutral-medium/50 hover:shadow-lg hover:border-primary-blue/30 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6 text-primary-blue" />
                            <h3 className="text-xl font-semibold text-primary-deep">
                              {step.title}
                            </h3>
                          </div>
                          <span className="bg-primary-blue/10 text-primary-blue text-xs font-semibold px-3 py-1 rounded-full">
                            {step.highlight}
                          </span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Plans Comparison */}
        <section className="py-16 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
                Nossos Planos de Auxílio
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Temos opções para todos os perfis. Desde quem prefere seguir
                sozinho até quem quer acompanhamento completo com aulas práticas
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 animate-pulse border border-neutral-medium/50"
                  >
                    <div className="h-8 bg-neutral-200 rounded w-2/3 mb-4"></div>
                    <div className="h-12 bg-neutral-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-neutral-200 rounded"></div>
                      <div className="h-4 bg-neutral-200 rounded"></div>
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-xl ${
                      pkg.is_highlighted
                        ? "border-primary-blue shadow-lg lg:scale-105"
                        : "border-neutral-medium/50 hover:border-primary-blue/50"
                    }`}
                  >
                    {pkg.is_highlighted && pkg.highlight_label && (
                      <div className="flex items-center justify-center mb-4">
                        <span className="bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                          {pkg.highlight_label}
                        </span>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-primary-deep mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-4">
                      {pkg.price === 0 ? (
                        <span className="text-3xl font-bold text-success-DEFAULT">
                          Grátis
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-primary-blue">
                            R$ {pkg.price.toFixed(0)}
                          </span>
                          <span className="text-neutral-600 ml-2">/único</span>
                        </>
                      )}
                    </div>
                    <p className="text-neutral-600 mb-6">{pkg.description}</p>

                    <ul className="space-y-3 mb-8">
                      {(pkg.features as string[]).map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-success-DEFAULT flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <PlanButton
                      planName={pkg.name}
                      packageId={pkg.id}
                      className={`block w-full text-center py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                        pkg.is_highlighted
                          ? "bg-primary-blue text-white hover:bg-primary-deep shadow-md hover:shadow-lg"
                          : "bg-neutral-light text-primary-blue hover:bg-primary-blue/10 border border-primary-blue"
                      }`}
                    >
                      Escolher plano
                    </PlanButton>
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-sm text-neutral-500 mt-8">
              *Garantia de aprovação sujeita aos termos e condições. Consulte
              detalhes no momento da contratação.
            </p>
          </div>
        </section>

        {/* Features Detail */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
                O que você encontra na plataforma
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold text-primary-deep mb-3">
                  Aulas Teóricas Focadas
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Aulas agendadas com conteúdo focado especificamente para a
                  prova teórica do DETRAN. Aprenda o essencial para passar.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold text-primary-deep mb-3">
                  Simulados Preparatórios
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Simulados no formato oficial que atestam sua preparação.
                  Saiba exatamente quando você está pronto para a prova.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold text-primary-deep mb-3">
                  Aulas de Direção
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Agendamento de aulas práticas de direção com instrutores
                  licenciados e credenciados pelo DETRAN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Official Links */}
        <section className="py-16 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-primary-deep mb-8 text-center">
              Links Úteis - Órgãos Oficiais
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {officialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-6 border border-neutral-medium/50 hover:shadow-lg hover:border-primary-blue/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-primary-deep group-hover:text-primary-blue transition-colors">
                      {link.name}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-neutral-600 group-hover:text-primary-blue transition-colors" />
                  </div>
                  <p className="text-neutral-600 text-sm">{link.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary-blue to-primary-deep text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Cadastre-se gratuitamente e tenha acesso às instruções completas.
              Ou escolha um plano com acompanhamento de instrutor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center space-x-2 bg-white text-primary-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-all shadow-lg hover:shadow-xl"
              >
                <span>Criar conta grátis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pacotes"
                className="inline-flex items-center justify-center space-x-2 bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white hover:bg-white/10 transition-all"
              >
                <span>Ver todos os planos</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
