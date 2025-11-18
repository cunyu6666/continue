# Quick Start Guide - 24/7 Store

Get the application running locally in under 10 minutes!

## Prerequisites

- Node.js 20+ installed
- Git installed
- Terminal/Command line access

## Step 1: Install Dependencies (2 min)

```bash
# Navigate to project root
cd 24-7-store

# Install all dependencies (root, frontend, and backend)
npm run install:all
```

## Step 2: Set Up Environment Variables (3 min)

### Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_POSTHOG_KEY=phc_your_key
VITE_POSTHOG_HOST=https://app.posthog.com
VITE_SENTRY_DSN=https://your_sentry_dsn
VITE_API_URL=http://localhost:3001
```

### Backend Environment

```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
SENTRY_DSN=https://your_backend_sentry_dsn
```

## Step 3: Set Up Supabase Database (2 min)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy and run the SQL from `supabase-schema.sql`
5. Get your credentials from Settings > API

## Step 4: Set Up Sanity CMS (3 min)

```bash
# Create new Sanity project
npm create sanity@latest

# Follow prompts:
# - Project name: "24/7 Store"
# - Use default dataset: Yes
# - Project template: Clean
```

After setup:
1. Copy schemas from `sanity-studio/sanity-schemas.ts` to your Sanity project
2. Add schemas to `sanity.config.ts`
3. Deploy: `sanity deploy`
4. Get your project ID from `sanity.config.ts`

## Step 5: Optional Third-Party Services (5 min)

### PostHog (Analytics)
1. Sign up at [posthog.com](https://posthog.com)
2. Create project
3. Copy API key to `VITE_POSTHOG_KEY`

### Sentry (Error Tracking)
1. Sign up at [sentry.io](https://sentry.io)
2. Create React project (frontend)
3. Create Node.js project (backend)
4. Copy DSNs to environment files

### Snyk (Security)
1. Sign up at [snyk.io](https://snyk.io)
2. Get API token
3. Add to GitHub secrets as `SNYK_TOKEN`

## Step 6: Run the Application (1 min)

### Option A: Run Both (Recommended)
```bash
# From project root
npm run dev
```

This starts both frontend (port 5173) and backend (port 3001)

### Option B: Run Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Step 7: Access the Application

Open your browser to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Next Steps

### Add Sample Content in Sanity

1. Go to your Sanity Studio URL (shown after `sanity deploy`)
2. Add a Hero section:
   - Title: "Welcome to 24/7 Store"
   - Subtitle: "Your neighborhood convenience store, always open"
   - Upload a background image
   - CTA Text: "Shop Now"

3. Add Store Info:
   - Store Name: "24/7 Convenience Store"
   - Tagline: "Always here when you need us"
   - Hours: "Open 24/7"
   - Phone: "(555) 123-4567"
   - Address: "123 Main St, City, State"

4. Add Products:
   - Create 5-10 sample products
   - Add names, descriptions, prices
   - Upload product images
   - Set categories (snacks, beverages, etc.)
   - Mark as In Stock

### Test the Application

1. Browse products on the home page
2. Filter products by category
3. Add items to cart
4. Adjust quantities
5. Place a test order
6. Check Supabase dashboard to see the order

### Deploy to Production

Follow the deployment guide in README.md:
- Push code to GitHub
- Connect to Netlify
- Add environment variables
- Deploy backend to Railway/Render/Fly.io
- Update `VITE_API_URL` with production backend URL

## Troubleshooting

### Frontend won't start
- Check Node version: `node --version` (should be 20+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 5173 is not in use

### Backend won't start
- Check .env file exists and has correct values
- Check Supabase credentials
- Check port 3001 is not in use
- Check logs for specific errors

### Can't see products
- Verify Sanity project ID is correct
- Check products are published in Sanity Studio
- Check browser console for errors
- Verify CORS settings in Sanity project

### Orders not saving
- Verify Supabase URL and keys are correct
- Check Supabase SQL was run correctly
- Check network tab for API errors
- Verify RLS policies in Supabase

## Support

Need help? Check:
- Full documentation in README.md
- GitHub issues
- [Supabase docs](https://supabase.com/docs)
- [Sanity docs](https://www.sanity.io/docs)
- [Vite docs](https://vitejs.dev)

Happy coding! 🚀
