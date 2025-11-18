/**
 * Edit Slide Image Edge Function
 * 
 * Edits existing image with text prompt using Gemini Flash Image model.
 * Following Supabase Edge Functions best practices.
 */

import { GoogleGenAI } from "npm:@google/genai@1.29.0"
import { corsHeaders, handleCORS } from "../_shared/cors.ts"
import { createErrorResponse, getRequiredEnv } from "../_shared/errors.ts"

console.info('edit-slide-image function started')

Deno.serve(async (req: Request) => {
  const corsResponse = handleCORS(req)
  if (corsResponse) return corsResponse

  try {
    const GEMINI_API_KEY = getRequiredEnv('GEMINI_API_KEY')
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const { base64ImageData, mimeType, prompt } = await req.json()

    if (!base64ImageData || !mimeType || !prompt) {
      throw new Error('Missing required fields: base64ImageData, mimeType, prompt')
    }

    // Remove data URL prefix if present (handle both full data URLs and base64-only strings)
    let imageData: string
    if (typeof base64ImageData === 'string') {
      // Check if it's a data URL (starts with data:)
      if (base64ImageData.startsWith('data:')) {
        // Extract base64 part after the comma
        const commaIndex = base64ImageData.indexOf(',')
        if (commaIndex !== -1) {
          imageData = base64ImageData.substring(commaIndex + 1)
        } else {
          throw new Error('Invalid data URL format: missing comma separator')
        }
      } else {
        // Already base64 string, use as-is
        imageData = base64ImageData
      }
    } else {
      throw new Error('base64ImageData must be a string')
    }

    // Build editing prompt following Nano Banana best practices:
    // - Use descriptive, narrative language (not keyword lists)
    // - Provide clear context about what to change
    // - Use photographic/cinematic language when appropriate
    // - Be specific about desired outcome
    const editingPrompt = `Edit the provided image according to this instruction: ${prompt}. 
    
    Maintain the original composition and style while applying the requested changes. 
    Preserve the aspect ratio (16:9) and overall visual coherence. 
    Ensure the edited image maintains professional quality suitable for a pitch deck slide.`

    // Generate edited image using Nano Banana (gemini-2.5-flash-image)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: editingPrompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: imageData,
          },
        },
      ],
      config: {
        responseModalities: ['Image'],
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    })

    // Extract base64 image from response
    // Handle both direct parts array and candidates[0].content.parts structure
    let base64ImageOutput = ''
    
    // Try direct parts first (if response.parts exists)
    if (response.parts && Array.isArray(response.parts)) {
      for (const part of response.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Extract raw base64 data (may already have prefix, so strip it)
          const rawData = part.inlineData.data
          base64ImageOutput = rawData.startsWith('data:') 
            ? rawData.split(',')[1] || rawData 
            : rawData
          break
        }
      }
    }
    
    // Try candidates[0].content.parts if direct parts didn't work
    if (!base64ImageOutput && response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const rawData = part.inlineData.data
          base64ImageOutput = rawData.startsWith('data:') 
            ? rawData.split(',')[1] || rawData 
            : rawData
          break
        }
      }
    }

    if (!base64ImageOutput) {
      console.error('No image found in response')
      console.error('Response structure:', JSON.stringify(response, null, 2))
      console.error('Response parts:', response.parts)
      console.error('Response candidates:', response.candidates)
      throw new Error('No edited image generated in response')
    }

    console.info('Successfully extracted edited image, length:', base64ImageOutput.length)

    // Return base64 string only (frontend will add data URL prefix)
    return new Response(
      JSON.stringify({ base64Image: base64ImageOutput }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )

  } catch (error) {
    console.error('edit-slide-image error:', error)
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return createErrorResponse(error)
  }
})
