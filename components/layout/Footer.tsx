import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, AlertCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl">
                FastCNH
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Plataforma de apoio com instrutores especializados para conquistar a CNH no
              Brasil.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.gov.br/dnit/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  DNIT
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.br/denatran/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  DENATRAN
                </a>
              </li>
              <li>
                <Link
                  href="/como-funciona"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/pacotes"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Pacotes
                </Link>
              </li>
              <li>
                <Link
                  href="/assistente"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-2 text-sm text-white/70">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Aviso Legal:</strong> O FastCNH não é um órgão
                oficial. Somos uma plataforma de apoio e orientação. Para
                informações oficiais, consulte o DETRAN do seu estado.
              </p>
            </div>
            <p className="text-sm text-white/70">
              © 2025 FastCNH. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

