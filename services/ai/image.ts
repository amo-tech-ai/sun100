import { edgeClient } from './edgeClient';

/**
 * Generates a high-quality image using Imagen 4.0 via edgeClient.
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    try {
        // Construct a rich prompt
        const prompt = customPrompt || `A professional, high-quality image for a presentation slide titled "${slideTitle}". Context: ${slideContent.substring(0, 150)}... Style: Modern, Minimalist, Business.`;

        const response = await edgeClient.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
                outputMimeType: 'image/jpeg'
            }
        });

        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
        
        if (!base64Image) throw new Error("No image generated.");
        
        return { base64Image };
    } catch (error) {
        console.error("Image Generation Error:", error);
        throw new Error("Failed to generate image.");
    }
};

/**
 * Edits an existing image using Gemini 2.5 Flash Image via edgeClient.
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64ImageData
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        // Parse response to find the image part
        // Note: Gemini 2.5 Flash Image returns image as inlineData in the response parts
        const parts = response.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find((p: any) => p.inlineData);

        if (imagePart && imagePart.inlineData?.data) {
            return { base64Image: imagePart.inlineData.data };
        }

        throw new Error("No edited image returned.");
    } catch (error) {
        console.error("Image Edit Error:", error);
        throw new Error("Failed to edit image.");
    }
};