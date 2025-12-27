"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "primary" | "outline" | "small";
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  message,
  className = "",
  variant = "primary",
  children,
}: WhatsAppButtonProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const defaultMessage =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Olá! Preciso de ajuda com meu processo de habilitação.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message || defaultMessage
  )}`;

  const baseStyles =
    "inline-flex items-center justify-center space-x-2 font-semibold transition-all";

  const variants = {
    primary:
      "bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50",
    small:
      "bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600",
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      {children ? children : <span>Falar no WhatsApp</span>}
    </a>
  );
}

