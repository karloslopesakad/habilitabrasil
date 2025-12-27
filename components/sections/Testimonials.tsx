import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    age: 22,
    location: "São Paulo, SP",
    rating: 5,
    text: "Consegui tirar minha CNH sem nenhuma dor de cabeça! O passo a passo foi super claro e o suporte me ajudou muito com a documentação.",
    package: "Pacote B2",
  },
  {
    name: "João Santos",
    age: 35,
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Depois de anos tentando, finalmente consegui! As aulas práticas foram excelentes e o instrutor muito paciente. Recomendo demais!",
    package: "Pacote Driver +10",
  },
  {
    name: "Ana Costa",
    age: 28,
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "O pacote Driver Auto foi perfeito para mim. Aprendi tudo em carro automático e me senti muito mais confiante. Processo super tranquilo!",
    package: "Pacote Driver Auto",
  },
  {
    name: "Carlos Oliveira",
    age: 19,
    location: "Curitiba, PR",
    rating: 5,
    text: "Comecei pelo pacote Free e depois migrei para o Básico. A plataforma é muito intuitiva e as informações sempre atualizadas. Valeu muito a pena!",
    package: "Pacote Básico",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Histórias reais de pessoas que conquistaram sua CNH com nossa ajuda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-neutral-light rounded-xl p-6 border border-neutral-medium/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <Quote className="w-8 h-8 text-primary-blue/30 mb-4" />

              <p className="text-neutral-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-neutral-medium/50 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-deep">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {testimonial.age} anos • {testimonial.location}
                    </p>
                  </div>
                  <span className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-semibold">
                    {testimonial.package}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

