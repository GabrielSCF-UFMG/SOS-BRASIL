import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  Bug,
  Baby,
  UserX,
  AlertTriangle,
  ExternalLink,
  PhoneCall,
  XCircle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { FIRST_AID_GUIDES } from '../data/emergencyData';
import { FirstAidGuide } from '../types';

interface FirstAidSectionProps {
  onOpenChecklist: (serviceNumber?: '190' | '192' | '193') => void;
}

export const FirstAidSection: React.FC<FirstAidSectionProps> = ({ onOpenChecklist }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(FIRST_AID_GUIDES[0].id);

  const activeGuide = FIRST_AID_GUIDES.find((g) => g.id === selectedGuideId) || FIRST_AID_GUIDES[0];

  const getGuideIcon = (id: string) => {
    switch (id) {
      case 'queimaduras':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'hemorragias':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'peconhentos':
        return <Bug className="w-4 h-4 text-emerald-600" />;
      case 'engasgo-bebe':
        return <Baby className="w-4 h-4 text-blue-500" />;
      case 'engasgo-adulto':
        return <UserX className="w-4 h-4 text-amber-500" />;
      case 'vazamento-gas':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertOctagon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <section className="space-y-6" id="first-aid-section">
      {/* Top Banner Notice */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-red-950">
              Regra de Ouro: Acione o Socorro Especializado Primeiro!
            </h3>
            <p className="text-xs sm:text-sm text-red-800 mt-0.5">
              Enquanto a ambulância ou viatura está a caminho, realize os procedimentos abaixo de forma calma e segura. Não tente bancar o médico.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <a
            href="tel:192"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Ligar 192 SAMU
          </a>
          <a
            href="tel:193"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Ligar 193 Bombeiros
          </a>
        </div>
      </div>

      {/* Interactive Tabs Selector */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar" id="first-aid-tabs">
        {FIRST_AID_GUIDES.map((guide) => {
          const isSelected = guide.id === selectedGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              id={`first-aid-tab-${guide.id}`}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {getGuideIcon(guide.id)}
              <span>{guide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Guide Content Detail Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="first-aid-guide-detail">
        {/* Header of Active Guide */}
        <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                Procedimento de Urgência
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                Acionar {activeGuide.emergencyNumber === '192' ? '192 SAMU' : '193 Bombeiros'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {activeGuide.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">{activeGuide.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChecklist(activeGuide.emergencyNumber)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
              <span>Gerar Checklist de Ligação</span>
            </button>

            <a
              href={`tel:${activeGuide.emergencyNumber}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ligar {activeGuide.emergencyNumber}</span>
            </a>
          </div>
        </div>

        {/* Critical Quick Rule Highlight */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 sm:px-6 py-3 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs sm:text-sm font-bold text-amber-950">
            {activeGuide.criticalRule}
          </p>
        </div>

        {/* Two-Column Detail: Steps and Illustration */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Step-by-Step Instructions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Passo a Passo Correto para Leigos:
              </h4>

              <ol className="space-y-3">
                {activeGuide.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* What NOT to do alert box */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 space-y-2.5">
              <h4 className="text-xs sm:text-sm font-black text-rose-900 flex items-center gap-2 uppercase tracking-wide">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                O que NUNCA fazer (Erros comuns perigosos):
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-rose-950">
                {activeGuide.whatNotToDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeGuide.warningNote && (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                ⚠️ <span className="font-semibold text-slate-700">Observação importante:</span> {activeGuide.warningNote}
              </p>
            )}
          </div>

          {/* Right Column: Visual Diagram and Video Search Link */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Ilustração Médica do Procedimento
              </span>

              <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center min-h-[220px]">
                <img
                  src={activeGuide.image}
                  alt={activeGuide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[300px] object-contain p-2"
                  loading="lazy"
                />
              </div>

              <p className="text-xs text-slate-600 text-center italic">
                {activeGuide.imageCaption}
              </p>
            </div>

            {/* Video Support Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700 block">
                  Vídeo de Apoio Prático
                </span>
                <p className="text-xs sm:text-sm font-bold text-blue-950 mt-0.5">
                  {activeGuide.videoQueryTitle}
                </p>
              </div>

              <a
                href={activeGuide.videoSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 shadow-2xs"
              >
                <span>Assistir Busca</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
