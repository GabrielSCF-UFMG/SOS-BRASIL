import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Flame,
  AlertOctagon,
  HelpCircle,
  Download,
  Share2,
} from 'lucide-react';
import { EmergencyLogo } from './EmergencyLogo';

interface HeaderProps {
  activeTab: 'triage' | 'numbers' | 'firstaid' | 'checklist' | 'limitations' | 'chat';
  setActiveTab: (tab: 'triage' | 'numbers' | 'firstaid' | 'checklist' | 'limitations' | 'chat') => void;
  onOpenChecklist: (serviceNumber?: '190' | '192' | '193' | '197' | '153' | '181') => void;
  onOpenInstall: () => void;
  onOpenShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenChecklist,
  onOpenInstall,
  onOpenShare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" id="app-header">
      {/* Top Emergency Fast-Dial Banner */}
      <div className="bg-slate-900 text-white px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
              SOS RÁPIDO
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Disque direto em perigo iminente:
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <a
              href="tel:190"
              id="header-call-190"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white transition-colors shadow-xs"
              title="Ligar para a Polícia Militar (190)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>190 PM</span>
            </a>

            <a
              href="tel:192"
              id="header-call-192"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-xs"
              title="Ligar para o SAMU (192)"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>192 SAMU</span>
            </a>

            <a
              href="tel:193"
              id="header-call-193"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition-colors shadow-xs"
              title="Ligar para o Corpo de Bombeiros (193)"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>193 Bombeiros</span>
            </a>

            {/* Quick Install & Share Toolbar */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700">
              <button
                onClick={onOpenInstall}
                id="header-top-install-btn"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
                title="Instalar aplicativo no Celular, Tablet ou PC"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Baixar App</span>
              </button>

              <button
                onClick={onOpenShare}
                id="header-top-share-btn"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Compartilhar app via WhatsApp, QR Code ou link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Custom Multi-Service Brand Logo (Weapon/Shield + Fire + Heart) */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('triage')}
            title="Ir para o início"
          >
            <EmergencyLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
                  SOS CIDADÃO
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-red-100 text-red-800 rounded">
                  BRASIL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                PM 190 • Bombeiros 193 • SAMU 192 • Polícia Civil 197
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" id="main-nav">
            <button
              onClick={() => setActiveTab('triage')}
              id="nav-tab-triage"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'triage'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Triagem Rápida
            </button>

            <button
              onClick={() => setActiveTab('numbers')}
              id="nav-tab-numbers"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'numbers'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Números (190 a 181)
            </button>

            <button
              onClick={() => setActiveTab('firstaid')}
              id="nav-tab-firstaid"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'firstaid'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Primeiros Socorros
            </button>

            <button
              onClick={() => setActiveTab('limitations')}
              id="nav-tab-limitations"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'limitations'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Limitações dos Bombeiros
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              id="nav-tab-checklist"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'checklist'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Checklist
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              id="nav-tab-chat"
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Assistente IA</span>
            </button>
          </nav>
        </div>

        {/* Mobile Sub-Navigation Scrollable Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 no-scrollbar border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('triage')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              activeTab === 'triage' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Triagem
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              activeTab === 'numbers' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Números 190-181
          </button>
          <button
            onClick={() => setActiveTab('firstaid')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              activeTab === 'firstaid' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Primeiros Socorros
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              activeTab === 'limitations' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            O que Bombeiro NÃO Faz
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              activeTab === 'checklist' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-semibold flex items-center gap-1 ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Assistente IA
          </button>
          <button
            onClick={onOpenInstall}
            className="whitespace-nowrap px-3 py-1.5 rounded-md font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar App
          </button>
          <button
            onClick={onOpenShare}
            className="whitespace-nowrap px-3 py-1.5 rounded-md font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>
        </div>
      </div>
    </header>
  );
};

