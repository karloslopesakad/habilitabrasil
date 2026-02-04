"use client";

import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-medium/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-deep to-primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-display font-bold text-xl text-primary-deep">
              FastCNH
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-neutral-700 hover:text-primary-blue transition-colors font-medium"
            >
              Início
            </Link>
            <Link
              href="/como-funciona"
              className="text-neutral-700 hover:text-primary-blue transition-colors font-medium"
            >
              Como Funciona
            </Link>
            <Link
              href="/pacotes"
              className="text-neutral-700 hover:text-primary-blue transition-colors font-medium"
            >
              Pacotes
            </Link>
            <Link
              href="/faq"
              className="text-neutral-700 hover:text-primary-blue transition-colors font-medium"
            >
              FAQ
            </Link>
            
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-neutral-700 hover:text-primary-blue transition-colors font-medium flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>{profile?.name || "Painel"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-700 hover:text-primary-blue transition-colors font-medium flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-neutral-700 hover:text-primary-blue transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-deep transition-colors shadow-md hover:shadow-lg"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary-deep" />
            ) : (
              <Menu className="w-6 h-6 text-primary-deep" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-neutral-medium/50">
            <Link
              href="/"
              className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/como-funciona"
              className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href="/pacotes"
              className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Pacotes
            </Link>
            <Link
              href="/faq"
              className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Painel
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-neutral-700 hover:text-primary-blue transition-colors font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-neutral-700 hover:text-primary-blue transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block bg-primary-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-deep transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
