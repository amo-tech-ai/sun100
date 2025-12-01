
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This is a mock implementation. In production, use Resend or SendGrid.
// const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
        throw new Error("Missing required email fields.");
    }

    // --- MOCK SENDING LOGIC ---
    console.log(`[MOCK EMAIL SENDER] Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body.substring(0, 50)}...`);
    
    // Simulate API latency
    await new Promise(r => setTimeout(r, 1000));

    /* 
    // Real Implementation Example with Resend:
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: body.replace(/\n/g, '<br>')
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    */

    return new Response(JSON.stringify({ success: true, message: "Email queued successfully (Mock)" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
