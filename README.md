# 🐵 Emily's Monkey Web Site

This thing got me through grad school back in 2014 lmfao. Resurrected for the modern era with Cloudflare Workers!

## 🚀 Tech Stack

- **Cloudflare Workers** - Edge computing platform
- **TypeScript** - Type-safe JavaScript
- **Hono Framework** - Fast web framework for the edge
- **HTMX** - Modern HTML-driven interactivity
- **D1 Database** - Serverless SQL database (configured but not yet used)

## 🏗️ Project Structure

```
├── src/
│   ├── index.ts    # Main application entry point
│   └── types.ts    # TypeScript type definitions for Cloudflare bindings
├── wrangler.toml   # Wrangler configuration with D1 database binding
├── tsconfig.json   # TypeScript configuration
├── package.json    # Node.js dependencies and scripts
└── .gitignore      # Git ignore rules
```

## 🧰 Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:8787`

3. **Type checking**

   ```bash
   npm run type-check
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   ```

### Available Scripts

- `npm run dev` - Start local development server with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run build` - Compile TypeScript
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🌐 API Endpoints

- `GET /` - Main monkey website
- `GET /api/monkey-fact` - Get random monkey fact (HTMX endpoint)
- `POST /api/counter` - Increment counter (HTMX endpoint)
- `GET /health` - Health check endpoint
- `GET /api` - API information

## 💾 Database Setup

The project is configured for D1 database usage. To set up a real database:

1. Create a D1 database:

   ```bash
   npx wrangler d1 create monkey-web-site-db
   ```

2. Update `wrangler.toml` with the real database ID

3. Create tables:

   ```bash
   npx wrangler d1 execute monkey-web-site-db --command "CREATE TABLE counters (id INTEGER PRIMARY KEY, count INTEGER, timestamp TEXT)"
   ```

4. Uncomment the D1 database code in `src/index.ts`

## 🎨 Features

- **Server-side HTML rendering** with Hono
- **HTMX interactivity** (with fallback JavaScript for restricted environments)
- **TypeScript support** with proper Cloudflare Workers types
- **Local development** with Wrangler dev server
- **D1 Database binding** ready for use
- **Health check endpoint** for monitoring
- **Pretty JSON API responses**

## 🚀 Deployment

The project is configured for easy deployment to Cloudflare Workers:

```bash
npm run deploy
```

Make sure you're logged in to Wrangler and have the necessary permissions for your Cloudflare account.

## 🔧 Configuration

### Environment Variables

Set up environment variables in `.dev.vars` for local development:

```
# Add any environment variables here
# EXAMPLE_VAR=value
```

### Wrangler Configuration

The `wrangler.toml` file contains:

- Worker configuration
- D1 database bindings
- Environment-specific settings

## 🎯 What's Next?

- Set up a real D1 database and implement persistent storage
- Add more interactive features with HTMX
- Implement user sessions and authentication
- Add more monkey facts and features
- Set up CI/CD pipeline

---

_Bringing the legendary monkey website into 2024! 🐒_
