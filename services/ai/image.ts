import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction('generate-slide-image', { slideTitle, slideContent, customPrompt });
};

export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    return invokeEdgeFunction('edit-slide-image', { base64ImageData, mimeType, prompt });
};
