import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  PhoneCall,
  Sparkles,
  ShieldAlert,
  HeartPulse,
  Flame,
  AlertCircle,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { ChatMessage, EmergencyNumber } from '../types';

interface AIAssistantChatProps {
  onOpenChecklist: (service?: EmergencyNumber) => void;
  onOpenFirstAid: (guideId: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'model',
    text: 'Olá. Sou seu Assistente Virtual de Emergência, Saúde e Primeiros Socorros no Brasil. \n\nRelate o que está acontecendo e eu indicarei imediatamente o número correto (190, 192, 193, 197, 153 ou 181), o roteiro para falar com o atendente e orientações seguras de primeiros socorros.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const PRESET_PROMPTS = [
  { label: 'Dor no peito e falta de ar', text: 'Uma pessoa está com dor forte no peito irradiando para o braço e falta de ar. O que fazer e qual número ligar?' },
  { label: 'Assalto / invasão acontecendo agora', text: 'Tem alguém tentando invadir a casa agora e fazendo ameaças. O que eu faço?' },
  { label: 'Bebê engasgado com leite', text: 'Meu bebê de 6 meses engasgou com leite e está com dificuldade de respirar. Como desengasgar?' },
  { label: 'Árvore caiu na rua/casa', text: 'Caiu uma árvore no telhado durante a tempestade. O Bombeiro atende isso ou é a prefeitura?' },
  { label: 'Corte profundo com muito sangue', text: 'Cortei o braço profundamente e está saindo muito sangue sem parar. Como conter o sangramento?' },
  { label: 'Golpe no WhatsApp/Pix', text: 'Caí num golpe do Pix ontem e perdi dinheiro. Devo ligar 190 ou ir na Polícia Civil?' },
];

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  onOpenChecklist,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for context
      const history = messages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await res.json();
      const botReply = data.text || 'Não foi possível gerar uma resposta. Por favor, ligue para 192 (SAMU) ou 190 (PM) em caso de emergência.';

      // Check if text mentions specific emergency numbers to offer instant action badge
      let suggested: EmergencyNumber | undefined;
      if (botReply.includes('192') || botReply.includes('SAMU')) suggested = '192';
      else if (botReply.includes('190') || botReply.includes('Polícia Militar')) suggested = '190';
      else if (botReply.includes('193') || botReply.includes('Bombeiro')) suggested = '193';
      else if (botReply.includes('197') || botReply.includes('Polícia Civil')) suggested = '197';
      else if (botReply.includes('153') || botReply.includes('Guarda Municipal')) suggested = '153';
      else if (botReply.includes('181') || botReply.includes('Disque Denúncia')) suggested = '181';

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedService: suggested,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Não consegui me conectar à inteligência artificial agora. Em caso de perigo imediato, disque diretamente 190 (Polícia Militar), 192 (SAMU) ou 193 (Bombeiros).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <section className="space-y-4" id="ai-chat-section">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              Triagem Virtual Inteligente (IA Especializada)
            </h2>
            <p className="text-xs text-slate-500">
              Descreva sua situação em texto livre para receber a indicação do serviço e instruções imediatas.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar conversa
        </button>
      </div>

      {/* Chat messages viewport */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto flex flex-col space-y-4 shadow-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse self-end max-w-[85%]' : 'self-start max-w-[90%]'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional suggested emergency call pill if present */}
                {!isUser && msg.suggestedService && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <a
                      href={`tel:${msg.suggestedService}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Discar {msg.suggestedService}</span>
                    </a>

                    <button
                      onClick={() => onOpenChecklist(msg.suggestedService)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                    >
                      <span>Abrir Checklist para {msg.suggestedService}</span>
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 self-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-xs shadow-xs text-slate-600 text-xs sm:text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analisando a situação e consultando protocolos de emergência...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Exemplos rápidos:</span>
        {PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            disabled={isLoading}
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition-colors shadow-2xs disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-2xl shadow-xs"
      >
        <input
          type="text"
          id="ai-chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Descreva o que está acontecendo (ex: pessoa engasgada, suspeito armado, dor no peito)..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          id="ai-chat-send-btn"
          className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
};
