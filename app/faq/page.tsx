"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Quais são as novas regras para tirar CNH em 2025?",
    answer:
      "As principais regras para 2025 incluem: (1) Curso teórico de 45 horas/aula obrigatórias, que pode ser feito 100% online desde 2020; (2) Mínimo de 2 aulas práticas obrigatórias de 50 minutos cada, mas recomenda-se mais para maior segurança; (3) Prova teórica com 30 questões de múltipla escolha, sendo necessário acertar pelo menos 21 questões (70%) para aprovação; (4) Processo totalmente digitalizado através do Portal do Cidadão do DETRAN, reduzindo a necessidade de documentos físicos; (5) Exames médicos e psicológicos obrigatórios antes de iniciar as aulas práticas; (6) Prova prática de direção veicular com avaliação de habilidades básicas; (7) CNH provisória (PPD) válida por 1 ano após aprovação na prova prática; (8) CNH definitiva concedida automaticamente após 1 ano sem infrações graves ou gravíssimas. O tempo total do processo varia de 3 a 6 meses dependendo do estado e da disponibilidade de agendamentos.",
  },
  {
    question: "Quais documentos são necessários para iniciar o processo?",
    answer:
      "Com o processo digitalizado de 2025, você precisará de: (1) RG ou CNH (se já tiver) original e cópia digitalizada; (2) CPF; (3) Comprovante de residência atualizado (últimos 3 meses) - aceita-se conta de luz, água, telefone ou internet; (4) Foto 3x4 recente com fundo branco (alguns estados aceitam foto digital); (5) Laudo de exame médico (oftalmológico e clínico geral) realizado em clínica credenciada pelo DETRAN; (6) Laudo de exame psicológico realizado em clínica credenciada. A maioria dos documentos pode ser enviada digitalmente através do Portal do Cidadão do DETRAN. Alguns estados podem exigir documentos adicionais, então sempre consulte o site do DETRAN do seu estado.",
  },
  {
    question: "Quanto custa tirar a CNH?",
    answer:
      "Os custos variam por estado e região, mas em 2025 geralmente incluem: (1) Taxas do DETRAN (R$ 200-500) - incluem primeira habilitação, prova teórica e prova prática; (2) Exames médicos e psicológicos (R$ 150-350) - realizados em clínicas credenciadas; (3) Curso teórico (R$ 300-800) - varia se for presencial ou online; (4) Aulas práticas (R$ 60-120 por aula de 50 minutos) - mínimo de 2 obrigatórias, mas a média é de 5-10 aulas; (5) Taxas de reprovação (se necessário) - R$ 100-200 por nova tentativa. O total costuma ficar entre R$ 1.800 e R$ 3.500 dependendo do estado e quantidade de aulas práticas. Nossos pacotes podem ajudar a economizar e organizar esses custos de forma mais acessível.",
  },
  {
    question: "Posso fazer o curso teórico online?",
    answer:
      "Sim! Desde 2020, é permitido fazer o curso teórico totalmente online através de CFCs (Centros de Formação de Condutores) credenciados. Em 2025, essa modalidade continua válida e é amplamente utilizada. Você precisa: (1) Completar as 45 horas/aula obrigatórias; (2) Assistir às aulas em plataforma credenciada pelo DETRAN; (3) Obter o certificado de conclusão do curso teórico; (4) Agendar a prova teórica no DETRAN. O certificado é válido em todo o território nacional. Nossos pacotes incluem acesso a aulas gravadas, materiais de estudo e simulados ilimitados para facilitar seu aprendizado e aumentar suas chances de aprovação.",
  },
  {
    question: "Quantas aulas práticas são obrigatórias?",
    answer:
      "O mínimo obrigatório por lei são 2 aulas práticas de 50 minutos cada, mas isso é apenas o mínimo legal. Na prática, a maioria dos candidatos faz entre 5 e 10 aulas práticas antes de se sentirem confiantes para a prova. As aulas práticas são essenciais para aprender: direção defensiva, manobras básicas, estacionamento, baliza, e condução em diferentes situações de trânsito. Recomendamos fortemente fazer mais aulas se você não tiver experiência prévia com direção. Nossos pacotes Driver incluem aulas práticas com instrutores qualificados e experientes, aumentando significativamente suas chances de aprovação na primeira tentativa.",
  },
  {
    question: "O que acontece se eu reprovar na prova teórica?",
    answer:
      "Se você reprovar na prova teórica (acertar menos de 21 questões das 30), você pode refazer a prova após um período de 15 dias corridos. Não há limite de tentativas, mas cada nova prova tem uma taxa adicional (geralmente entre R$ 100-200 dependendo do estado). O resultado da prova é divulgado imediatamente após a conclusão. Recomendamos fortemente usar nossos simulados ilimitados e materiais de estudo para se preparar bem antes da primeira tentativa, evitando custos extras e atrasos no processo. Nossos simulados seguem o mesmo formato da prova oficial, com 30 questões e necessidade de 70% de acertos.",
  },
  {
    question: "O que acontece se eu reprovar na prova prática?",
    answer:
      "Se reprovar na prova prática de direção, você pode refazer após um período de 15 dias corridos. Não há limite de tentativas, mas cada nova prova tem uma taxa adicional (geralmente entre R$ 150-250). A prova prática avalia: conhecimento do veículo, manobras básicas, estacionamento, baliza, direção defensiva e respeito às leis de trânsito. Recomendamos fortemente fazer aulas de reforço antes de tentar novamente, focando nas áreas em que você teve dificuldade. Nossos pacotes incluem aulas adicionais e suporte de instrutores experientes para aumentar suas chances de aprovação na primeira tentativa e evitar custos extras.",
  },
  {
    question: "Quanto tempo leva para receber a CNH definitiva?",
    answer:
      "Após ser aprovado na prova prática, você recebe a CNH provisória (PPD - Permissão para Dirigir) que tem validade de 1 ano. A PPD é emitida em até 30 dias após a aprovação. Durante esse período de 1 ano, você NÃO pode cometer: (1) Infrações graves (multa + pontos na CNH); (2) Infrações gravíssimas (multa + pontos na CNH); (3) Acumular mais de 19 pontos na CNH. Se cometer qualquer uma dessas infrações, você terá que refazer todo o processo desde o início. Após 1 ano sem problemas, você recebe a CNH definitiva automaticamente pelo DETRAN, sem necessidade de fazer nova prova ou pagar taxas adicionais. A CNH definitiva tem validade de 10 anos para condutores até 50 anos, 5 anos para condutores entre 50 e 70 anos, e 3 anos para condutores acima de 70 anos.",
  },
  {
    question: "Posso tirar CNH em carro automático?",
    answer:
      "Sim! Você pode fazer as aulas práticas e a prova em carro automático. Nossa CNH será válida apenas para veículos automáticos. Se quiser dirigir carros manuais no futuro, precisará fazer um curso de adaptação. Oferecemos o pacote Driver Auto especialmente para isso.",
  },
  {
    question: "O FastCNH é um órgão oficial?",
    answer:
      "Não, o FastCNH não é um órgão oficial. Somos uma plataforma de apoio e orientação que ajuda pessoas a entenderem e navegarem pelo processo de obtenção da CNH. Para informações oficiais, sempre consulte o DETRAN do seu estado. Nossos serviços são de consultoria e suporte educacional.",
  },
  {
    question: "Como funciona o suporte do FastCNH?",
    answer:
      "Oferecemos diferentes níveis de suporte através de nossos pacotes. Desde orientações básicas gratuitas até consultoria personalizada, aulas preparatórias e suporte completo durante todo o processo. Você pode escolher o pacote que melhor se adequa às suas necessidades.",
  },
  {
    question: "Posso mudar de pacote depois de começar?",
    answer:
      "Sim! Você pode fazer upgrade do seu pacote a qualquer momento. A diferença de valor será calculada proporcionalmente. Entre em contato conosco para mais informações sobre upgrades e mudanças de plano.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-deep text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-white/90">
              Tire suas dúvidas sobre o processo de obtenção da CNH e nossas
              soluções
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-neutral-light rounded-xl border border-neutral-medium/50 overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
                  >
                    <span className="font-semibold text-primary-deep pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-blue flex-shrink-0 transition-transform ${
                        openIndex === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-neutral-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neutral-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Fale com nossos instrutores ou escolha um de nossos planos de auxílio para suporte completo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/assistente"
                className="inline-block bg-primary-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-deep transition-all shadow-md hover:shadow-lg"
              >
                Falar com Assistente
              </a>
              <a
                href="/pacotes"
                className="inline-block bg-white text-primary-blue px-8 py-4 rounded-lg font-semibold text-lg border-2 border-primary-blue hover:bg-primary-blue/5 transition-all"
              >
                Ver Pacotes
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

