#!/bin/bash

# 24/7 Store - Quick Setup Script
# This script helps you get started quickly

set -e

echo "🏪 24/7 Store - Setup Script"
echo "================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js 20 or higher is required"
    echo "   Current version: $(node -v)"
    echo "   Please upgrade Node.js from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
echo ""

echo "   Installing root dependencies..."
npm install --silent

echo "   Installing frontend dependencies..."
cd frontend && npm install --silent && cd ..

echo "   Installing backend dependencies..."
cd backend && npm install --silent && cd ..

echo "✅ All dependencies installed!"
echo ""

# Check for environment files
echo "🔧 Checking environment configuration..."

FRONTEND_ENV="frontend/.env"
BACKEND_ENV="backend/.env"

if [ ! -f "$FRONTEND_ENV" ]; then
    echo "⚠️  Frontend .env not found"
    echo "   Copying frontend/.env.example to frontend/.env"
    cp frontend/.env.example "$FRONTEND_ENV"
    echo "   ⚠️  Please edit frontend/.env with your API keys"
else
    echo "✅ Frontend .env exists"
fi

if [ ! -f "$BACKEND_ENV" ]; then
    echo "⚠️  Backend .env not found"
    echo "   Copying backend/.env.example to backend/.env"
    cp backend/.env.example "$BACKEND_ENV"
    echo "   ⚠️  Please edit backend/.env with your API keys"
else
    echo "✅ Backend .env exists"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your environment variables:"
echo "   - Edit frontend/.env with your Supabase, Sanity, PostHog, and Sentry keys"
echo "   - Edit backend/.env with your Supabase and Sentry keys"
echo ""
echo "2. Set up your services:"
echo "   - Supabase: Create project and run supabase-schema.sql"
echo "   - Sanity: Create project and add schemas from sanity-studio/sanity-schemas.ts"
echo "   - PostHog: Create project and get API key"
echo "   - Sentry: Create projects and get DSN keys"
echo ""
echo "3. Start development:"
echo "   npm run dev"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - QUICKSTART.md (10-minute guide)"
echo "   - README.md (full documentation)"
echo "   - ARCHITECTURE.md (system design)"
echo ""
echo "Happy coding! 🚀"
