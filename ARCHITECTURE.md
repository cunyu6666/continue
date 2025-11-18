# Architecture Overview - 24/7 Store

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │              React Frontend (Vite)                     │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │   Router    │  │  Components  │  │   Zustand   │ │    │
│  │  │  (Pages)    │  │   (UI/UX)    │  │   (State)   │ │    │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │    │
│  └───────────────────────────────────────────────────────┘    │
└────────────┬────────────────────────────────────┬─────────────┘
             │                                    │
             │ HTTPS                              │ HTTPS
             ▼                                    ▼
┌────────────────────────┐         ┌──────────────────────────┐
│   Express Backend      │         │    Third-Party Services   │
│   (Node.js/TypeScript) │         │                          │
│                        │         │  ┌──────────────────┐    │
│  ┌──────────────────┐ │         │  │  Sanity CMS      │    │
│  │  REST API        │ │         │  │  (Content)       │    │
│  │  - Orders CRUD   │ │         │  └──────────────────┘    │
│  │  - Health Check  │ │         │                          │
│  └──────────────────┘ │         │  ┌──────────────────┐    │
│                        │         │  │  PostHog         │    │
│  ┌──────────────────┐ │         │  │  (Analytics)     │    │
│  │  Middleware      │ │         │  └──────────────────┘    │
│  │  - CORS          │ │         │                          │
│  │  - Sentry        │ │         │  ┌──────────────────┐    │
│  └──────────────────┘ │         │  │  Sentry          │    │
└────────────┬───────────┘         │  │  (Errors)        │    │
             │                     │  └──────────────────┘    │
             │ SQL                 └──────────────────────────┘
             ▼
┌─────────────────────────┐
│   Supabase PostgreSQL   │
│                         │
│  ┌───────────────────┐ │
│  │  orders table     │ │
│  │  - id             │ │
│  │  - customer_*     │ │
│  │  - items (JSON)   │ │
│  │  - total          │ │
│  │  - status         │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │  Row Level        │ │
│  │  Security (RLS)   │ │
│  └───────────────────┘ │
└─────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT                            │
│                                                              │
│  ┌────────────────────┐        ┌─────────────────────────┐ │
│  │   Netlify          │        │   Backend Hosting       │ │
│  │   (Frontend)       │        │   (Railway/Render/      │ │
│  │                    │        │    Fly.io/AWS)          │ │
│  │  - CDN             │◄──────►│                         │ │
│  │  - Auto Deploy     │  API   │  - Express Server       │ │
│  │  - SSL/TLS         │        │  - SSL/TLS              │ │
│  │  - Edge Functions  │        │  - Auto Scale           │ │
│  └────────────────────┘        └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    CI/CD & SECURITY                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              GitHub Actions                          │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────┐ │   │
│  │  │  Build   │─►│   Test    │─►│  Snyk Security  │ │   │
│  │  │  Check   │  │  (CI)     │  │  Scan           │ │   │
│  │  └──────────┘  └───────────┘  └─────────────────┘ │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Deploy to Netlify (on push to main)        │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Product Browsing
```
User → React App → Sanity CMS API → Display Products
                   ↓
              PostHog (track page_view)
```

### 2. Add to Cart
```
User clicks "Add to Cart"
    ↓
Zustand Store (local state)
    ↓
localStorage (persist)
    ↓
PostHog (track product_added_to_cart)
```

### 3. Place Order
```
User submits order form
    ↓
React validates form
    ↓
POST to Supabase (direct insert)
    ↓
Order saved to PostgreSQL
    ↓
PostHog (track order_placed)
    ↓
Clear cart
    ↓
Show success message
```

### 4. Admin Views Order (Backend)
```
Admin → GET /api/orders
    ↓
Express Backend
    ↓
Supabase query with service key
    ↓
Return orders list
```

### 5. Error Tracking
```
Error occurs in app
    ↓
Sentry captures exception
    ↓
Sends to Sentry dashboard
    ↓
Alert sent to developers
```

## Component Hierarchy

```
App
├── Router
│   ├── Header
│   │   └── Cart Badge (useCartStore)
│   │
│   └── Routes
│       ├── Home
│       │   ├── Hero Section (Sanity)
│       │   ├── Store Info (Sanity)
│       │   └── Features
│       │
│       ├── Products
│       │   ├── Category Filter
│       │   └── ProductCard[]
│       │       └── Add to Cart (useCartStore)
│       │
│       └── Cart
│           ├── Cart Items (useCartStore)
│           │   ├── Quantity Controls
│           │   └── Remove Button
│           └── Checkout Form
│               └── Submit to Supabase
```

