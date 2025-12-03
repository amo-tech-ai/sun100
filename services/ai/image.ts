import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Generates a high-quality image using secure backend.
 */
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction('image-ai', {
        action: 'generate',
        slideTitle,
        slideContent,
        customPrompt
    });
};

/**
 * Edits an existing image using secure backend.
 */
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction('image-ai', {
        action: 'edit',
        imageBytes: base64ImageData,
        mimeType,
        prompt
    });
};
