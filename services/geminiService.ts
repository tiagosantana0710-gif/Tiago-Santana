
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a spiritual reflection for a specific prayer using the Gemini model.
 */
export const getPrayerReflection = async (prayerTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explique brevemente e de forma inspiradora o significado espiritual da oração "${prayerTitle}" para um fiel católico. Use uma linguagem simples e acolhedora em Português do Brasil. Limite a 3 parágrafos curtos.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao buscar reflexão:", error);
    return "Que esta oração seja um bálsamo para sua alma e uma ponte direta ao coração de Deus. Reze com fé e confiança.";
  }
};

/**
 * Generates audio for a prayer using Gemini TTS.
 */
export const generatePrayerAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leia esta oração de forma pausada, solene e devota: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good balanced voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Erro ao gerar áudio da oração:", error);
    return null;
  }
};

/**
 * Generates a high-quality app icon for the Catholic application using AI.
 */
export const generateAppIcon = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional and elegant app icon for a Catholic prayer app. Minimalist design, featuring a golden stylized cross with a soft glowing halo behind it on a deep royal purple background. Material design style, 3D soft lighting, sacred art aesthetic, symmetrical, high resolution, 1024x1024. No text.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar ícone:", error);
    return null;
  }
};

/**
 * Generates a small, stylized gratitude/support icon for the developer section.
 */
export const generateSupportIcon = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A small, elegant and minimalist icon representing gratitude and blessing. Two hands gently cupping a glowing warm golden heart. Sacred art style, soft lighting, cream and gold color palette, circular composition, high quality, 512x512. No text.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar ícone de apoio:", error);
    return null;
  }
};

/**
 * Gets the daily liturgical information including the saint of the day and liturgical time.
 * Supports an optional date parameter.
 */
export const getDailyLiturgyInfo = async (dateStr?: string) => {
    const today = dateStr || new Date().toLocaleDateString('pt-BR');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Informe qual é o santo do dia e o tempo litúrgico para o dia ${today} no calendário católico romano oficial.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        santo: {
                            type: Type.STRING,
                            description: "Nome do santo ou festa do dia."
                        },
                        tempo: {
                            type: Type.STRING,
                            description: "Tempo litúrgico atual (ex: Tempo Comum, Quaresma, etc)."
                        },
                        cor: {
                            type: Type.STRING,
                            description: "Cor litúrgica: verde, branco, roxo, vermelho ou rosa."
                        },
                        mensagem: {
                            type: Type.STRING,
                            description: "Uma breve mensagem de inspiração baseada na liturgia desse dia específico."
                        }
                    },
                    required: ["santo", "tempo", "cor", "mensagem"]
                }
            }
        });
        
        const text = response.text;
        if (!text) {
          throw new Error("Empty response from Gemini");
        }
        
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Erro ao buscar liturgia:", error);
        return {
            santo: "Santo do Dia",
            tempo: "Tempo Comum",
            cor: "verde",
            mensagem: "Caminhemos com alegria seguindo os passos de Nosso Senhor Jesus Cristo."
        };
    }
}
