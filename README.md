# 24/7 Store - E-Commerce Web Application

A modern, full-stack e-commerce web application for a convenience store, built with React, Express, and integrated with multiple cloud services.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Zustand** for state management
- **Sanity CMS** for content management
- **PostHog** for product analytics
- **Sentry** for error tracking

### Backend
- **Express.js** with TypeScript
- **Node.js 20+**
- **Supabase** for database and authentication
- **Sentry** for backend error tracking

### DevOps & Security
- **Netlify** for frontend deployment
- **Snyk** for vulnerability scanning
- **GitHub Actions** for CI/CD

## Project Structure

```
24-7-store/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Third-party integrations
│   │   └── store/         # Zustand state management
│   └── package.json
├── backend/               # Express backend API
│   ├── src/
│   │   └── index.ts       # Main server file
│   └── package.json
├── sanity-studio/         # Sanity CMS schema definitions
├── supabase-schema.sql    # Database schema
├── netlify.toml           # Netlify deployment config
└── .github/workflows/     # GitHub Actions workflows
```

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- Accounts for:
  - Supabase (database)
  - Sanity (CMS)
  - PostHog (analytics)
  - Sentry (error tracking)
  - Snyk (security scanning)
  - Netlify (deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 24-7-store
```

### 2. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase-schema.sql` to create the orders table
4. Get your project URL and anon key from Settings > API

### 3. Set Up Sanity CMS

```bash
# Navigate to a temporary directory
cd sanity-studio

# Create a new Sanity project
npm create sanity@latest -- --template clean --create-project "24/7 Store" --dataset production

# Copy the schema definitions from sanity-schemas.ts into your new Sanity project
# Update sanity.config.ts to include the schemas

# Deploy the Sanity Studio
npm run deploy
```

Copy your Sanity project ID and dataset name for the environment variables.

### 4. Set Up PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Create a new project
3. Get your Project API Key from Project Settings

### 5. Set Up Sentry

1. Sign up at [sentry.io](https://sentry.io)
2. Create two projects: one for frontend (React) and one for backend (Node.js)
3. Get the DSN for each project

### 6. Set Up Snyk

1. Sign up at [snyk.io](https://snyk.io)
2. Get your API token from Account Settings
3. Add `SNYK_TOKEN` to your GitHub repository secrets

### 7. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your actual values
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_SANITY_PROJECT_ID=your_sanity_project_id
# VITE_SANITY_DATASET=production
# VITE_SANITY_API_VERSION=2024-01-01
# VITE_POSTHOG_KEY=your_posthog_key
# VITE_POSTHOG_HOST=https://app.posthog.com
# VITE_SENTRY_DSN=your_frontend_sentry_dsn
# VITE_API_URL=http://localhost:3001

# Start development server
npm run dev
```

### 8. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your actual values
# PORT=3001
# NODE_ENV=development
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_KEY=your_supabase_service_key
# SENTRY_DSN=your_backend_sentry_dsn

# Start development server
npm run dev
```

### 9. Deploy to Netlify

1. Push your code to GitHub
2. Sign up at [netlify.com](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Netlify will automatically detect `netlify.toml` configuration
6. Add environment variables in Site settings > Environment variables
7. Deploy!

For the backend, consider deploying to:
- Railway
- Render
- Fly.io
- AWS/GCP/Azure

Update the backend URL in your frontend environment variables and `netlify.toml`.

## Content Management

### Adding Products

1. Go to your Sanity Studio (deployed URL or `localhost:3333`)
2. Navigate to "Product" in the sidebar
3. Click "Create new Product"
4. Fill in:
   - Product Name
   - Description
   - Price
   - Upload Image
   - Select Category
   - Set In Stock status
5. Publish

### Updating Hero Section

1. In Sanity Studio, go to "Hero Section"
2. Update:
   - Title
   - Subtitle
   - Background Image
   - CTA Button Text
3. Publish

### Updating Store Information

1. In Sanity Studio, go to "Store Information"
2. Update store details
3. Publish

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm start            # Start production server
```

## Environment Variables

### Frontend (.env)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_SANITY_PROJECT_ID` - Sanity project ID
- `VITE_SANITY_DATASET` - Sanity dataset name
- `VITE_SANITY_API_VERSION` - Sanity API version
- `VITE_POSTHOG_KEY` - PostHog project API key
- `VITE_POSTHOG_HOST` - PostHog host URL
- `VITE_SENTRY_DSN` - Sentry frontend DSN
- `VITE_API_URL` - Backend API URL

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `SENTRY_DSN` - Sentry backend DSN

## Features

### Customer Features
- Browse products by category
- Add products to cart
- Adjust quantities in cart
- Place orders with delivery information
- Responsive design for mobile and desktop

### Analytics & Monitoring
- **PostHog**: Track user behavior, page views, product interactions
- **Sentry**: Monitor errors and performance issues
- **Snyk**: Automated vulnerability scanning

### Admin Features (Backend API)
- GET `/api/orders` - List all orders
- GET `/api/orders/:id` - Get single order
- PATCH `/api/orders/:id` - Update order status

## Security

- HTTPS enforced on Netlify
- Row-level security on Supabase
- Environment variables for sensitive data
- CORS configured for API
- Security headers configured in Netlify
- Regular vulnerability scans with Snyk

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass and no security vulnerabilities
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
