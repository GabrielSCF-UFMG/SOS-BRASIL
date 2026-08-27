import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Smartphone,
  Tablet,
  Laptop,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { EmergencyLogo } from './EmergencyLogo';

interface InstallShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'install' | 'share';
}

export const InstallShareModal: React.FC<InstallShareModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'install',
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'share'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    // Detect device environment
    const ua = navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    if (window.innerWidth < 640) {
      setDeviceType('mobile');
    } else if (window.innerWidth < 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }

    // Check if app is already running in standalone mode (PWA installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Capture PWA install prompt for Android/Desktop Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareTitle = 'SOS Cidadão - Guia de Emergência e Primeiros Socorros';
  const shareText =
    'Tenha no seu celular o app SOS Cidadão com números de emergência (190, 192, 193), checklist de ligação e primeiros socorros: ';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share canceled or error:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction
      alert(
        isIOS
          ? 'No iPhone/iPad: toque no botão Compartilhar do Safari (quadrado com seta para cima) e selecione "Adicionar à Tela de Início".'
          : 'No navegador do celular ou PC: clique no menu de 3 pontinhos do navegador e escolha "Instalar aplicativo" ou "Adicionar à tela inicial".'
      );
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${currentUrl}`
  )}`;

  // QR Code URL using public fast SVG QR generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=0f172a&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]"
        id="install-share-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-install-modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with New Logo */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <EmergencyLogo size={56} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                  App Multiplataforma
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  PWA • Offline
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                SOS Cidadão Brasil
              </h3>
              <p className="text-xs text-slate-300">
                Acesse instantaneamente no Celular, Tablet e Computador
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-5 bg-slate-950/60 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('install')}
              id="tab-btn-install"
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'install'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar / Instalar App</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              id="tab-btn-share"
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'share'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {activeTab === 'install' ? (
            <div className="space-y-4">
              {/* Main Install Button */}
              {isInstalled ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Aplicativo Já Instalado!</h4>
                    <p className="text-xs text-emerald-700">
                      Você está usando a versão de aplicativo com o ícone oficial (PM, Bombeiros e SAMU).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handlePWAInstall}
                    id="btn-trigger-pwa-install"
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>INSTALAR NO MEU DISPOSITIVO (1 CLIQUE)</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    O aplicativo será adicionado à tela inicial do seu celular, tablet ou desktop com o novo ícone oficial.
                  </p>
                </div>
              )}

              {/* Step-by-Step guides per platform */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Como instalar em cada aparelho:
                </h4>

                {/* Android Guide */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Android (Google Chrome / Samsung Internet)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    1. Toque nos <strong>3 pontinhos</strong> no canto superior direito.<br />
                    2. Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </p>
                </div>

                {/* iOS / iPhone / iPad Guide */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Tablet className="w-4 h-4 text-blue-600" />
                    <span>iPhone & iPad (Safari)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    1. Toque no botão <strong>Compartilhar</strong> (quadrado com seta para cima na barra inferior).<br />
                    2. Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>

                {/* PC / Desktop Guide */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Laptop className="w-4 h-4 text-purple-600" />
                    <span>Computador / PC / Mac (Chrome, Edge, Brave)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    1. Clique no ícone de <strong>instalar app</strong> (computador com seta para baixo) na barra de endereços do navegador.<br />
                    2. Clique em <strong>Instalar</strong> para fixar na barra de tarefas ou área de trabalho.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Share View */
            <div className="space-y-5">
              {/* Native / WhatsApp Quick Share Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleNativeShare}
                  id="btn-native-share"
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar no Aparelho</span>
                </button>

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-whatsapp-share"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar pelo WhatsApp</span>
                </a>
              </div>

              {/* Direct Link Copy Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Link direto do aplicativo:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-600 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    id="btn-copy-share-link"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code for Fast Mobile Scan */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do App SOS Cidadão"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-900">
                    <QrCode className="w-4 h-4 text-slate-700" />
                    <span>Escanear QR Code com a Câmera</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aponte a câmera do seu celular ou tablet para este código para abrir o aplicativo instantaneamente no outro aparelho.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
