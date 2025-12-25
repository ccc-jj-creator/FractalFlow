import { GoogleGenAI, Type } from "@google/genai";
import { ViralAnalysis } from "../types";
import { PLACEHOLDER_VIDEOS } from "../constants";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface VideoGenerationResult {
  videoUrl: string;
  success: boolean;
  error?: string;
}

export const generateVideo = async (
  prompt: string,
  onProgress?: (status: string) => void
): Promise<VideoGenerationResult> => {
  if (!apiKey) {
    // Fallback to placeholder for demo
    onProgress?.("Using demo mode (no API key)...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomVideo = PLACEHOLDER_VIDEOS[Math.floor(Math.random() * PLACEHOLDER_VIDEOS.length)];
    return { videoUrl: randomVideo, success: true };
  }

  try {
    onProgress?.("Starting video generation with Veo 3.1...");

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt,
    });

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max (10s intervals)

    while (!operation.done && attempts < maxAttempts) {
      attempts++;
      onProgress?.(`Generating video... (${attempts * 10}s elapsed)`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation.done) {
      throw new Error("Video generation timed out");
    }

    const generatedVideo = operation.response?.generatedVideos?.[0];
    if (!generatedVideo?.video) {
      throw new Error("No video in response");
    }

    onProgress?.("Video generated successfully!");

    // Get the video URI
    const videoUri = generatedVideo.video.uri;
    if (!videoUri) {
      throw new Error("No video URI available");
    }

    return { videoUrl: videoUri, success: true };

  } catch (error) {
    console.error("Veo 3.1 Error:", error);
    // Fallback to placeholder on error
    const randomVideo = PLACEHOLDER_VIDEOS[Math.floor(Math.random() * PLACEHOLDER_VIDEOS.length)];
    return {
      videoUrl: randomVideo,
      success: false,
      error: error instanceof Error ? error.message : "Video generation failed"
    };
  }
};

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
      model: 'gemini-2.0-flash',
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

    try {
      return JSON.parse(text) as ViralAnalysis;
    } catch (parseError) {
      throw new Error("Invalid JSON response from AI");
    }

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
      model: 'gemini-2.0-flash',
      contents: "Generate a single, highly descriptive, creative text-to-video prompt for a viral, abstract, or surreal short video. Output ONLY the prompt string.",
    });
    return response.text?.trim() || "A glowing orb pulsating with rhythmic energy in a void.";
  } catch (e) {
    return "A futuristic city skyline at sunset with flying cars.";
  }
};
