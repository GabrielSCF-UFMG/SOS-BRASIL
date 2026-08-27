import React, { useState } from 'react';
import {
  HeartPulse,
  Flame,
  ShieldAlert,
  FileText,
  Building2,
  EyeOff,
  TreePine,
  ArrowRight,
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { EmergencyNumber } from '../types';

interface QuickTriageWizardProps {
  onSelectService: (service: EmergencyNumber) => void;
  onOpenFirstAid: (guideId?: string) => void;
  onOpenLimitations: () => void;
  onOpenAI: () => void;
}

export const QuickTriageWizard: React.FC<QuickTriageWizardProps> = ({
  onSelectService,
  onOpenFirstAid,
  onOpenLimitations,
  onOpenAI,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subQuestion, setSubQuestion] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedCategory(null);
    setSubQuestion(null);
  };

  return (
    <div className="space-y-6" id="quick-triage-wizard">
      {/* Hero Welcome with fast interactive decision buttons */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600/90 text-white shadow-xs">
            <span>TRIAGEM IMEDIATA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Em caso de emergência, qual serviço você deve acionar?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Selecione abaixo a natureza da ocorrência para obter o número telefônico exato, o roteiro da ligação e as instruções seguras de primeiros socorros.
          </p>
        </div>

        {/* Ambient subtle glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Decision Tree Options */}
      {!selectedCategory ? (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>1. O que está acontecendo agora?</span>
            <span className="text-xs text-slate-500 font-normal">Selecione uma opção</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Option 1: Saúde Clínica */}
            <button
              onClick={() => setSelectedCategory('saude')}
              className="bg-white hover:bg-red-50/50 p-5 rounded-2xl border border-slate-200 hover:border-red-300 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-red-700">
                    Emergência de Saúde / Clínica
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Infarto, AVC/Derrame, convulsão, desmaio, envenenamento, falta de ar, trabalho de parto.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-red-600">
                <span>Indicação: SAMU</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: Resgate / Fogo */}
            <button
              onClick={() => setSelectedCategory('resgate')}
              className="bg-white hover:bg-orange-50/50 p-5 rounded-2xl border border-slate-200 hover:border-orange-300 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-700">
                    Incêndio, Resgate ou Trauma Físico
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Fogo, vítimas presas nas ferragens, afogamentos, soterramentos, choque elétrico, altura.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-orange-600">
                <span>Indicação: Bombeiros</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 3: Crime em Andamento */}
            <button
              onClick={() => setSelectedCategory('crime_ativo')}
              className="bg-white hover:bg-blue-50/50 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    Crime em Andamento / Flagrante
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Violência doméstica, assalto acontecendo agora, invasão, briga com risco à vida.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Indicação: Polícia Militar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 4: Árvore / Abelhas */}
            <button
              onClick={() => setSelectedCategory('arvore_abelhas')}
              className="bg-white hover:bg-amber-50/50 p-5 rounded-2xl border border-slate-200 hover:border-amber-300 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-700">
                    Árvore Caída / Abelhas e Marimbondos
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verificar se é caso para os Bombeiros 193 ou para a Prefeitura (156).
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Verificar critérios de atuação</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 5: Crime Passado / B.O. */}
            <button
              onClick={() => setSelectedCategory('crime_passado')}
              className="bg-white hover:bg-slate-100 p-5 rounded-2xl border border-slate-200 hover:border-slate-400 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Crime Já Ocorrido / Registro de B.O.
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Furto passado, golpe financeiro/Pix, desaparecimento de pessoas, investigação.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Indicação: Polícia Civil</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 6: Patrimônio Municipal / Denúncia */}
            <button
              onClick={() => setSelectedCategory('outros')}
              className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                    Patrimônio da Cidade ou Denúncia Anônima
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Vandalismo em praças/escolas (153) ou denúncias anônimas de drogas/foragidos (181).
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Guarda (153) / Denúncia (181)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen of the Decision */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resultado da Triagem
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Fazer outra consulta
            </button>
          </div>

          {/* Render Specific Outcome */}
          {selectedCategory === 'saude' && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  192
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-600 uppercase">Serviço Recomendado</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    SAMU (Serviço de Atendimento Móvel de Urgência)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    O SAMU conta com médicos reguladores preparados para orientar por telefone e enviar ambulância com suporte avançado (UTI) se necessário.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-red-950 uppercase tracking-wide">
                  Ações Imediatas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-red-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Ligue 192 e mantenha a calma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Tenha o endereço e ponto de referência</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Não ofereça água ou remédios à vítima</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Coloque o telefone no viva-voz</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:192"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Ligar 192 SAMU Agora
                </a>

                <button
                  onClick={() => onSelectService('192')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Abrir Checklist de Ligação
                </button>

                <button
                  onClick={() => onOpenFirstAid()}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  <HeartPulse className="w-4 h-4 text-red-600" />
                  Ver Primeiros Socorros
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 'resgate' && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  193
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-orange-600 uppercase">Serviço Recomendado</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Corpo de Bombeiros Militar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Especialistas em combate a incêndios, desencarceramento de vítimas presas em veículos, resgates aquáticos, soterramentos e contenção de vazamentos perigosos.
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-orange-950 uppercase tracking-wide">
                  Procedimentos de Segurança:
                </h4>
                <p className="text-xs sm:text-sm text-orange-900">
                  Em caso de incêndio ou gás, evacue a área imediatamente. Não tente entrar em locais em chamas. Em acidentes veiculares, NÃO movimente a vítima a menos que haja perigo iminente de explosão ou atropelamento.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:193"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Ligar 193 Bombeiros
                </a>

                <button
                  onClick={() => onSelectService('193')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Abrir Checklist de Ligação
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 'crime_ativo' && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  190
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-700 uppercase">Serviço Recomendado</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Polícia Militar (PM)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Acione o 190 para crimes em andamento, flagrantes, invasões domiciliares e ameaças iminentes à vida.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-blue-950 space-y-2">
                <span className="font-bold">⚠️ Recomendações de Sobrevivência:</span>
                <p>
                  Mantenha-se abrigado em local seguro. Não tente confrontar os agressores ou reagir a assaltos à mão armada. Fale em voz baixa ao telefone com o atendente do 190 se estiver escondido.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:190"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Ligar 190 PM Agora
                </a>

                <button
                  onClick={() => onSelectService('190')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Checklist de Informações para a PM
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 'arvore_abelhas' && (
            <div className="space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Avaliação de Risco: Bombeiros vs. Prefeitura
              </h3>

              <p className="text-xs sm:text-sm text-slate-600">
                O Corpo de Bombeiros (193) só atua quando há risco iminente à vida, colapso de estruturas ou vias bloqueadas. Veja a comparação visual completa:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Ligue 193 Bombeiros
                  </span>
                  <p className="text-xs text-emerald-950">
                    Árvore já caída sobre carros, casas ou bloqueando ruas; ou ninho fixo estruturado de vespas/abelhas dentro de casa atacando pessoas.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Prefeitura (156) / Defesa Civil (199)
                  </span>
                  <p className="text-xs text-amber-950">
                    Poda de árvores saudáveis, limpeza preventiva, ou enxame temporário migratório de abelhas apenas pousado em galho.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenLimitations}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  <TreePine className="w-4 h-4" />
                  Ver Fotos e Exemplos de Limitações
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 'crime_passado' && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  197
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 uppercase">Serviço Recomendado</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Polícia Civil
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Polícia investigativa judiciária. Ideal para registro de Boletim de Ocorrência (B.O.), denúncia de golpes pela internet, furto consumado e investigações.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700">
                💡 <span className="font-bold">Dica Cidadã:</span> A maioria dos estados brasileiros permite registrar Boletim de Ocorrência (B.O.) online pela Delegacia Eletrônica da Polícia Civil para furtos e golpes virtuais, sem precisar sair de casa.
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:197"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Ligar 197 Polícia Civil
                </a>

                <button
                  onClick={() => onSelectService('197')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Preparar Informações para o B.O.
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 'outros' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 153 */}
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">
                      153
                    </span>
                    <div>
                      <h4 className="font-bold text-emerald-950">Guarda Municipal</h4>
                      <span className="text-[11px] text-emerald-700">Patrimônio Municipal</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-900">
                    Vandalismo em praças, danos a escolas municipais, postos de saúde (UBS) e apoio ao trânsito municipal.
                  </p>
                  <a
                    href="tel:153"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Ligar 153 Guarda
                  </a>
                </div>

                {/* 181 */}
                <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg">
                      181
                    </span>
                    <div>
                      <h4 className="font-bold text-purple-950">Disque Denúncia</h4>
                      <span className="text-[11px] text-purple-700">100% Anônimo</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-900">
                    Para denunciar tráfico de drogas, foragidos, armas ilegais e desmanches sem se identificar.
                  </p>
                  <a
                    href="tel:181"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-700 text-white hover:bg-purple-800 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Ligar 181 Anônimo
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct AI Consultation CTA */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-indigo-950">
              Caso complexo ou dúvida específica?
            </h4>
            <p className="text-xs text-indigo-800">
              Converse com nosso Assistente de Triagem com IA para orientações personalizadas em tempo real.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAI}
          id="btn-open-ai-from-triage"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-colors shrink-0 shadow-xs"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Falar com Assistente IA</span>
        </button>
      </div>
    </div>
  );
};
