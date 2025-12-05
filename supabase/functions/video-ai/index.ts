import { GoogleGenAI } from "npm:@google/genai@1.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set. Configure it in Supabase Dashboard > Edge Functions > Secrets.");
    }

    const ai = new GoogleGenAI({ apiKey });

    switch (action) {
      case 'generate': {
        // Generate a new video from prompt (and optional image)
        const { prompt, imageBytes, mimeType, aspectRatio, resolution } = params;
        
        if (!prompt || prompt.trim().length === 0) {
          throw new Error("Prompt is required for video generation.");
        }

        // Build image payload if provided
        let imagePayload: { imageBytes: string; mimeType: string } | undefined = undefined;
        if (imageBytes && mimeType) {
          imagePayload = { imageBytes, mimeType };
        }

        console.log('Starting video generation:', { 
          promptLength: prompt.length, 
          hasImage: !!imagePayload,
          aspectRatio,
          resolution 
        });

        // Start video generation
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          image: imagePayload,
          config: {
            numberOfVideos: 1,
            resolution: resolution || '720p',
            aspectRatio: aspectRatio || '16:9',
          }
        });

        // Return operation name for polling (don't block on completion)
        return new Response(JSON.stringify({ 
          operationName: operation.name,
          status: 'started',
          message: 'Video generation started. Use poll action to check status.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'poll': {
        // Poll for operation status
        const { operationName } = params;
        
        if (!operationName) {
          throw new Error("operationName is required for polling.");
        }

        const operation = await ai.operations.getVideosOperation({ 
          operation: { name: operationName } 
        });

        if (operation.done) {
          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          
          if (!videoUri) {
            throw new Error("Video generation completed but no video URI found.");
          }

          // For security, we'll fetch the video server-side and return as base64
          // This avoids exposing the API key in the download URL
          try {
            const videoResponse = await fetch(`${videoUri}&key=${apiKey}`);
            
            if (!videoResponse.ok) {
              throw new Error(`Failed to download video: ${videoResponse.status}`);
            }

            const videoArrayBuffer = await videoResponse.arrayBuffer();
            const videoBase64 = btoa(
              new Uint8Array(videoArrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte), 
                ''
              )
            );

            return new Response(JSON.stringify({ 
              done: true,
              videoBase64,
              mimeType: 'video/mp4',
              // Also return operation data for extension support
              operationData: {
                name: operation.name,
                video: operation.response?.generatedVideos?.[0]?.video
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } catch (downloadError: any) {
            console.error('Video download failed:', downloadError);
            throw new Error(`Video generated but download failed: ${downloadError.message}`);
          }
        } else {
          return new Response(JSON.stringify({ 
            done: false,
            status: 'processing',
            message: 'Video is still being generated. Poll again in 10 seconds.'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'extend': {
        // Extend an existing video
        const { prompt, operationData, aspectRatio } = params;
        
        if (!prompt || prompt.trim().length === 0) {
          throw new Error("Extension prompt is required.");
        }

        if (!operationData?.video) {
          throw new Error("Previous video operation data is required for extension.");
        }

        console.log('Starting video extension:', { promptLength: prompt.length });

        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: prompt,
          video: operationData.video,
          config: {
            numberOfVideos: 1,
            resolution: '720p', // Extension only supports 720p
            aspectRatio: aspectRatio || '16:9',
          }
        });

        return new Response(JSON.stringify({ 
          operationName: operation.name,
          status: 'started',
          message: 'Video extension started. Use poll action to check status.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}. Supported actions: generate, poll, extend`);
    }

  } catch (error: any) {
    console.error('Video AI error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Provide helpful error messages
    let userMessage = error.message || 'An unknown error occurred';
    
    if (error.message?.includes('API key')) {
      userMessage = 'API key error. Please check GEMINI_API_KEY configuration.';
    } else if (error.message?.includes('quota')) {
      userMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
    } else if (error.message?.includes('not found')) {
      userMessage = 'Video operation not found. It may have expired. Please generate a new video.';
    }

    return new Response(JSON.stringify({ 
      error: userMessage,
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
