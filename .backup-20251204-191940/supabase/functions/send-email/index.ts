import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In production, this will be available via Supabase Secrets
// For local testing or mockup, it might be undefined
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
        throw new Error("Missing required email fields.");
    }

    if (RESEND_API_KEY) {
        console.log(`[RESEND] Sending email to: ${to}`);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev', // Use your verified domain in production
            to: to,
            subject: subject,
            html: body.replace(/\n/g, '<br>')
          })
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Resend API Error: ${errorText}`);
        }
        
        const data = await res.json();
        return new Response(JSON.stringify({ success: true, message: "Email sent via Resend", id: data.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } else {
        // --- MOCK SENDING LOGIC (Fallback) ---
        console.log(`[MOCK EMAIL SENDER] Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body.substring(0, 50)}...`);
        
        // Simulate API latency
        await new Promise(r => setTimeout(r, 1000));

        return new Response(JSON.stringify({ success: true, message: "Email queued successfully (Mock - No API Key)" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});