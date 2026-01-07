"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ListChecks,
  BookOpen,
  Car,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Pacotes",
    href: "/admin/pacotes",
    icon: Package,
  },
  {
    name: "Etapas",
    href: "/admin/etapas",
    icon: ListChecks,
  },
  {
    name: "Aulas Teóricas",
    href: "/admin/aulas-teoricas",
    icon: BookOpen,
  },
  {
    name: "Aulas Práticas",
    href: "/admin/aulas-praticas",
    icon: Car,
  },
  {
    name: "Instrutores",
    href: "/admin/instrutores",
    icon: Users,
  },
  {
    name: "Pagamentos",
    href: "/admin/pagamentos",
    icon: CreditCard,
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut, isLoading, refreshProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Forçar refresh do profile ao montar para garantir que está atualizado
  useEffect(() => {
    if (user && !isLoading) {
      refreshProfile();
    }
  }, [user, isLoading, refreshProfile]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && profile && profile.role !== "admin") {
      console.log('[AdminLayout] Redirecionando - profile role:', profile.role);
      router.push("/dashboard");
    }
  }, [isLoading, user, profile, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || (profile && profile.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-deep transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-deep font-bold text-xl">H</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg">
                  HabilitaBrasil
                </span>
                <span className="block text-xs text-white/60">Painel Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {profile?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {profile?.name || "Admin"}
                </p>
                <p className="text-white/60 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
            >
              <Menu className="w-6 h-6 text-neutral-600" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-lg font-semibold text-primary-deep">
                {menuItems.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm text-primary-blue hover:text-primary-deep font-medium"
            >
              Ver site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

