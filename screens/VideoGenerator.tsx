import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

// --- ICONS ---
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10.78v3.44a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.78a2 2 0 0 1 2-2h12.58"/><path d="m22 8-6 4 6 4V8Z"/></svg>;
const UploadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const XIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

const progressMessages = [
    "Initializing video generation...",
    "Warming up the digital cameras...",
    "Crafting the first few frames...",
    "This can take a few minutes. Great art takes time!",
    "Rendering scene...",
    "Almost there, adding the finishing touches...",
    "Polling for final video..."
];

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const VideoGenerator: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [prompt, setPrompt] = useState('A neon hologram of a cat driving at top speed');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const statusIntervalRef = useRef<number | null>(null);

    const checkApiKey = async () => {
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        setApiKeySelected(hasKey);
    };

    useEffect(() => {
        checkApiKey();
    }, []);

    useEffect(() => {
        if (isGenerating) {
            let messageIndex = 0;
            setGenerationStatus(progressMessages[messageIndex]);
            statusIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % progressMessages.length;
                setGenerationStatus(progressMessages[messageIndex]);
            }, 5000); // Change message every 5 seconds
        } else {
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
            }
        }
        return () => {
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
            }
        };
    }, [isGenerating]);


    const handleSelectKey = async () => {
        await (window as any).aistudio?.openSelectKey();
        await checkApiKey();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleGenerateVideo = async () => {
        setIsGenerating(true);
        setError(null);
        setGeneratedVideoUrl(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            let imagePayload: { imageBytes: string; mimeType: string } | undefined = undefined;
            if (imageFile) {
                setGenerationStatus("Processing uploaded image...");
                const base64Data = await blobToBase64(imageFile);
                imagePayload = {
                    imageBytes: base64Data,
                    mimeType: imageFile.type,
                };
            }

            let operation: GenerateVideosOperation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: imagePayload,
                config: {
                    numberOfVideos: 1,
                    resolution: resolution,
                    aspectRatio: aspectRatio,
                }
            });

            setGenerationStatus("Video generation started. Polling for results...");
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("Video generation completed, but no download link was found.");
            }

            setGenerationStatus("Generation complete! Downloading video...");
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`Failed to download video: ${response.status} ${response.statusText}. Details: ${errorText}`);
            }
            
            const videoBlob = await response.blob();
            const videoObjectUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoObjectUrl);

        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
             if(errorMessage.includes("Requested entity was not found.")){
                 setError("API Key error. Please re-select your API key and try again.");
                 setApiKeySelected(false);
             } else {
                setError(errorMessage);
             }
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (!apiKeySelected) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-brand-blue mb-4">API Key Required</h1>
                <p className="text-gray-600 mb-6">To use the video generation feature, you must select an API key. This is a mandatory step for using the Veo model.</p>
                <p className="text-sm text-gray-500 mb-6">For information on billing, please visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline">ai.google.dev/gemini-api/docs/billing</a>.</p>
                <button
                    onClick={handleSelectKey}
                    className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Select API Key
                </button>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-lg">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange mx-auto mb-6"></div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Generating Your Video...
                    </h1>
                    <p className="text-gray-600 transition-opacity duration-500">
                        {generationStatus}
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-blue mb-6">AI Video Generator</h1>
            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">

                {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

                {generatedVideoUrl && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-blue">Your Generated Video</h2>
                        <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg shadow-md"></video>
                        <button
                            onClick={() => setGeneratedVideoUrl(null)}
                            className="w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Create Another Video
                        </button>
                    </div>
                )}

                {!generatedVideoUrl && (
                    <form onSubmit={(e) => { e.preventDefault(); handleGenerateVideo(); }} className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-gray-700">Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                                rows={4}
                                placeholder="Describe the video you want to create..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-lg font-semibold mb-2 text-gray-700">Starting Image (Optional)</label>
                             {!imageFile ? (
                                <label htmlFor="image-upload" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                        <UploadIcon />
                                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                             ) : (
                                <div className="relative group">
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-lg" />
                                    <button
                                        onClick={() => setImageFile(null)}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                             )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-lg font-semibold mb-2 text-gray-700">Aspect Ratio</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setAspectRatio('16:9')} className={`flex-1 p-3 rounded-md font-semibold transition ${aspectRatio === '16:9' ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-700'}`}>16:9 (Landscape)</button>
                                    <button type="button" onClick={() => setAspectRatio('9:16')} className={`flex-1 p-3 rounded-md font-semibold transition ${aspectRatio === '9:16' ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-700'}`}>9:16 (Portrait)</button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-lg font-semibold mb-2 text-gray-700">Resolution</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setResolution('720p')} className={`flex-1 p-3 rounded-md font-semibold transition ${resolution === '720p' ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-700'}`}>720p</button>
                                    <button type="button" onClick={() => setResolution('1080p')} className={`flex-1 p-3 rounded-md font-semibold transition ${resolution === '1080p' ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-700'}`}>1080p</button>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={isGenerating || !prompt.trim()} className="w-full bg-brand-orange text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <VideoIcon />
                            Generate Video
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VideoGenerator;