#!/bin/bash

# Sun AI Startup Platform - Supabase Deployment Script
# Usage: ./scripts/deploy-supabase.sh

set -e

echo "🚀 Sun AI Startup Platform - Supabase Deployment"
echo "=================================================="

# Check for supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in
echo ""
echo "📋 Step 1: Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Run:"
    echo "   supabase login"
    exit 1
fi
echo "✅ Logged in to Supabase"

# Link project (if not already linked)
echo ""
echo "📋 Step 2: Linking to Supabase project..."
if [ ! -f "supabase/.temp/project-ref" ]; then
    echo "⚠️  Project not linked. Run:"
    echo "   supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "To find your project ref, go to Supabase Dashboard > Settings > General"
    exit 1
fi
PROJECT_REF=$(cat supabase/.temp/project-ref)
echo "✅ Linked to project: $PROJECT_REF"

# Set secrets
echo ""
echo "📋 Step 3: Setting Edge Function secrets..."
echo ""
echo "Enter your GEMINI_API_KEY (or press Enter to skip):"
read -s GEMINI_KEY
if [ -n "$GEMINI_KEY" ]; then
    supabase secrets set GEMINI_API_KEY="$GEMINI_KEY"
    echo "✅ GEMINI_API_KEY set"
else
    echo "⚠️  Skipped GEMINI_API_KEY"
fi

echo ""
echo "Enter your RESEND_API_KEY (or press Enter to skip):"
read -s RESEND_KEY
if [ -n "$RESEND_KEY" ]; then
    supabase secrets set RESEND_API_KEY="$RESEND_KEY"
    echo "✅ RESEND_API_KEY set"
else
    echo "⚠️  Skipped RESEND_API_KEY"
fi

# Push database migrations
echo ""
echo "📋 Step 4: Pushing database migrations..."
supabase db push
echo "✅ Database migrations applied"

# Deploy Edge Functions
echo ""
echo "📋 Step 5: Deploying Edge Functions..."
supabase functions deploy
echo "✅ Edge Functions deployed"

# List deployed functions
echo ""
echo "📋 Deployed Edge Functions:"
supabase functions list

# Output environment variables
echo ""
echo "=================================================="
echo "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "📝 Add these to your Vercel environment variables:"
echo ""
echo "VITE_SUPABASE_URL=$(supabase status --output json 2>/dev/null | grep -o '"API URL":"[^"]*' | cut -d'"' -f4 || echo 'https://YOUR_PROJECT.supabase.co')"
echo "VITE_SUPABASE_ANON_KEY=<get from Supabase Dashboard > Settings > API>"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
