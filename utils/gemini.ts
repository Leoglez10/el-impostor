
import { GoogleGenAI, Type } from "@google/genai";

// Inicializar cliente
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY no encontrada en process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface ValidacionIA {
  palabra: string;
  esValida: boolean;
  mensajeError?: string;
}

export const generarPalabraConIA = async (tema: string): Promise<ValidacionIA> => {
  const ai = getAiClient();
  
  if (!ai) {
    return { 
      palabra: "", 
      esValida: false, 
      mensajeError: "Configuración de API no encontrada." 
    }; 
  }

  try {
    const prompt = `Actúa como un experto diseñador de juegos de mesa. 
    Tu tarea es generar una palabra secreta para el juego "El Impostor" basada en el tema: "${tema}".
    
    REGLAS DE VALIDACIÓN:
    1. Debe ser un sustantivo común o nombre propio muy conocido.
    2. Debe ser fácil de describir con una palabra pero no obvia (ej: "Agua" para tema "Naturaleza" es buena, "H2O" es mala).
    3. No debe ser una frase, solo una palabra (o dos si es un nombre compuesto muy corto).
    4. Debe ser apta para todos los públicos a menos que el tema sea explícitamente sobre adultos.
    5. Si el tema es incoherente o inapropiado, marca esValida como false.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palabra: {
              type: Type.STRING,
              description: 'La palabra secreta generada.',
            },
            esValida: {
              type: Type.BOOLEAN,
              description: 'Si la palabra y el tema son aptos para el juego.',
            },
            mensajeError: {
              type: Type.STRING,
              description: 'Explicación de por qué no es válida (si aplica).',
            },
          },
          required: ["palabra", "esValida"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      palabra: result.palabra?.trim() || "",
      esValida: !!result.esValida,
      mensajeError: result.mensajeError || "El tema proporcionado no permite generar una palabra válida para el juego."
    };

  } catch (error) {
    console.error("Error generando palabra con IA:", error);
    return {
      palabra: "",
      esValida: false,
      mensajeError: "Error de conexión con el servicio de IA. Intenta con un tema más sencillo."
    };
  }
};
