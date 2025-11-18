
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Generates a high-quality image using Imagen 4.0.
 * 
 * @param slideTitle - The title of the slide to provide context.
 * @param slideContent - The content of the slide to provide context.
 * @param customPrompt - An optional user-provided prompt override.
 * @returns Promise<{ base64Image: string }>
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a rich prompt if a custom one isn't provided
    const prompt = customPrompt || `A professional, high-quality presentation image for a slide titled "${slideTitle}". 
    Context: ${slideContent}. 
    Style: Modern, clean, suitable for a pitch deck.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
                outputMimeType: 'image/jpeg',
            }
        });

        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
        
        if (!base64Image) {
            throw new Error("Image generation successful, but no image data received.");
        }

        return { base64Image };
    } catch (error) {
        console.error("Imagen 4 Generation Error:", error);
        throw new Error("Failed to generate image. Please check your API key and try again.");
    }
};

/**
 * Edits an existing image using Gemini 2.5 Flash Image ("Nano Banana").
 * 
 * @param base64ImageData - The source image in base64 format.
 * @param mimeType - The mime type of the source image (e.g., 'image/png').
 * @param prompt - The editing instruction (e.g., "Add a blue filter").
 * @returns Promise<{ base64Image: string }>
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Nano Banana
            contents: {
                parts: [
                    { 
                        inlineData: { 
                            data: base64ImageData, 
                            mimeType: mimeType 
                        } 
                    },
                    { text: prompt }
                ]
            },
            config: {
                // Critical for Nano Banana editing: strictly request IMAGE modality
                responseModalities: [Modality.IMAGE],
            }
        });

        // Extract the raw image bytes from the response
        const part = response.candidates?.[0]?.content?.parts?.[0];
        
        if (!part || !part.inlineData || !part.inlineData.data) {
             throw new Error("Gemini processed the request but returned no image data.");
        }

        return { base64Image: part.inlineData.data };

    } catch (error) {
        console.error("Nano Banana Edit Error:", error);
        throw new Error("Failed to edit image. Ensure your prompt is clear and the image is valid.");
    }
};
