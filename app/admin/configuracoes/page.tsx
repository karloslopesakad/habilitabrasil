"use client";

import { useState, useEffect } from "react";
import { Save, MessageCircle, Globe } from "lucide-react";
import { useSettingsAdmin } from "@/hooks/useSettings";

export default function ConfiguraçõesPage() {
  const { settings, isLoading, updateSetting } = useSettingsAdmin();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [whatsappData, setWhatsappData] = useState({
    number: "",
    default_message: "",
  });

  const [siteData, setSiteData] = useState({
    name: "",
    tagline: "",
    support_email: "",
  });

  useEffect(() => {
    const whatsapp = settings.find((s) => s.key === "whatsapp_support");
    const site = settings.find((s) => s.key === "site_info");

    if (whatsapp?.value) {
      setWhatsappData(whatsapp.value as typeof whatsappData);
    }
    if (site?.value) {
      setSiteData(site.value as typeof siteData);
    }
  }, [settings]);

  const handleSaveWhatsapp = async () => {
    setIsSaving(true);
    await updateSetting("whatsapp_support", whatsappData);
    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSaveSite = async () => {
    setIsSaving(true);
    await updateSetting("site_info", siteData);
    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-neutral-600">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-primary-deep">Configurações</h2>
        <p className="text-neutral-600">Configure as opções gerais da plataforma</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Configurações salvas com sucesso!
        </div>
      )}

      {/* WhatsApp Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-deep">WhatsApp de Suporte</h3>
            <p className="text-sm text-neutral-500">Configure o número de WhatsApp para suporte</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número do WhatsApp
            </label>
            <input
              type="text"
              value={whatsappData.number}
              onChange={(e) => setWhatsappData({ ...whatsappData, number: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="5511999999999"
            />
            <p className="text-xs text-neutral-500 mt-1">Formato: código do país + DDD + número (sem espaços ou caracteres especiais)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mensagem Padrão
            </label>
            <textarea
              value={whatsappData.default_message}
              onChange={(e) => setWhatsappData({ ...whatsappData, default_message: e.target.value })}
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Olá! Preciso de ajuda..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveWhatsapp}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-deep transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Salvar WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-blue/10 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-deep">Informações do Site</h3>
            <p className="text-sm text-neutral-500">Configurações gerais da plataforma</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={siteData.name}
              onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="HabilitaBrasil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={siteData.tagline}
              onChange={(e) => setSiteData({ ...siteData, tagline: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Seu caminho para a CNH começa aqui"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              E-mail de Suporte
            </label>
            <input
              type="email"
              value={siteData.support_email}
              onChange={(e) => setSiteData({ ...siteData, support_email: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="suporte@habilitabrasil.com"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSite}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-deep transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Salvar Informações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


