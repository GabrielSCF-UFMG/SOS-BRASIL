import React, { useState } from 'react';
import {
  ShieldAlert,
  HeartPulse,
  Flame,
  FileText,
  Building2,
  EyeOff,
  PhoneCall,
  Copy,
  Check,
  AlertCircle,
  Search,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { EMERGENCY_SERVICES } from '../data/emergencyData';
import { EmergencyNumber, EmergencyService } from '../types';

interface EmergencyNumbersGridProps {
  onSelectServiceForChecklist: (serviceNumber: EmergencyNumber) => void;
  onOpenFirstAidForService?: (category: string) => void;
}

export const EmergencyNumbersGrid: React.FC<EmergencyNumbersGridProps> = ({
  onSelectServiceForChecklist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [expandedNumber, setExpandedNumber] = useState<EmergencyNumber | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'EyeOff':
        return <EyeOff className="w-6 h-6" />;
      default:
        return <PhoneCall className="w-6 h-6" />;
    }
  };

  const getServiceCardStyle = (service: EmergencyService) => {
    switch (service.number) {
      case '190':
        return {
          border: 'border-blue-200 hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
          numberBg: 'bg-blue-600 text-white',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
          accent: 'text-blue-700',
        };
      case '192':
        return {
          border: 'border-red-200 hover:border-red-400',
          badgeBg: 'bg-red-100 text-red-800 border-red-200',
          numberBg: 'bg-red-600 text-white',
          buttonBg: 'bg-red-600 hover:bg-red-700 text-white',
          accent: 'text-red-700',
        };
      case '193':
        return {
          border: 'border-orange-200 hover:border-orange-400',
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
          numberBg: 'bg-orange-600 text-white',
          buttonBg: 'bg-orange-600 hover:bg-orange-700 text-white',
          accent: 'text-orange-700',
        };
      case '197':
        return {
          border: 'border-slate-300 hover:border-slate-400',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
          numberBg: 'bg-slate-700 text-white',
          buttonBg: 'bg-slate-700 hover:bg-slate-800 text-white',
          accent: 'text-slate-700',
        };
      case '153':
        return {
          border: 'border-emerald-200 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          numberBg: 'bg-emerald-600 text-white',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          accent: 'text-emerald-700',
        };
      case '181':
        return {
          border: 'border-purple-200 hover:border-purple-400',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
          numberBg: 'bg-purple-600 text-white',
          buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
          accent: 'text-purple-700',
        };
      default:
        return {
          border: 'border-slate-200',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
          numberBg: 'bg-slate-800 text-white',
          buttonBg: 'bg-slate-800 hover:bg-slate-900 text-white',
          accent: 'text-slate-800',
        };
    }
  };

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredServices = EMERGENCY_SERVICES.filter((svc) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      svc.number.includes(term) ||
      svc.name.toLowerCase().includes(term) ||
      svc.description.toLowerCase().includes(term) ||
      svc.examples.some((ex) => ex.toLowerCase().includes(term)) ||
      svc.badge.toLowerCase().includes(term)
    );
  });

  return (
    <section className="space-y-6" id="emergency-numbers-section">
      {/* Introduction & Search Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
              Guia Completo de Discagem
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Diferenciação dos Serviços de Emergência no Brasil
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Saber o número exato salva minutos cruciais. Entenda quando acionar a Polícia Militar (190), SAMU (192), Bombeiros (193), Polícia Civil (197), Guarda Municipal (153) ou Disque Denúncia (181).
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-emergency-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar (ex: infarto, assalto, B.O., árvore)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Emergency Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="services-grid">
        {filteredServices.map((service) => {
          const style = getServiceCardStyle(service);
          const isExpanded = expandedNumber === service.number;

          return (
            <div
              key={service.number}
              id={`service-card-${service.number}`}
              className={`bg-white rounded-2xl border ${style.border} transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl ${style.numberBg} flex flex-col items-center justify-center font-black shadow-sm shrink-0`}
                    >
                      <span className="text-xl leading-none">{service.number}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">
                        {service.number === '190' ? 'PM' : service.number === '192' ? 'SAMU' : service.number === '193' ? 'BOMBEIROS' : service.number === '197' ? 'CIVIL' : service.number === '153' ? 'GUARDA' : 'DENÚNCIA'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${style.badgeBg}`}>
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{service.tagline}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(service.number)}
                    id={`copy-btn-${service.number}`}
                    title="Copiar número"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  >
                    {copiedNumber === service.number ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-slate-700 text-sm leading-relaxed">{service.description}</p>

                {/* Examples */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    Exemplos de acionamento correto:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {service.examples.slice(0, isExpanded ? service.examples.length : 3).map((ex, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                  {service.examples.length > 3 && (
                    <button
                      onClick={() => setExpandedNumber(isExpanded ? null : service.number)}
                      className="text-xs font-semibold text-slate-800 hover:underline pt-1 block"
                    >
                      {isExpanded ? 'Ver menos' : `+ Ver mais ${service.examples.length - 3} exemplos`}
                    </button>
                  )}
                </div>

                {/* When NOT to call (Crucial distinction) */}
                <div className="flex items-start gap-2 text-xs bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Atenção ao que NÃO compete: </span>
                    <span>{service.whenNotToCall}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="bg-slate-50/80 px-5 sm:px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  onClick={() => onSelectServiceForChecklist(service.number)}
                  id={`prepare-call-btn-${service.number}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 px-3 py-2 rounded-lg transition-colors border border-slate-200"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preparar Roteiro da Ligação</span>
                </button>

                <a
                  href={`tel:${service.number}`}
                  id={`direct-dial-btn-${service.number}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${style.buttonBg} transition-colors shadow-xs hover:shadow`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Discar {service.number}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
