
import { invokeEdgeFunction } from '../edgeFunctionService';

export interface VideoGenerationOptions {
    prompt: string;
    imageBytes?: string;
    mimeType?: string;
    aspectRatio?: '16:9' | '9:16';
    resolution?: '720p' | '1080p';
}

export interface VideoOperationResult {
    operationName: string;
    status: 'started' | 'processing';
    message: string;
}

export interface VideoPollResult {
    done: boolean;
    videoBase64?: string;
    mimeType?: string;
    operationData?: {
        name: string;
        video: any;
    };
    status?: string;
    message?: string;
}

export interface VideoExtendOptions {
    prompt: string;
    operationData: {
        name: string;
        video: any;
    };
    aspectRatio?: '16:9' | '9:16';
}

/**
 * Start video generation via Edge Function.
 * Returns an operation name for polling.
 */
export const generateVideo = async (options: VideoGenerationOptions): Promise<VideoOperationResult> => {
    return invokeEdgeFunction<VideoOperationResult>('video-ai', {
        action: 'generate',
        ...options
    });
};

/**
 * Poll for video generation status.
 * Call this every 10 seconds until done is true.
 */
export const pollVideoOperation = async (operationName: string): Promise<VideoPollResult> => {
    return invokeEdgeFunction<VideoPollResult>('video-ai', {
        action: 'poll',
        operationName
    });
};

/**
 * Extend an existing video with a new prompt.
 * Only works with 720p videos.
 */
export const extendVideo = async (options: VideoExtendOptions): Promise<VideoOperationResult> => {
    return invokeEdgeFunction<VideoOperationResult>('video-ai', {
        action: 'extend',
        ...options
    });
};

/**
 * Convert a File to base64 for upload
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Convert base64 video to blob URL for display
 */
export const base64ToVideoUrl = (base64: string, mimeType: string = 'video/mp4'): string => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
};
