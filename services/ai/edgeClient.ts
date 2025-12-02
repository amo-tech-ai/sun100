import { GoogleGenAI } from "@google/genai";

// Centralized client initialization.
// This abstraction allows us to easily switch between direct client-side API calls
// (prototype mode) and backend Edge Function calls (production mode) in the future.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const edgeClient = {
    models: {
        generateContent: (params: any) => ai.models.generateContent(params),
        generateImages: (params: any) => ai.models.generateImages(params),
        generateVideos: (params: any) => ai.models.generateVideos(params),
    },
    operations: {
        getVideosOperation: (params: any) => ai.operations.getVideosOperation(params),
    }
};