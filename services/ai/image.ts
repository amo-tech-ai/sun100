
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Generates a high-quality image using secure backend.
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    try {
        return await invokeEdgeFunction('image-ai', {
            action: 'generate',
            slideTitle,
            slideContent,
            customPrompt
        });
    } catch (error) {
        console.warn("Edge Function 'image-ai/generate' failed. Returning mock image.");
        // Return a simple 1x1 gray pixel as a fallback to prevent UI breakage
        return { base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" };
    }
};

/**
 * Edits an existing image using secure backend.
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    try {
        return await invokeEdgeFunction('image-ai', {
            action: 'edit',
            imageBytes: base64ImageData,
            mimeType,
            prompt
        });
    } catch (error) {
        console.warn("Edge Function 'image-ai/edit' failed. Returning mock image.");
         // Return a simple 1x1 gray pixel as a fallback
        return { base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" };
    }
};
