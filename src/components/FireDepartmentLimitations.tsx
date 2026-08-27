import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, TreePine, Bug, PhoneCall } from 'lucide-react';
import { FIRE_DEPARTMENT_LIMITATIONS } from '../data/emergencyData';

export const FireDepartmentLimitations: React.FC = () => {
  return (
    <section className="space-y-6" id="limitations-section">
      {/* Banner Explanatory */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-md border border-orange-200">
              Conscientização Pública
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-orange-950">
              Limitações de Atendimento: O que os Bombeiros NÃO Fazem
            </h2>
            <p className="text-xs sm:text-sm text-orange-900 leading-relaxed max-w-3xl">
              O acionamento indevido do 193 ocupa linhas e viaturas que poderiam estar salvando vidas em incêndios e acidentes com vítimas presas em ferragens. Conheça as diferenças visuais entre uma emergência real e situações de competência da Prefeitura ou de manejo natural.
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Cards */}
      <div className="space-y-8">
        {FIRE_DEPARTMENT_LIMITATIONS.map((limitation) => (
          <div
            key={limitation.id}
            id={`limitation-card-${limitation.id}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Case Header */}
            <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                {limitation.id === 'arvores' ? (
                  <TreePine className="w-5 h-5" />
                ) : (
                  <Bug className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {limitation.title}
                </h3>
                <p className="text-xs text-slate-600">{limitation.description}</p>
              </div>
            </div>

            {/* Alternative instruction prompt */}
            <div className="bg-blue-50/70 border-b border-blue-100 px-5 sm:px-6 py-2.5 text-xs text-blue-900 font-medium">
              💡 <span className="font-bold">O que fazer no caso comum:</span> {limitation.correctAlternative}
            </div>

            {/* Side by Side Comparative Visuals */}
            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* OPERATES CASE (EMERGENCY) */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border-2 border-emerald-300 flex flex-col justify-between space-y-4 shadow-2xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {limitation.operatesCase.badgeText}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-emerald-950">
                    {limitation.operatesCase.title}
                  </h4>

                  {/* Real Image */}
                  <div className="rounded-xl overflow-hidden bg-slate-900 border border-emerald-200 aspect-video relative shadow-xs">
                    <img
                      src={limitation.operatesCase.image}
                      alt={limitation.operatesCase.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {limitation.operatesCase.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-800 italic">
                    {limitation.operatesCase.imageCaption}
                  </span>
                  <a
                    href="tel:193"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    193
                  </a>
                </div>
              </div>

              {/* DOES NOT OPERATE CASE (NON-EMERGENCY) */}
              <div className="bg-rose-50/60 rounded-2xl p-5 border-2 border-rose-300 flex flex-col justify-between space-y-4 shadow-2xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                      <XCircle className="w-3.5 h-3.5" />
                      {limitation.doesNotOperateCase.badgeText}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-rose-950">
                    {limitation.doesNotOperateCase.title}
                  </h4>

                  {/* Real Image */}
                  <div className="rounded-xl overflow-hidden bg-slate-900 border border-rose-200 aspect-video relative shadow-xs">
                    <img
                      src={limitation.doesNotOperateCase.image}
                      alt={limitation.doesNotOperateCase.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {limitation.doesNotOperateCase.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-800 italic">
                    {limitation.doesNotOperateCase.imageCaption}
                  </span>
                  <span className="text-[11px] font-bold text-rose-900 bg-rose-100 px-2 py-1 rounded">
                    NÃO ligue 193
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
