// index.ts — Supabase Edge Function

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.1'
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

// ✅ Allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',             // Local dev
  'https://alfa-lands-host.vercel.app' // Your deployed Vercel frontend
];

// ✅ Helper: Generate CORS headers if allowed
function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }

  // ❌ Not allowed
  return null;
}

// ✅ Serve function
serve(async (req) => {
  console.log("Function 'authenticate-user' invoked.");

  const corsHeaders = getCorsHeaders(req);

  if (!corsHeaders) {
    console.warn("Blocked request from disallowed origin.");
    return new Response('Origin not allowed', { status: 403 });
  }

  // ✅ Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    console.log("Handling preflight OPTIONS request.");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    console.warn(`Method Not Allowed: ${req.method}`);
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { username, password } = await req.json();
    console.log(`Login attempt for: ${username}`);

    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Username and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get('PROJECT_URL');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables!");
      return new Response(JSON.stringify({ success: false, message: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, username, password, role')
      .eq('username', username)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Database query error:', userError.message);
    }

    let userFound = null;
    let userRole = null;
    let userId = null;

    if (userData) {
      if (password === userData.password) {
        userFound = userData;
        userId = userData.id;

        if (userData.role === 'admin') {
          userRole = 'admin';
        } else if (
          ['executive team', 'marketing team', 'agent', 'inspector', 'supervise team'].includes(userData.role)
        ) {
          userRole = 'agent';
        } else {
          userRole = 'unknown';
        }
      }
    }

    if (userFound && userRole && userRole !== 'unknown') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Login successful',
        role: userRole,
        agent_id: userId,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid username or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
