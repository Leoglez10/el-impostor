
import { GoogleGenAI, Modality } from "@google/genai";

// Funciones de decodificación requeridas por la guía
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

class SoundManager {
  private context: AudioContext | null = null;
  private volume: number = 0.3;

  private initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
    const ctx = this.initContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    gain.gain.setValueAtTime(this.volume, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1);
  }

  playStart() {
    this.playTone(400, 'triangle', 0.1, 0);
    this.playTone(600, 'triangle', 0.1, 0.1);
    this.playTone(800, 'triangle', 0.3, 0.2);
  }

  playReveal() {
    this.playTone(300, 'sine', 0.5);
  }

  playVote() {
    this.playTone(200, 'square', 0.1);
    this.playTone(150, 'square', 0.3, 0.1);
  }

  playWin() {
    this.playTone(523.25, 'sine', 0.1, 0);
    this.playTone(659.25, 'sine', 0.1, 0.1);
    this.playTone(783.99, 'sine', 0.1, 0.2);
    this.playTone(1046.50, 'sine', 0.4, 0.3);
  }

  playLoss() {
    this.playTone(440, 'sawtooth', 0.2, 0);
    this.playTone(415, 'sawtooth', 0.2, 0.2);
    this.playTone(392, 'sawtooth', 0.6, 0.4);
  }

  /**
   * Anuncia al jugador inicial usando Gemini TTS
   */
  async announceStartingPlayer(nombre: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      const prompt = `Di con entusiasmo y energía: ¡El debate comienza! El primer turno es para ${nombre}. ¡A jugar!`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore tiene un tono amigable y profesional
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const ctx = this.initContext();
        const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          ctx,
          24000,
          1,
        );
        
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.8; // Volumen más alto para la voz
        
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start();
        
        return new Promise((resolve) => {
          source.onended = resolve;
        });
      }
    } catch (error) {
      console.error("Error en Gemini TTS:", error);
      // Fallback: Si falla Gemini, no interrumpimos el juego
    }
  }
}

export const soundManager = new SoundManager();
