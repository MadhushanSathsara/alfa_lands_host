// index.ts — Supabase Edge Function

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.1';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// Allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://alfa-lands-host.vercel.app'
];

// Strict dynamic CORS
function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin');
  console.log('Request Origin:', origin);

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }
  return null;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (!corsHeaders) {
    console.warn("Blocked disallowed origin");
    return new Response("Not allowed", { status: 403 });
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Your handler code...
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
});
