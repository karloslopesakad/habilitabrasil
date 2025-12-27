import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Calendar, BookOpen, Car, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Documentação Inicial",
    description:
      "Reúna os documentos necessários: RG, CPF, comprovante de residência, foto 3x4 e exame médico/psicológico.",
    icon: FileText,
    links: [
      { label: "Lista completa de documentos", url: "#" },
      { label: "Clínicas credenciadas", url: "#" },
    ],
  },
  {
    number: 2,
    title: "Cadastro no DETRAN",
    description:
      "Faça seu cadastro no site do DETRAN do seu estado e realize o pagamento das taxas iniciais.",
    icon: Calendar,
    links: [
      { label: "Portal DETRAN", url: "https://www.gov.br/denatran/pt-br" },
      { label: "Taxas e valores", url: "#" },
    ],
  },
  {
    number: 3,
    title: "Curso Teórico",
    description:
      "Complete o curso teórico de 45 horas/aula. Aproveite as aulas gravadas e simulados para se preparar.",
    icon: BookOpen,
    links: [
      { label: "Aulas disponíveis", url: "#" },
      { label: "Simulados", url: "#" },
    ],
  },
  {
    number: 4,
    title: "Prova Teórica",
    description:
      "Realize a prova teórica no DETRAN. Você precisa acertar pelo menos 21 de 30 questões para ser aprovado.",
    icon: CheckCircle,
    links: [
      { label: "Como se preparar", url: "#" },
      { label: "Agendar prova", url: "#" },
    ],
  },
  {
    number: 5,
    title: "Aulas Práticas",
    description:
      "Complete as aulas práticas obrigatórias (mínimo 2) e, se necessário, aulas adicionais para se sentir confiante.",
    icon: Car,
    links: [
      { label: "Agendar aulas", url: "#" },
      { label: "Instrutores disponíveis", url: "#" },
    ],
  },
  {
    number: 6,
    title: "Prova Prática",
    description:
      "Realize a prova prática de direção. Se aprovado, você receberá sua CNH provisória e depois a definitiva.",
    icon: CheckCircle,
    links: [
      { label: "Dicas para aprovação", url: "#" },
      { label: "O que esperar na prova", url: "#" },
    ],
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
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-deep text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Como Funciona
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Entenda passo a passo o processo completo para obter sua CNH no
              Brasil, seguindo as novas regras vigentes em 2025.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-neutral-medium"></div>
                    )}

                    <div className="flex items-start space-x-6">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-neutral-light rounded-xl p-6 border border-neutral-medium/50 hover:shadow-lg transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                          <Icon className="w-6 h-6 text-primary-blue" />
                          <h3 className="text-2xl font-semibold text-primary-deep">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-neutral-700 mb-4 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Links */}
                        <div className="flex flex-wrap gap-2">
                          {step.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              className="inline-flex items-center space-x-1 text-primary-blue hover:text-primary-deep text-sm font-medium"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              Pronto para começar?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Escolha um de nossos pacotes e tenha suporte completo em cada
              etapa do processo.
            </p>
            <Link
              href="/pacotes"
              className="inline-block bg-white text-primary-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-all shadow-lg hover:shadow-xl"
            >
              Ver Pacotes
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

