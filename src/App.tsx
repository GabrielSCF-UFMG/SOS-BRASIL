/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuickTriageWizard } from './components/QuickTriageWizard';
import { EmergencyNumbersGrid } from './components/EmergencyNumbersGrid';
import { FirstAidSection } from './components/FirstAidSection';
import { FireDepartmentLimitations } from './components/FireDepartmentLimitations';
import { ChecklistSection } from './components/ChecklistSection';
import { AIAssistantChat } from './components/AIAssistantChat';
import { InstallShareModal } from './components/InstallShareModal';
import { EmergencyLogo } from './components/EmergencyLogo';
import { EmergencyNumber } from './types';
import { Download, Share2, Smartphone, Tablet, Laptop } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'triage' | 'numbers' | 'firstaid' | 'checklist' | 'limitations' | 'chat'
  >('triage');

  const [preselectedService, setPreselectedService] = useState<EmergencyNumber>('192');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'install' | 'share'>('install');

  const handleOpenInstall = () => {
    setModalInitialTab('install');
    setIsInstallModalOpen(true);
  };

  const handleOpenShare = () => {
    setModalInitialTab('share');
    setIsInstallModalOpen(true);
  };

  const handleSelectServiceForChecklist = (serviceNumber: EmergencyNumber) => {
    setPreselectedService(serviceNumber);
    setActiveTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFirstAid = () => {
    setActiveTab('firstaid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLimitations = () => {
    setActiveTab('limitations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAI = () => {
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* App Header with Quick Emergency Fast-Dial */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenChecklist={(svc) => {
          if (svc) setPreselectedService(svc);
          setActiveTab('checklist');
        }}
        onOpenInstall={handleOpenInstall}
        onOpenShare={handleOpenShare}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8" id="main-content">
        {/* Multi-Device Installation & Sharing Quick Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <EmergencyLogo size={46} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-red-600 text-white rounded">
                  App PWA Multi-dispositivo
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Celular • Tablet • Computador
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                Baixe o SOS Cidadão no seu aparelho ou compartilhe
              </h2>
              <p className="text-xs text-slate-300">
                Funciona offline e salva o ícone oficial (PM 190, Bombeiros 193 e SAMU 192) na sua tela inicial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={handleOpenInstall}
              id="banner-btn-install"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Baixar / Instalar</span>
            </button>

            <button
              onClick={handleOpenShare}
              id="banner-btn-share"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {activeTab === 'triage' && (
          <div className="space-y-8 animate-fade-in">
            <QuickTriageWizard
              onSelectService={handleSelectServiceForChecklist}
              onOpenFirstAid={handleOpenFirstAid}
              onOpenLimitations={handleOpenLimitations}
              onOpenAI={handleOpenAI}
            />

            {/* Quick Preview of Primary Services */}
            <EmergencyNumbersGrid
              onSelectServiceForChecklist={handleSelectServiceForChecklist}
            />
          </div>
        )}

        {activeTab === 'numbers' && (
          <div className="animate-fade-in">
            <EmergencyNumbersGrid
              onSelectServiceForChecklist={handleSelectServiceForChecklist}
            />
          </div>
        )}

        {activeTab === 'firstaid' && (
          <div className="animate-fade-in">
            <FirstAidSection
              onOpenChecklist={(svc) => {
                if (svc) setPreselectedService(svc);
                setActiveTab('checklist');
              }}
            />
          </div>
        )}

        {activeTab === 'limitations' && (
          <div className="animate-fade-in">
            <FireDepartmentLimitations />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="animate-fade-in">
            <ChecklistSection initialService={preselectedService} />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <AIAssistantChat
              onOpenChecklist={handleSelectServiceForChecklist}
              onOpenFirstAid={handleOpenFirstAid}
            />
          </div>
        )}
      </main>

      {/* Footer & Emergency Disclaimer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <EmergencyLogo size={36} />
              <div>
                <span className="font-black text-slate-900 text-sm block">
                  SOS CIDADÃO - BRASIL
                </span>
                <span className="text-[11px] text-slate-500">
                  Guia Oficial de Apoio à Triagem de Emergência e Primeiros Socorros
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenInstall}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-red-600" />
                <span>Instalar App</span>
              </button>

              <button
                onClick={handleOpenShare}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap text-xs text-slate-600 font-semibold border-t border-slate-100 pt-3">
            <span>190 PM</span>
            <span>•</span>
            <span>192 SAMU</span>
            <span>•</span>
            <span>193 Bombeiros</span>
            <span>•</span>
            <span>197 Polícia Civil</span>
            <span>•</span>
            <span>153 Guarda Municipal</span>
            <span>•</span>
            <span>181 Disque Denúncia</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center sm:text-left text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              ⚠️ Aviso Legal e Operacional:
            </p>
            <p>
              Este aplicativo é uma ferramenta educativa e de apoio à triagem cidadã. Em situações de risco iminente de morte, incêndio ou crime em andamento, disque imediatamente para o serviço de emergência competente pelo seu telefone. Não hesite em ligar.
            </p>
          </div>
        </div>
      </footer>

      {/* Multiplatform Install & Share Modal */}
      <InstallShareModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        defaultTab={modalInitialTab}
      />
    </div>
  );
}

