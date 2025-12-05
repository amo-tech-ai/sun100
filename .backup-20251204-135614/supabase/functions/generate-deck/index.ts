import { GoogleGenAI, Type } from "npm:@google/genai@1.29.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateDeckOutlineFunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a strategic, investor-ready 10-slide pitch deck outline tailored to the specific startup stage and industry.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A professional, catchy title for the pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of 10 slide objects forming a cohesive narrative arc.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The headline of the slide.' },
                        content: { type: Type.STRING, description: 'The slide body content, concise and impact-oriented, with bullet points separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: 'A highly detailed, style-specific image generation prompt for the slide visual.' },
                        type: { type: Type.STRING, description: "The specific category of the slide (e.g., 'problem', 'solution', 'traction')." }
                    },
                    required: ['title', 'content', 'imageUrl', 'type']
                }
            }
        },
        required: ['title', 'slides']
    }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessContext, companyDetails, deckType, theme, orgId, userId, startupId, urls } = await req.json();
    
    // Validate required inputs
    if (!businessContext || businessContext.trim().length === 0) {
      throw new Error('businessContext is required');
    }
    if (!deckType) {
      throw new Error('deckType is required');
    }
    if (!theme) {
      throw new Error('theme is required');
    }
    
    // Get user from auth header (if provided)
    const authHeader = req.headers.get('authorization');
    let userOrgId = orgId;
    let userUserId = userId;
    
    if (authHeader) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (!authError && user) {
        userUserId = user.id;
        
        // Get user's org_id from org_members
        const { data: membership } = await supabase
          .from('org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .limit(1)
          .single();
        
        if (membership) {
          userOrgId = membership.org_id;
        }
      }
    }
    
    // Validate org_id is available (required for database insert)
    if (!userOrgId) {
      console.warn('No org_id available, deck will not be saved to database');
    }
    
    // Validate API key
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey || apiKey.trim().length === 0) {
      console.error('GEMINI_API_KEY is not set or is empty');
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    const isSalesDeck = deckType === 'Sales Deck';

    let prompt = '';
    let toolConfig = {};
    let targetFunction = '';

    if (isSalesDeck) {
        // Sales deck generation not yet implemented - fall through to investor deck
        targetFunction = 'generateDeckOutline';
        toolConfig = { tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }] };
        prompt = `
            You are a world-class Sales Engineer and Copywriter.
            Your goal is to create a persuasive Sales Deck that closes deals.
            
            **Product/Context:**
            ${businessContext}
            
            **Target Audience:** ${companyDetails?.targetAudience || 'Potential Customers'}
            
            **Structure (Hook-Villain-Hero):**
            1. **Hook:** Grab attention immediately.
            2. **Villain:** Personify the problem/pain point.
            3. **Hero:** Introduce the product as the savior.
            4. **Proof:** Case studies/metrics.
            5. **Ask:** Clear call to action.
            
            **Theme:** ${theme}
            
            Call 'generateSalesDeck' to return the structure.
        `;
    } else {
        targetFunction = 'generateDeckOutline';
        toolConfig = { 
            tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }]
        };
        prompt = `
        You are a ruthless Venture Capital Analyst and expert storyteller. 
            Your goal is to create a ${deckType || 'Investor Pitch'} that secures funding.
        
        **Startup Context:**
        ${businessContext}
        
        ${companyDetails ? `**Company Details:**
        Name: ${companyDetails.name}
        Industry: ${companyDetails.industry}
        Stage: ${companyDetails.stage}
        Revenue Model: ${companyDetails.revenueModel}
        Traction: ${companyDetails.traction}
        Team Size: ${companyDetails.teamSize}
        ` : ''}
        
        **Strategic Instructions:**
            1. **Actionable Insights Only:** Avoid generic fluff. Use concrete statements.
            2. **Visual Logic:** Generate highly detailed image prompts.
            3. **Traction Focus:** Extract and highlight key metrics.
            4. **Narrative Flow:** Hook -> Problem -> Solution -> Evidence -> Market -> Ask.
            5. **Problem Slide:** Be specific about the pain point friction.
            6. **Solution Slide:** Map features directly to pain points.
        
        **Theme:** ${theme}
        
            Call 'generateDeckOutline' to return the structured data.
    `;
    }

    console.log('Calling Gemini API with model: gemini-3-pro-preview');

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
              thinkingLevel: 'high'
          }
      });
    } catch (apiError: any) {
      console.error('Gemini API call failed:', {
        message: apiError.message,
        status: apiError.status,
        statusText: apiError.statusText,
        stack: apiError.stack
      });
      
      if (apiError.message?.includes('API key') || apiError.status === 401 || apiError.status === 403) {
        throw new Error('Invalid or missing Gemini API key. Please check GEMINI_API_KEY environment variable.');
      }
      if (apiError.message?.includes('quota') || apiError.message?.includes('rate limit')) {
        throw new Error('Gemini API quota exceeded or rate limit reached. Please check your API usage.');
      }
      throw new Error(`Gemini API error: ${apiError.message || 'Unknown error'}`);
    }

    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      console.error('No function call in response:', {
        text: response.text,
        candidates: response.candidates
      });
      throw new Error("AI response did not contain a function call. Response: " + (response.text || 'No text response'));
    }

    if (functionCall.name !== 'generateDeckOutline') {
      console.error('Unexpected function call:', functionCall.name);
      throw new Error(`Unexpected function call: ${functionCall.name}. Expected: generateDeckOutline`);
    }

    if (!functionCall.args || !functionCall.args.title || !functionCall.args.slides) {
      console.error('Invalid function call args:', functionCall.args);
      throw new Error("AI function call missing required fields (title or slides)");
    }

    // Prepare deck data
    const deckTitle = functionCall.args.title;
    const deckSlides = (functionCall.args.slides as any[]).map((s, i) => ({
        position: i,
        title: s.title,
        content: s.content,
        image_url: s.imageUrl,
        type: s.type || 'generic',
        chart_data: null,
        table_data: null
    }));
    
    // Save to database if org_id is available
    let savedDeckId: string | null = null;
    
    if (userOrgId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        
        // Insert deck
        const { data: deck, error: deckError } = await supabase
          .from('decks')
          .insert({
            org_id: userOrgId,
            user_id: userUserId,
            startup_id: startupId || null,
            title: deckTitle,
            template: theme,
            status: 'draft',
            meta: {
              source_urls: urls || [],
              deck_type: deckType,
              generated_at: new Date().toISOString(),
              company_details: companyDetails || null
            }
          })
          .select('id')
          .single();
        
        if (deckError) {
          console.error('Failed to insert deck:', deckError);
          throw new Error(`Database error: ${deckError.message}`);
        }
        
        savedDeckId = deck.id;
        
        // Insert slides in batch
        const slidesToInsert = deckSlides.map(slide => ({
          deck_id: savedDeckId,
          ...slide
        }));
        
        const { error: slidesError } = await supabase
          .from('slides')
          .insert(slidesToInsert);
        
        if (slidesError) {
          console.error('Failed to insert slides:', slidesError);
          // Rollback deck if slides fail
          await supabase.from('decks').delete().eq('id', savedDeckId);
          throw new Error(`Failed to save slides: ${slidesError.message}`);
        }
        
        console.log('Deck saved to database successfully:', { 
          deckId: savedDeckId, 
          slideCount: deckSlides.length 
        });
      } catch (dbError: any) {
        console.error('Database save error:', dbError);
        // Continue with response even if DB save fails (fallback to sessionStorage)
        console.warn('Falling back to sessionStorage mode');
      }
    }
    
    // Prepare response (maintain backward compatibility)
         const generatedDeck = {
        id: savedDeckId || `deck-${Date.now()}`,
        title: deckTitle,
             template: theme,
        slides: deckSlides.map((s, i) => ({
            id: savedDeckId ? `slide-${savedDeckId}-${i}` : `slide-${Date.now()}-${i}`,
            position: s.position,
            title: s.title,
            content: s.content,
            imageUrl: s.image_url,
            type: s.type
             }))
         };
         
    console.log('Deck generation completed:', { 
      deckId: generatedDeck.id, 
      savedToDb: !!savedDeckId,
      slideCount: generatedDeck.slides.length 
    });
    
    return new Response(JSON.stringify({ 
      generatedDeck,
      deckId: savedDeckId || generatedDeck.id,
      savedToDatabase: !!savedDeckId
    }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         });

  } catch (error: any) {
    console.error('Generate deck error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    // Provide more detailed error message
    const errorMessage = error.message || 'Unknown error occurred';
    const isApiKeyError = errorMessage.includes('API') || errorMessage.includes('key') || errorMessage.includes('401') || errorMessage.includes('403');
    const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout');
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: isApiKeyError ? 'API key may be missing or invalid. Check GEMINI_API_KEY environment variable.' : 
               isNetworkError ? 'Network error connecting to Gemini API.' :
               'Deck generation failed. Check logs for details.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
