import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastCNH - Seu caminho para a CNH começa aqui",
  description: "Entenda as novas regras e conquiste sua habilitação com apoio completo. Receba instruções através de instrutores especializados para obter CNH no Brasil.",
  keywords: "CNH, habilitação, DETRAN, carteira de motorista, Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

