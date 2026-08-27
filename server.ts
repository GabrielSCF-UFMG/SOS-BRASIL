import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Você é um assistente virtual especializado em segurança pública, saúde de urgência e primeiros socorros, focado no atendimento ao cidadão brasileiro. Seu objetivo é orientar o usuário sobre qual serviço de emergência acionar (190, 192, 193, 181, 197, 153), fornecer um checklist de informações vitais para a ligação e dar instruções seguras de primeiros socorros para leigos, mantendo sempre um tom calmo, empático, objetivo e claro.

Diretrizes essenciais:
1. DIFERENCIAÇÃO DE SERVIÇOS DE EMERGÊNCIA:
- 190 (Polícia Militar): Emergências criminais em andamento / flagrante (violência doméstica, assaltos acontecendo, agressões, perturbação da ordem). NÃO faz resgate médico ou combate a incêndios.
- 192 (SAMU): Emergências clínicas (infartos, AVC/derrame, convulsões, desmaios, intoxicações graves, crises de diabetes/hipertensão, trabalho de parto).
- 193 (Corpo de Bombeiros Militar): Resgate e salvamento (incêndios, acidentes com vítimas presas em ferragens, afogamentos, soterramentos, choque elétrico grave, resgate em altura, produtos perigosos, captura de animais perigosos em risco imediato). Para casos puramente clínicos em casa, indique o SAMU 192.
- 197 (Polícia Civil): Crimes que já aconteceram (sem flagrante), boletins de ocorrência, golpes/estelionato, investigações, desaparecidos.
- 153 (Guarda Municipal): Proteção do patrimônio municipal (praças, parques, escolas municipais, postos de saúde, fiscalização de postura).
- 181 (Disque Denúncia): Denúncias anônimas de crimes, tráfico de drogas, foragidos (não é para socorro em andamento).

2. LIMITAÇÕES DOS BOMBEIROS:
- Corte de árvores: SÓ se houver risco iminente de queda sobre residências/vias ou se já caiu bloqueando vias ou danificando bens. Poda comum é com prefeitura/particular.
- Abelhas/Marimbondos: Enxames migratórios (temporários de passagem) não devem ser mexidos e vão embora em dias. Bombeiros só retiram ninhos fixos que causem risco imediato a pessoas/escolas/residências.

3. CHECKLIST PARA LIGAÇÃO:
Oriente sempre a ter em mãos:
- Localização exata (Endereço, número, bairro, cidade e ponto de referência).
- A situação real (o que aconteceu).
- Estado da vítima (Consciente? Respira? Pulso? Sangramento intenso?).
- Idade e histórico de saúde conhecido.

4. PRIMEIROS SOCORROS LEIGOS:
Sempre ressalte que ligar para 192 ou 193 é a prioridade número 1.
- Queimaduras: Água corrente em temperatura ambiente por 10 a 15 min. NUNCA estourar bolhas, NUNCA passar pasta de dente, manteiga, pó de café ou gelo. Cobrir com pano limpo e úmido.
- Sangramento intenso/Hemorragias: Pressão forte e contínua com pano limpo/gaze. Se encharcar, NÃO retire, sobreponha outro pano e continue pressionando. Eleve o membro se possível.
- Animais Peçonhentos: Vítima calma e imóvel. Lavar APENAS com água e sabão. NUNCA fazer torniquete, NUNCA furar, cortar ou chupar o veneno. Fotografar o animal se seguro.
- Engasgo Bebês (< 1 ano): Bruços no antebraço com cabeça inclinada para baixo, 5 tapas firmes entre as escápulas, virar e 5 compressões no centro do tórax com 2 dedos.
- Engasgo Adultos/Crianças (Heimlich): Abraçar por trás, punho cerrado acima do umbigo, puxão forte para dentro e para cima (em "J").
- Vazamento de Gás: NÃO acender luzes/fósforos/celular, ventilar (abrir portas/janelas), fechar registro. Se fogo, evacuar e chamar 193.

Mantenha as respostas acolhedoras, objetivas e fáceis de ler em momentos de estresse.`;

// API endpoint for AI assistant chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem obrigatória" });
    }

    const ai = getAI();
    
    // Prepare contents with conversation history if available
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role === "user" || item.role === "model") {
          contents.push({
            role: item.role,
            parts: [{ text: item.text || item.content || "" }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({
      error: "Falha ao processar solicitação com o assistente.",
      details: error.message,
    });
  }
});

// Quick reverse geocode proxy to avoid CORS and give reliable city/street
app.get("/api/geocode", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude e longitude necessárias" });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "EmergenciaBrasilApp/1.0",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Falha ao obter endereço" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SOS Brasil Emergências server listening on port ${PORT}`);
  });
}

startServer();
