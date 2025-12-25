import { GoogleGenAI, Type } from "@google/genai";
import { ViralAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeVirality = async (
  title: string,
  description: string,
  mode: string
): Promise<ViralAnalysis> => {
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: Math.floor(Math.random() * 30) + 70,
          feedback: "Analysis requires valid API Key. Showing mock data. The content shows strong visual rhythm.",
          suggestions: ["Add a hook in the first 3 seconds", "Increase saturation", "Use a trending audio track"]
        });
      }, 1500);
    });
  }

  try {
    const prompt = `
      Analyze the viral potential of a short-form video concept for a platform called 'FractalFlow'.
      
      Project Details:
      Title: "${title}"
      Description: "${description}"
      Effect Mode: "${mode}"
      
      Provide a JSON response with:
      - score: integer 0-100
      - feedback: A short 1-sentence analysis of why it might go viral.
      - suggestions: Array of 3 short, actionable tips to improve virality.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ViralAnalysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      score: 65,
      feedback: "Could not reach AI analysis service.",
      suggestions: ["Check internet connection", "Try a different title", "Add more fractal depth"]
    };
  }
};

export const generateCreativePrompt = async (): Promise<string> => {
  if (!apiKey) return "A surreal landscape of melting clocks and floating islands, digital art style.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a single, highly descriptive, creative text-to-video prompt for a viral, abstract, or surreal short video. Output ONLY the prompt string.",
    });
    return response.text?.trim() || "A glowing orb pulsating with rhythmic energy in a void.";
  } catch (e) {
    return "A futuristic city skyline at sunset with flying cars.";
  }
};
