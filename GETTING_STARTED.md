# Getting Started with 24/7 Store

## 🎯 What You Have

A complete, production-ready e-commerce application with:

✅ **Frontend**: React 19 + TypeScript + Vite
✅ **Backend**: Express + Node.js + TypeScript
✅ **Database**: Supabase (PostgreSQL)
✅ **CMS**: Sanity for content management
✅ **Analytics**: PostHog for user tracking
✅ **Monitoring**: Sentry for error tracking
✅ **Security**: Snyk for vulnerability scanning
✅ **Deployment**: Netlify configuration ready

## 🚀 Three Ways to Get Started

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
./setup.sh

# Edit your environment files
nano frontend/.env
nano backend/.env

# Start development
npm run dev
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm run install:all

# Copy environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Edit with your API keys
# ... edit frontend/.env
# ... edit backend/.env

# Start development
npm run dev
```

### Option 3: Step-by-Step Guide
Follow the detailed guide in `QUICKSTART.md` (10 minutes)

## 📋 Required API Keys

Before you can run the app, you need to create accounts and get API keys from:

| Service | Sign Up URL | What You Need |
|---------|-------------|---------------|
| **Supabase** | https://supabase.com | Project URL + Anon Key + Service Key |
| **Sanity** | https://sanity.io | Project ID |
| **PostHog** | https://posthog.com | API Key (optional) |
| **Sentry** | https://sentry.io | DSN for frontend & backend (optional) |
| **Snyk** | https://snyk.io | API Token (for CI/CD) |

**Note**: PostHog and Sentry are optional for local development. The app will work without them, you just won't get analytics and error tracking.

## ⚡ Quick Commands

```bash
# Setup everything
./setup.sh

# Run both frontend and backend
npm run dev

# Run only frontend (port 5173)
npm run dev:frontend

# Run only backend (port 3001)
npm run dev:backend

# Install all dependencies
npm run install:all

# Build for production
npm run build
```

## 🌐 Access Points

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Orders API**: http://localhost:3001/api/orders

## 📁 Project Structure

```
24-7-store/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Header, ProductCard
│   │   ├── pages/      # Home, Products, Cart
│   │   ├── lib/        # API integrations
│   │   └── store/      # State management
│   └── .env            # Frontend config
│
├── backend/            # Express API
│   ├── src/
│   │   └── index.ts    # API server
│   └── .env            # Backend config
│
├── sanity-studio/      # CMS schemas
├── .github/workflows/  # CI/CD pipelines
│
└── Documentation
    ├── README.md           # Full guide
    ├── QUICKSTART.md       # 10-min guide
    ├── ARCHITECTURE.md     # System design
    └── PROJECT_SUMMARY.md  # What's included
```

## 🗄️ Database Setup

1. Create a Supabase account
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the content from `supabase-schema.sql`
5. Click "Run"
6. Get your credentials from Settings → API

## 📝 Content Setup (Sanity)

1. Create a Sanity account
2. Run: `npm create sanity@latest`
3. Follow the prompts to create a project
4. Copy the schemas from `sanity-studio/sanity-schemas.ts` to your Sanity project
5. Add content:
   - Hero section (title, subtitle, image)
   - Store info (name, hours, contact)
   - Products (name, price, image, category)

## 🎨 Customization

### Colors
Edit inline styles in component files:
- `frontend/src/components/Header.tsx`
- `frontend/src/components/ProductCard.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Products.tsx`
- `frontend/src/pages/Cart.tsx`

### Product Categories
Edit: `sanity-studio/sanity-schemas.ts` (line 52)

### Order Statuses
Edit: `supabase-schema.sql` (line 15)

### API Endpoints
Edit: `backend/src/index.ts`

## 🔒 Environment Variables

### Frontend (frontend/.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_POSTHOG_KEY=phc_xxxxx (optional)
VITE_POSTHOG_HOST=https://app.posthog.com
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx (optional)
VITE_API_URL=http://localhost:3001
```

### Backend (backend/.env)
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... (service role key!)
SENTRY_DSN=https://xxx@sentry.io/xxx (optional)
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

### Can't See Products
1. Check Sanity project ID is correct
2. Verify products are published in Sanity Studio
3. Check browser console for errors
4. Verify environment variables are loaded

### Orders Not Saving
1. Check Supabase URL and keys
2. Verify database schema was created
3. Check browser Network tab for errors
4. Test with Supabase dashboard

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm run install:all
```

## 📚 Documentation

- **Quick Start**: `QUICKSTART.md` - Get running in 10 minutes
- **Full Guide**: `README.md` - Complete documentation
- **Architecture**: `ARCHITECTURE.md` - System design & diagrams
- **Summary**: `PROJECT_SUMMARY.md` - What's included

## 🚢 Deployment

### Deploy Frontend to Netlify
1. Push code to GitHub
2. Sign up at https://netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Add environment variables in site settings
6. Deploy!

### Deploy Backend
Options:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **AWS/GCP/Azure**: Traditional cloud

Update `VITE_API_URL` in frontend with your backend URL.

## ✅ Testing Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Supabase database created
- [ ] Sanity project created
- [ ] Content added to Sanity
- [ ] Frontend starts on port 5173
- [ ] Backend starts on port 3001
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can place order
- [ ] Order appears in Supabase

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review the full documentation in `README.md`
3. Check the architecture guide in `ARCHITECTURE.md`
4. Look at the example code in the source files
5. Check the service documentation:
   - Supabase: https://supabase.com/docs
   - Sanity: https://sanity.io/docs
   - React: https://react.dev
   - Vite: https://vitejs.dev

## 🎉 Next Steps

Once you have the app running:

1. **Customize the Design**
   - Update colors and styles
   - Add your branding
   - Customize the hero section

2. **Add More Content**
   - Add more products
   - Update store information
   - Add promotional content

3. **Extend Functionality**
   - Add user authentication
   - Add payment processing
   - Create admin dashboard
   - Add email notifications

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Netlify
   - Set up custom domain
   - Configure SSL

5. **Monitor & Optimize**
   - Check PostHog analytics
   - Review Sentry errors
   - Optimize performance
   - Add more features

---

**Ready?** Run `./setup.sh` to get started! 🚀
