
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a high-quality image using Imagen 4.0.
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
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
            }
        });

        // Find the image part in the response
        let imagePart;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imagePart = part;
                    break;
                }
            }
        }
        
        if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
             throw new Error("Gemini processed the request but returned no image data.");
        }

        return { base64Image: imagePart.inlineData.data };

    } catch (error) {
        console.error("Nano Banana Edit Error:", error);
        throw new Error("Failed to edit image. Ensure your prompt is clear and the image is valid.");
    }
};
