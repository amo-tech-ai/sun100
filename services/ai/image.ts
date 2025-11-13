import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    const model = 'imagen-4.0-generate-001';
    const prompt = customPrompt 
        ? customPrompt 
        : `Generate a visually appealing and professional image for a presentation slide. The slide title is "${slideTitle}" and the content is "${slideContent}". The image should be abstract or conceptual, suitable for a business presentation.`;
    
    try {
        const response = await ai.models.generateImages({
            model,
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        if (base64ImageBytes) {
            return { base64Image: base64ImageBytes };
        }
        
        throw new Error("AI did not return an image.");
    } catch (error) {
        console.error("Error generating slide image:", error);
        throw new Error("Failed to generate image. Please try a different prompt.");
    }
};

export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    const model = 'gemini-2.5-flash-image';
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData?.data) {
            return { base64Image: imagePart.inlineData.data };
        }

        throw new Error("AI did not return an edited image.");
    } catch (error) {
        console.error("Error editing slide image:", error);
        throw new Error("Failed to edit image. The model may not have been able to apply the changes.");
    }
};