// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Standard Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.1'
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
// REMOVED: import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'; // bcrypt is no longer used

// Define allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // For local development with Vite
  'https://your-vercel-app-name.vercel.app', // IMPORTANT: Replace with your actual Vercel domain AFTER deployment
  // Example: 'https://estate-project-ab1c2d3e.vercel.app'
  // Add other production domains if you have custom domains configured in Vercel
];

// Helper function to dynamically set CORS headers based on the request origin
function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }
  // Fallback for local development or if origin is not in the allowed list
  // In a strict production setup, you might return a 403 Forbidden here if origin is not allowed
  return {
    'Access-Control-Allow-Origin': 'http://localhost:5173', // Default for local testing if no matching origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}


serve(async (req) => {
  console.log("Function 'index' received a request.");

  const corsHeaders = getCorsHeaders(req); // Get dynamic CORS headers

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request.");
    return new Response(null, {
      status: 204, // No Content
      headers: corsHeaders,
    });
  }

  // Ensure it's a POST request for actual login logic
  if (req.method !== 'POST') {
    console.warn(`Method Not Allowed: ${req.method}`);
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { username, password } = await req.json();
    console.log(`Attempting login for username: ${username}`);
    // WARNING: For development only. Storing and comparing plain-text passwords is highly insecure.
    // In a production environment, you MUST hash passwords using bcrypt (or similar) before storing them,
    // and then compare the provided password against the hashed password.
    console.warn("SECURITY WARNING: Comparing passwords without hashing. DO NOT USE IN PRODUCTION!");

    if (!username || !password) {
      console.warn("Missing username or password in request body.");
      return new Response(JSON.stringify({ success: false, message: 'Username and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get('PROJECT_URL');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing Supabase environment variables! Check secrets (PROJECT_URL, SERVICE_ROLE_KEY).");
        return new Response(JSON.stringify({ success: false, message: 'Server configuration error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    // Create a Supabase client with service_role privileges to query the 'users' table directly.
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    console.log("Supabase admin client initialized.");

    let userFound = null;
    let userAssignedRole = null; // This will be the simplified role sent to the frontend ('admin' or 'agent')
    let userId = null;

    console.log(`Querying 'users' table for username: ${username}`);
    // Fetch user data including id, username, password, and their specific role from the database.
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users') // Assuming your user authentication details are in a table named 'users'
      .select('id, username, password, role') // Select the necessary columns
      .eq('username', username) // Filter by the provided username
      .single(); // Expect a single record

    // Handle potential database query errors, but allow to proceed if user not found (error code 'PGRST116')
    if (userError && userError.code !== 'PGRST116') { // 'PGRST116' typically means 'No rows found'
      console.error('Error querying users table:', userError.message);
    }

    // Check if user data was found and the password matches
    if (userData) {
      console.log("User data found. Performing direct password comparison (insecure for production)...");
      const passwordMatch = (password === userData.password); // Direct comparison (replace with bcrypt.compare in production)
      console.log(`Password match result: ${passwordMatch}`);

      if (passwordMatch) {
        userFound = userData;
        userId = userData.id;

        // UPDATED ROLE MAPPING LOGIC FOR STRICT ACCESS CONTROL
        if (userData.role === 'admin') {
            userAssignedRole = 'admin'; // ONLY 'admin' database role gets 'admin' frontend role
            console.log(`User ${username} (DB Role: ${userData.role}) assigned frontend role: 'admin'`);
        } else if (
            userData.role === 'executive team' ||
            userData.role === 'marketing team' ||
            userData.role === 'agent' ||
            userData.role === 'inspector' ||
            userData.role === 'supervise team'
        ) {
            // All other specified roles map to 'agent' frontend role
            userAssignedRole = 'agent';
            console.log(`User ${username} (DB Role: ${userData.role}) assigned frontend role: 'agent'`);
        } else {
            userAssignedRole = 'unknown'; // Fallback for any unhandled or unrecognized roles
            console.warn(`Unrecognized database role for user ${username}: ${userData.role}. Assigned frontend role: 'unknown'.`);
        }
      }
    } else {
      console.log(`No user found with username: ${username} or password mismatch.`);
    }

    // If a user was found and assigned a valid role, return success
    if (userFound && userAssignedRole && userAssignedRole !== 'unknown') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Login successful',
        role: userAssignedRole, // Return the simplified role ('admin' or 'agent')
        agent_id: userId, // Keeping agent_id as the key for frontend consistency
      }), {
        status: 200,
        headers: corsHeaders, // Use the dynamic CORS headers
      });
    } else {
      console.log(`Login failed for username: ${username}: Invalid credentials or unassigned role.`);
      return new Response(JSON.stringify({ success: false, message: 'Invalid username or password.' }), {
        status: 401, // Unauthorized
        headers: corsHeaders, // Use the dynamic CORS headers
      });
    }

  } catch (error) {
    console.error('Unhandled Edge Function error:', error.message, error.stack);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), {
      status: 500,
      headers: corsHeaders, // Use the dynamic CORS headers
    });
  }
});
