import { CheckCircle, FileText, Users, TrendingUp, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: FileText,
    title: "Passo a Passo Completo",
    description:
      "Orientações detalhadas sobre cada etapa do processo de obtenção da CNH, desde a documentação até a prova prática.",
  },
  {
    icon: TrendingUp,
    title: "Regras Atualizadas 2025",
    description:
      "Conteúdo sempre atualizado com as mais recentes mudanças na legislação de trânsito e requisitos para CNH.",
  },
  {
    icon: Users,
    title: "Suporte Personalizado",
    description:
      "Consultoria especializada para tirar suas dúvidas e auxiliar na resolução de problemas burocráticos.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description:
      "Evite erros comuns e acelere seu processo com orientações precisas e diretas ao ponto.",
  },
  {
    icon: CheckCircle,
    title: "Aulas Preparatórias",
    description:
      "Acesso a aulas gravadas, simulados e aulas práticas com instrutores qualificados.",
  },
  {
    icon: Shield,
    title: "Credibilidade",
    description:
      "Informações confiáveis baseadas em fontes oficiais e experiência comprovada no mercado.",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
            Para que serve o FastCNH?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-6">
            Receba instruções para todo seu processo de habilitação através de instrutores especializados.
          </p>
          <p className="text-lg text-primary-blue font-semibold max-w-2xl mx-auto">
            Está com dificuldades de entender como se habilitar? Nós te ajudamos! Conheça nossos planos de auxílio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-neutral-light rounded-xl p-6 hover:shadow-lg transition-all border border-neutral-medium/50 hover:border-primary-blue/30"
              >
                <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold text-primary-deep mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