## State Management

### Zustand Cart Store
```typescript
{
  items: CartItem[],           // Array of cart items
  addItem: () => void,          // Add product to cart
  removeItem: () => void,       // Remove from cart
  updateQuantity: () => void,   // Update item quantity
  clearCart: () => void,        // Empty cart
  getTotalPrice: () => number,  // Calculate total
  getTotalItems: () => number   // Count items
}
```

Persisted to `localStorage` as `cart-storage`

## API Endpoints

### Backend (Express)
- `GET /health` - Health check
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status

### Sanity (Read-only from frontend)
- Products: `*[_type == "product"]`
- Hero: `*[_type == "hero"][0]`
- Store Info: `*[_type == "storeInfo"][0]`

### Supabase (Direct from frontend)
- `orders` table - Direct insert via anon key

## Security Layers

1. **Frontend**
   - Environment variables not committed
   - Anon key only (limited permissions)
   - HTTPS only via Netlify

2. **Backend**
   - Service key (admin access)
   - CORS configuration
   - Rate limiting (implement as needed)
   - Input validation

3. **Database (Supabase)**
   - Row Level Security (RLS)
   - Anon users can only insert
   - Service role has full access
   - Encrypted at rest

4. **CI/CD**
   - Snyk vulnerability scanning
   - Automated security checks
   - Secrets managed in GitHub

5. **Monitoring**
   - Sentry error tracking
   - PostHog analytics
   - Netlify logs
   - Backend logs

## Technology Choices Rationale

### Why React?
- Component-based architecture
- Large ecosystem
- TypeScript support
- Fast development with Vite

### Why Express?
- Lightweight and flexible
- Easy to understand
- Large community
- Great middleware ecosystem

### Why Supabase?
- PostgreSQL (reliable, SQL)
- Built-in auth (future expansion)
- Real-time capabilities
- Row Level Security
- Generous free tier

### Why Sanity?
- Structured content
- Rich content editor
- Real-time updates
- Image optimization
- GraphQL/GROQ queries

### Why PostHog?
- Open source
- Self-hostable option
- Product analytics
- Feature flags (future use)
- Session recording

### Why Sentry?
- Industry standard
- Source map support
- Release tracking
- Performance monitoring
- Generous free tier

### Why Netlify?
- Edge network (CDN)
- Automatic HTTPS
- GitHub integration
- Preview deployments
- Generous free tier

### Why Snyk?
- Developer-first security
- CI/CD integration
- Actionable fix advice
- Open source license scanning
- Free for open source

## Scalability Considerations

### Current Limits
- Frontend: Netlify CDN (scales automatically)
- Backend: Single server (vertical scaling)
- Database: Supabase (up to 500MB free tier)

### Future Scaling Options

1. **Backend Scaling**
   - Add load balancer
   - Multiple backend instances
   - Cache layer (Redis)
   - Message queue for orders

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Database indexing optimization
   - Partitioning for large tables

3. **Frontend Optimization**
   - Code splitting
   - Image optimization (already via Sanity)
   - Service workers/PWA
   - Edge caching

4. **Content Delivery**
   - Sanity CDN (included)
   - Netlify CDN (included)
   - Image optimization
   - Asset compression

## Monitoring & Observability

### Metrics to Track
- **Frontend**: Page load time, error rate, user flows
- **Backend**: Response time, error rate, throughput
- **Database**: Query performance, connection pool usage
- **Business**: Orders/day, revenue, cart abandonment

### Alerts to Configure
- High error rate (Sentry)
- Slow API responses
- Database connection issues
- Build failures (GitHub Actions)
- Security vulnerabilities (Snyk)

## Future Enhancements

1. **Authentication**
   - User accounts (Supabase Auth)
   - Order history
   - Saved addresses

2. **Payment Integration**
   - Stripe/PayPal
   - Secure checkout
   - Payment tracking

3. **Admin Dashboard**
   - Order management UI
   - Inventory tracking
   - Sales analytics

4. **Real-time Features**
   - Order status updates
   - Live inventory
   - Chat support

5. **Mobile Apps**
   - React Native
   - Push notifications
   - Mobile-optimized checkout
