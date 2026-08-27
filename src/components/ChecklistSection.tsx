import React, { useState, useEffect } from 'react';
import {
  MapPin,
  LocateFixed,
  PhoneCall,
  Copy,
  Check,
  Volume2,
  AlertCircle,
  FileText,
  UserCheck,
  Activity,
  Heart,
  Droplet,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ChecklistData, EmergencyNumber } from '../types';

interface ChecklistSectionProps {
  initialService?: EmergencyNumber;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  initialService = '192',
}) => {
  const [formData, setFormData] = useState<ChecklistData>({
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    referencePoint: '',
    situation: '',
    isConscious: 'sim',
    isBreathing: 'sim',
    hasPulse: 'sim',
    heavyBleeding: 'nao',
    victimAge: '',
    healthHistory: '',
    contactName: '',
    contactPhone: '',
    selectedService: initialService,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, selectedService: initialService }));
    }
  }, [initialService]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada no seu navegador.');
      return;
    }

    setIsLocating(true);
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));

        try {
          const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            setFormData((prev) => ({
              ...prev,
              address: addr.road || addr.street || prev.address || 'Localização obtida via GPS',
              number: addr.house_number || prev.number || '',
              neighborhood: addr.suburb || addr.neighbourhood || addr.city_district || prev.neighborhood || '',
              city: addr.city || addr.town || addr.municipality || prev.city || '',
            }));
            setGpsSuccess(true);
          } else {
            // Fallback
            setGpsSuccess(true);
          }
        } catch {
          setGpsSuccess(true);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Erro de GPS:', err);
        setIsLocating(false);
        alert('Não foi possível obter a localização exata. Por favor, digite o endereço manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getServiceName = (num: EmergencyNumber) => {
    switch (num) {
      case '190':
        return 'Polícia Militar (190)';
      case '192':
        return 'SAMU (192)';
      case '193':
        return 'Corpo de Bombeiros (193)';
      case '197':
        return 'Polícia Civil (197)';
      case '153':
        return 'Guarda Municipal (153)';
      case '181':
        return 'Disque Denúncia (181)';
      default:
        return num;
    }
  };

  // Compile the real-time speech script to read to the dispatcher
  const generateCallScript = () => {
    const fullAddress = [
      formData.address ? `${formData.address}${formData.number ? ', nº ' + formData.number : ''}` : '',
      formData.neighborhood ? `Bairro ${formData.neighborhood}` : '',
      formData.city ? `Cidade: ${formData.city}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const ref = formData.referencePoint ? `Ponto de referência: ${formData.referencePoint}.` : '';

    const vitalsDesc =
      formData.selectedService === '192' || formData.selectedService === '193'
        ? `Estado da vítima: ${
            formData.isConscious === 'sim'
              ? 'Consciente e respondendo.'
              : formData.isConscious === 'nao'
              ? 'INCONSCIENTE, não responde.'
              : 'Confusa / sonolenta.'
          } ${
            formData.isBreathing === 'sim'
              ? 'Respiração presente.'
              : formData.isBreathing === 'nao'
              ? 'NÃO ESTÁ RESPIRANDO.'
              : 'Com muita falta de ar / dificuldade.'
          } ${
            formData.hasPulse === 'nao'
              ? 'SEM PULSO DETECTÁVEL.'
              : formData.hasPulse === 'fraco'
              ? 'Pulso fraco.'
              : 'Pulso presente.'
          } ${
            formData.heavyBleeding === 'sim'
              ? 'COM HEMORRAGIA INTENSA.'
              : formData.heavyBleeding === 'moderado'
              ? 'Sangramento moderado.'
              : 'Sem sangramento ativo visível.'
          }`
        : '';

    const patientDetails = [
      formData.victimAge ? `Idade estimada: ${formData.victimAge} anos.` : '',
      formData.healthHistory ? `Histórico médico / condições prévias: ${formData.healthHistory}.` : '',
      formData.contactName ? `Contato responsável: ${formData.contactName} (${formData.contactPhone || 'mesmo número'}).` : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `Olá atendente do ${getServiceName(formData.selectedService)}.

1. LOCALIZAÇÃO:
Estou no endereço: ${fullAddress || '[Informe o endereço]'}
${ref}
${formData.lat && formData.lng ? `Coordenadas GPS: ${formData.lat.toFixed(5)}, ${formData.lng.toFixed(5)}` : ''}

2. SITUAÇÃO / O QUE ACONTECEU:
${formData.situation || '[Descreva brevemente o que aconteceu]'}

3. ESTADO DA VÍTIMA E HISTÓRICO:
${vitalsDesc}
${patientDetails}

Por favor, envie o apoio o mais rápido possível.`;
  };

  const scriptText = generateCallScript();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeakScript = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleHistoryTag = (tag: string) => {
    const current = formData.healthHistory;
    if (current.includes(tag)) {
      const updated = current
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== tag)
        .join(', ');
      setFormData((p) => ({ ...p, healthHistory: updated }));
    } else {
      const updated = current ? `${current}, ${tag}` : tag;
      setFormData((p) => ({ ...p, healthHistory: updated }));
    }
  };

  return (
    <section className="space-y-6" id="checklist-section">
      {/* Header info */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Prontidão no Atendimento
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Checklist Vital para a Ligação de Emergência
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
              Em momentos de tensão, é comum esquecer detalhes cruciais. Preencha este roteiro ou use a localização automática do mapa para transmitir dados vitais em poucos segundos ao atendente.
            </p>
          </div>

          {/* Direct Service Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Serviço:</span>
            <select
              value={formData.selectedService}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  selectedService: e.target.value as EmergencyNumber,
                }))
              }
              className="px-3 py-2 text-xs sm:text-sm font-bold bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900"
            >
              <option value="192">192 - SAMU (Saúde/Clínico)</option>
              <option value="193">193 - Bombeiros (Resgate/Fogo)</option>
              <option value="190">190 - Polícia Militar (Crime ativo)</option>
              <option value="197">197 - Polícia Civil (B.O./Investigação)</option>
              <option value="153">153 - Guarda Municipal (Patrimônio)</option>
              <option value="181">181 - Disque Denúncia (Anônimo)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Information Input */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Exact Location & GPS Integration */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                1. Localização Exata
              </h3>

              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                id="btn-get-gps-location"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50 shadow-2xs"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Obtendo GPS...' : 'Usar Meu GPS'}</span>
              </button>
            </div>

            {gpsSuccess && formData.lat && formData.lng && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span>📍 GPS detectado: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}</span>
                <a
                  href={`https://maps.google.com/?q=${formData.lat},${formData.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-800 font-bold underline text-[11px]"
                >
                  Abrir Mapa <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Rua / Avenida / Rodovia *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Av. Paulista ou Rod. Castelo Branco km 32"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Número
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1500 ou S/N"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Centro / Bela Vista"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Cidade / Estado
                </label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo - SP"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Ponto de Referência (Essencial para viatura)
              </label>
              <input
                type="text"
                placeholder="Ex: Em frente à farmácia São João, esquina com rua das Flores"
                value={formData.referencePoint}
                onChange={(e) => setFormData({ ...formData, referencePoint: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Section 2: What happened */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              2. A Situação Real (O que aconteceu de fato?)
            </h3>

            <div>
              <textarea
                rows={2}
                placeholder="Ex: Acidente de carro com moto, vítima caída no asfalto / Pessoa desmaiou de repente após dor no peito / Casa com princípio de incêndio..."
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Section 3: Victim Vital Status (Health & Accidents) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              3. Estado Vital da Vítima (Se aplicável)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Consciência */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>A vítima está consciente?</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {(['sim', 'nao', 'parcial'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, isConscious: opt })}
                      className={`py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                        formData.isConscious === opt
                          ? opt === 'nao'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt === 'sim' ? 'Sim' : opt === 'nao' ? 'Não (Apagada)' : 'Confusa'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Respiração */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ela respira? (Peito se move?)</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {(['sim', 'nao', 'dificuldade'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, isBreathing: opt })}
                      className={`py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                        formData.isBreathing === opt
                          ? opt === 'nao'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt === 'sim' ? 'Sim' : opt === 'nao' ? 'NÃO respira' : 'Com esforço'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pulso */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Heart className="w-3.5 h-3.5 text-red-600" />
                  <span>Tem pulso? (Pescoço ou pulso)</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {(['sim', 'nao', 'fraco'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasPulse: opt })}
                      className={`py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                        formData.hasPulse === opt
                          ? opt === 'nao'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt === 'sim' ? 'Sim' : opt === 'nao' ? 'Sem pulso' : 'Fraco'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hemorragia */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Droplet className="w-3.5 h-3.5 text-rose-600" />
                  <span>Há sangramento intenso?</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {(['nao', 'moderado', 'sim'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, heavyBleeding: opt })}
                      className={`py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                        formData.heavyBleeding === opt
                          ? opt === 'sim'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt === 'nao' ? 'Não' : opt === 'moderado' ? 'Moderado' : 'Sim (Forte)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: History, Age & Contact */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              4. Idade, Histórico de Saúde & Contato
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Idade aproximada
                </label>
                <input
                  type="text"
                  placeholder="Ex: 45 anos / 8 meses"
                  value={formData.victimAge}
                  onChange={(e) => setFormData({ ...formData, victimAge: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome de Contato / Vítima
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria da Silva"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone de Retorno
                </label>
                <input
                  type="tel"
                  placeholder="Ex: (11) 98765-4321"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Histórico prévio de saúde (clique para adicionar rapidamente):
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Infarto prévio',
                  'Hipertensão (Pressão Alta)',
                  'Diabetes',
                  'Epilepsia / Convulsões',
                  'Asma severa',
                  'Gestante',
                  'Uso de anticoagulante',
                  'Alergia grave',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleHistoryTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      formData.healthHistory.includes(tag)
                        ? 'bg-purple-600 text-white border-purple-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Outras condições, cirurgias recentes ou remédios em uso..."
                value={formData.healthHistory}
                onChange={(e) => setFormData({ ...formData, healthHistory: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Live Generated Dispatcher Script */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Roteiro de Voz para a Ligação
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded">
                Pronto para ler
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Quando o atendente atender, mantenha a calma e leia as informações abaixo:
            </p>

            {/* Script Text Container */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto no-scrollbar">
              {scriptText}
            </div>

            {/* Actions for the Script */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCopyScript}
                id="btn-copy-call-script"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar Roteiro'}</span>
              </button>

              <button
                onClick={handleSpeakScript}
                id="btn-speak-call-script"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition-colors"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingSpeech ? 'text-amber-400 animate-pulse' : ''}`} />
                <span>{isPlayingSpeech ? 'Parar Áudio' : 'Ouvir Roteiro'}</span>
              </button>
            </div>

            {/* Big Action Call Button */}
            <a
              href={`tel:${formData.selectedService}`}
              id="btn-trigger-emergency-call"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all shadow-md active:scale-98"
            >
              <PhoneCall className="w-4 h-4" />
              <span>DISCAR AGORA PARA {getServiceName(formData.selectedService)}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
