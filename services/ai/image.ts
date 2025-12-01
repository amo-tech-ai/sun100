
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Generates a high-quality image using Imagen 4.0 via Edge Function.
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction<{ base64Image: string }>('generate-slide-image', {
        slideTitle,
        slideContent,
        customPrompt
    });
};

/**
 * Edits an existing image using Gemini 2.5 Flash Image via Edge Function.
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction<{ base64Image: string }>('edit-slide-image', {
        base64ImageData,
        mimeType,
        prompt
    });
};
