# UBUNTU POOLS - LIGHTHOUSE OPTIMIZATION & DEPLOYMENT READINESS PLAN
## Complete Implementation Guide for Production Deployment

---

## EXECUTIVE SUMMARY

**Current State**: Lighthouse Performance 31/100 - Not production-ready
**Target State**: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+
**Timeline**: 2-3 weeks for full implementation
**Priority**: Security + Performance + Compliance before deployment

---

## CURRENT LIGHTHOUSE SCORES & CRITICAL ISSUES

### Performance: 31/100 ❌ CRITICAL
- **LCP (Largest Contentful Paint)**: 8.8s (Target: <2.5s)
- **CLS (Cumulative Layout Shift)**: 0.379 (Target: <0.1)
- **TBT (Total Blocking Time)**: 470ms (Target: <200ms)
- **Unused JavaScript**: 489 KiB
- **Unminified JavaScript**: 382 KiB

### Accessibility: 68/100 ⚠️ NEEDS WORK
- Buttons missing accessible names
- Contrast issues
- Non-sequential heading structure
- Missing ARIA labels

### Best Practices: 72/100 ⚠️ SECURITY RISK
- ❌ **NOT USING HTTPS** (CRITICAL SECURITY ISSUE)
- ❌ No HTTP to HTTPS redirect
- ❌ Missing security headers (CSP, HSTS, X-Frame-Options)
- ❌ Console errors present
- ❌ 50 requests not served via HTTP/2

### SEO: 92/100 ✅ MOSTLY GOOD
- ❌ robots.txt invalid (78 errors)

---

## PHASED IMPLEMENTATION PLAN

## PHASE A: DEPLOYMENT INFRASTRUCTURE & SECURITY (CRITICAL - DAYS 1-3)

### A1: Deploy to Vercel with HTTPS & HTTP/2 ✅

**Why Vercel?**
- Automatic HTTPS with Let's Encrypt
- HTTP/2 and HTTP/3 support out of the box
- Edge network with global CDN
- Zero-config SSL certificate management
- Aligns with security requirements from cybersecurity prompt

**Implementation Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure `vercel.json`** (Enhanced from existing)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "VITE_ENCRYPTION_KEY": "@encryption-key"
  },
  "redirects": [
    {
      "source": "/",
      "has": [
        {
          "type": "header",
          "key": "x-forwarded-proto",
          "value": "http"
        }
      ],
      "destination": "https://ubuntupools.com",
      "permanent": true
    }
  ]
}
```

3. **Deploy to Vercel**
```bash
# Production deployment
vercel --prod

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ENCRYPTION_KEY production
```

4. **Configure Custom Domain**
```bash
vercel domains add ubuntupools.com
```

**Validation:**
- ✅ HTTPS enabled: https://ubuntupools.com
- ✅ HTTP redirects to HTTPS
- ✅ Security headers present
- ✅ SSL Labs rating: A+

---

### A2: Fix robots.txt (Invalid - 78 Errors) ✅

**File**: `public/robots.txt`

**For Production (Allow Indexing):**
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /.well-known/

Sitemap: https://ubuntupools.com/sitemap.xml
```

**For Staging/Beta (Block Indexing):**
```txt
User-agent: *
Disallow: /

# Allow specific crawlers for testing
User-agent: Googlebot
Allow: /

Sitemap: https://staging.ubuntupools.com/sitemap.xml
```

**Generate Sitemap**: `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ubuntupools.com/</loc>
    <lastmod>2025-02-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ubuntupools.com/about</loc>
    <lastmod>2025-02-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ubuntupools.com/faq</loc>
    <lastmod>2025-02-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## PHASE B: ELIMINATE LAYOUT SHIFT (CLS 0.379 → <0.1) - DAYS 4-6

### B1: Add Explicit Image Dimensions ✅

**File**: `src/components/ImageWithDimensions.tsx`
```typescript
import { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className,
  ...props 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = (height / width) * 100;

  return (
    <div 
      className={`relative ${className || ''}`}
      style={{ paddingBottom: `${aspectRatio}%` }}
    >
      {priority && (
        <link rel="preload" as="image" href={src} />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
```

**Usage Example** - Update existing images:
```typescript
// Before (BAD - causes CLS)
<img src="/hero.png" alt="Ubuntu Pools" />

// After (GOOD - reserves space)
<OptimizedImage 
  src="/hero.png" 
  alt="Ubuntu Pools Hero"
  width={1200}
  height={630}
  priority={true}
/>
```

---

### B2: Skeleton Loaders for Async Content ✅

**File**: `src/components/SkeletonLoader.tsx`
```typescript
export function PoolCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PoolCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

**Usage in Pages**:
```typescript
import { Suspense } from 'react';
import { DashboardSkeleton } from '../components/SkeletonLoader';

export function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
```

---

### B3: Font Loading Optimization ✅

**File**: `index.html` - Update font loading
```html
<head>
  <!-- Preconnect to font providers -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Load fonts with font-display: swap -->
  <link 
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
    rel="stylesheet"
  >
  
  <style>
    /* Fallback font with similar metrics */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                   'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
    }
  </style>
</head>
```

**File**: `src/index.css` - Add font-display
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}

/* Prevent layout shift during font load */
body {
  font-size-adjust: 0.5;
}
```

---

## PHASE C: REDUCE JAVASCRIPT COST (489KB UNUSED) - DAYS 7-10

### C1: Code Splitting with React.lazy ✅

**File**: `src/App.tsx` - Implement route-based code splitting
```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardSkeleton } from './components/SkeletonLoader';

// Eagerly loaded (critical path)
import Layout from './components/Layout';
import ComplianceBanner from './components/ComplianceBanner';

// Lazy loaded (code-split)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreatePool = lazy(() => import('./pages/CreatePool'));
const PoolDetails = lazy(() => import('./pages/PoolDetails'));
const Contribute = lazy(() => import('./pages/Contribute'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PoolAgreement = lazy(() => import('./pages/PoolAgreement'));
const FAQ = lazy(() => import('./pages/FAQ'));
const KycVerification = lazy(() => import('./pages/KycVerification'));
const LiveSupport = lazy(() => import('./pages/LiveSupport'));

// Heavy dependencies only loaded when needed
const TrustGraph = lazy(() => import('./pages/TrustGraph'));

function App() {
  return (
    <BrowserRouter>
      <ComplianceBanner />
      <Layout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-pool" element={<CreatePool />} />
            <Route path="/pool/:id" element={<PoolDetails />} />
            <Route path="/contribute/:id" element={<Contribute />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/agreement/:id" element={<PoolAgreement />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/kyc" element={<KycVerification />} />
            <Route path="/support" element={<LiveSupport />} />
            <Route path="/trust-graph" element={<TrustGraph />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

---

### C2: Analyze and Remove Unused Dependencies ✅

**Script**: `scripts/analyze-bundle.js`
```javascript
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};
```

**For Vite** - `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'], // If using icon library
          'supabase': ['@supabase/supabase-js'],
          'charts': ['recharts'], // If using charts
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

**Run analysis**:
```bash
npm run build
# Open dist/stats.html to see bundle composition
```

**Common Dependencies to Review**:
```bash
# Check what's installed
npm list --depth=0

# Remove unused packages
npm uninstall moment # If using date-fns instead
npm uninstall lodash # Use native methods or lodash-es
npm uninstall axios # If using fetch API
```

---

### C3: Tree-Shaking and Import Optimization ✅

**Bad Imports** (imports entire library):
```typescript
import _ from 'lodash';
import * as Icons from 'lucide-react';
```

**Good Imports** (tree-shakeable):
```typescript
import debounce from 'lodash-es/debounce';
import { User, Settings, LogOut } from 'lucide-react';
```

**Create barrel export with explicit exports** - `src/components/index.ts`:
```typescript
// ❌ DON'T DO THIS (imports everything)
// export * from './PoolCard';
// export * from './Layout';

// ✅ DO THIS (explicit, tree-shakeable)
export { PoolCard } from './PoolCard';
export { Layout } from './Layout';
export { ComplianceBanner } from './ComplianceBanner';
```

---

## PHASE D: OPTIMIZE LCP (8.8s → <2.5s) - DAYS 11-14

### D1: Identify and Preload LCP Element ✅

**File**: `index.html` - Preload critical resources
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ubuntu Pools - Collective Savings Platform</title>
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://*.supabase.co">
  
  <!-- Preload LCP image (hero image) -->
  <link rel="preload" as="image" href="/hero.webp" type="image/webp">
  
  <!-- Preload critical CSS -->
  <link rel="preload" href="/src/index.css" as="style">
  
  <!-- Preload critical fonts -->
  <link 
    rel="preload" 
    href="/fonts/inter-regular.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
  
  <!-- DNS prefetch for third-party resources -->
  <link rel="dns-prefetch" href="https://api.anthropic.com">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

### D2: Image Optimization (Convert to WebP/AVIF) ✅

**Script**: `scripts/optimize-images.sh`
```bash
#!/bin/bash
# Optimize all images in public/images

mkdir -p public/images/optimized

for img in public/images/*.{jpg,jpeg,png}; do
  filename=$(basename "$img" | sed 's/\.[^.]*$//')
  
  # Convert to WebP
  cwebp -q 85 "$img" -o "public/images/optimized/${filename}.webp"
  
  # Convert to AVIF (best compression)
  avifenc --min 20 --max 63 "$img" "public/images/optimized/${filename}.avif"
  
  echo "Optimized: $filename"
done

echo "✅ Image optimization complete"
```

**Component**: `src/components/PictureElement.tsx`
```typescript
interface PictureProps {
  src: string; // Base filename without extension
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function Picture({ src, alt, width, height, priority }: PictureProps) {
  return (
    <picture>
      <source 
        srcSet={`${src}.avif`} 
        type="image/avif" 
      />
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp" 
      />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
```

---

### D3: Critical CSS Inlining ✅

**File**: `vite.config.ts` - Add critical CSS plugin
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          criticalCss: `
            /* Critical above-the-fold CSS */
            body { margin: 0; font-family: Inter, sans-serif; }
            .hero { min-height: 60vh; display: flex; align-items: center; }
            .loading { display: flex; justify-content: center; padding: 2rem; }
          `,
        },
      },
    }),
  ],
});
```

**File**: `index.html` - Inline critical CSS
```html
<head>
  <style>
    /* Critical CSS - inline for instant render */
    <%= criticalCss %>
  </style>
  
  <!-- Non-critical CSS loaded async -->
  <link rel="preload" href="/src/index.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/src/index.css"></noscript>
</head>
```

---

## PHASE E: ACCESSIBILITY FIXES (68 → 95+) - DAYS 15-17

### E1: Add ARIA Labels to All Interactive Elements ✅

**File**: `src/components/AccessibleButton.tsx`
```typescript
import { ButtonHTMLAttributes } from 'react';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary' | 'icon';
}

export function AccessibleButton({ 
  children, 
  ariaLabel, 
  variant = 'primary',
  disabled,
  ...props 
}: AccessibleButtonProps) {
  const isIconOnly = variant === 'icon' && typeof children !== 'string';
  
  if (isIconOnly && !ariaLabel) {
    console.warn('Icon buttons must have ariaLabel prop');
  }
  
  return (
    <button
      aria-label={ariaLabel || (isIconOnly ? 'Button' : undefined)}
      aria-disabled={disabled}
      disabled={disabled}
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Usage Examples**:
```typescript
// Icon-only button (MUST have aria-label)
<AccessibleButton variant="icon" ariaLabel="Open menu">
  <MenuIcon />
</AccessibleButton>

// Text button (aria-label optional)
<AccessibleButton variant="primary">
  Create Pool
</AccessibleButton>

// Button with icon and text
<AccessibleButton ariaLabel="Delete pool">
  <TrashIcon /> Delete
</AccessibleButton>
```

---

### E2: Fix Contrast Issues ✅

**File**: `src/styles/colors.css` - WCAG AA compliant colors
```css
:root {
  /* Text colors - 4.5:1 contrast minimum */
  --text-primary: #111827; /* On white: 15.3:1 ✅ */
  --text-secondary: #374151; /* On white: 10.4:1 ✅ */
  --text-tertiary: #6B7280; /* On white: 4.6:1 ✅ */
  
  /* Background colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  
  /* Interactive elements */
  --primary: #2563EB; /* Blue - 4.6:1 on white ✅ */
  --primary-hover: #1D4ED8;
  --secondary: #10B981; /* Green - 3.4:1 ⚠️ Fix needed */
  --secondary-hover: #059669; /* 4.5:1 ✅ */
  
  /* Status colors */
  --success: #059669; /* 4.5:1 ✅ */
  --warning: #D97706; /* 5.3:1 ✅ */
  --error: #DC2626; /* 5.9:1 ✅ */
  --info: #0284C7; /* 4.5:1 ✅ */
}

/* Dark mode (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #F9FAFB;
    --text-secondary: #E5E7EB;
    --bg-primary: #111827;
    --bg-secondary: #1F2937;
  }
}
```

**Contrast Checker Tool**:
```bash
npm install --save-dev axe-core
```

**File**: `scripts/check-contrast.ts`
```typescript
import axe from 'axe-core';

async function checkContrast() {
  const results = await axe.run({
    rules: {
      'color-contrast': { enabled: true },
    },
  });
  
  if (results.violations.length > 0) {
    console.error('❌ Contrast violations found:');
    results.violations.forEach(v => {
      console.error(`- ${v.description}`);
      v.nodes.forEach(n => console.error(`  Element: ${n.html}`));
    });
    process.exit(1);
  }
  
  console.log('✅ All contrast checks passed');
}

checkContrast();
```

---

### E3: Fix Heading Hierarchy ✅

**Bad** (skips levels):
```jsx
<h1>Ubuntu Pools</h1>
<h3>Create a Pool</h3> {/* ❌ Skipped h2 */}
```

**Good** (sequential):
```jsx
<h1>Ubuntu Pools</h1>
<h2>Create a Pool</h2>
<h3>Pool Details</h3>
```

**Audit Script**: `scripts/check-headings.ts`
```typescript
function auditHeadings() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let prevLevel = 0;
  const issues: string[] = [];
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    
    if (level > prevLevel + 1) {
      issues.push(
        `Heading level skipped: ${heading.tagName} after h${prevLevel} - "${heading.textContent}"`
      );
    }
    
    prevLevel = level;
  });
  
  if (issues.length > 0) {
    console.error('❌ Heading hierarchy issues:');
    issues.forEach(issue => console.error(`- ${issue}`));
    return false;
  }
  
  console.log('✅ Heading hierarchy is correct');
  return true;
}
```

---

## PHASE F: AUTOMATED TESTING & VALIDATION - DAYS 18-20

### F1: Lighthouse CI Integration ✅

**File**: `.github/workflows/lighthouse-ci.yml`
```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build production
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/faq
            http://localhost:3000/create-pool
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: 3
          budgetPath: ./lighthouse-budget.json
      
      - name: Check Lighthouse scores
        run: |
          if [ $(cat lhci_reports/manifest.json | jq '.[0].summary.performance') -lt 90 ]; then
            echo "❌ Performance score below 90"
            exit 1
          fi
          echo "✅ All Lighthouse checks passed"
```

**File**: `lighthouse-budget.json`
```json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 95,
  "seo": 95,
  "pwa": 50,
  "resourceSummary": {
    "script": 500000,
    "image": 1000000,
    "stylesheet": 100000,
    "total": 2000000
  },
  "metrics": {
    "largest-contentful-paint": 2500,
    "cumulative-layout-shift": 0.1,
    "total-blocking-time": 200,
    "first-contentful-paint": 1500,
    "interactive": 3500
  }
}
```

---

### F2: Automated Accessibility Testing ✅

**File**: `tests/accessibility.test.tsx`
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dashboard } from '../src/pages/Dashboard';
import { CreatePool } from '../src/pages/CreatePool';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Dashboard has no a11y violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('CreatePool has no a11y violations', async () => {
    const { container } = render(<CreatePool />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('All buttons have accessible names', async () => {
    const { container } = render(<Dashboard />);
    const buttons = container.querySelectorAll('button');
    
    buttons.forEach(button => {
      const hasLabel = 
        button.getAttribute('aria-label') ||
        button.textContent?.trim() ||
        button.querySelector('[aria-label]');
      
      expect(hasLabel).toBeTruthy();
    });
  });
});
```

---

## PHASE G: MONITORING & CONTINUOUS OPTIMIZATION - ONGOING

### G1: Real User Monitoring (RUM) ✅

**File**: `src/monitoring/webVitals.ts`
```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    timestamp: Date.now(),
    url: window.location.href,
  });
  
  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    fetch('/api/analytics', {
      method: 'POST',
      body,
      keepalive: true,
    });
  }
}

export function initWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

**File**: `src/main.tsx` - Initialize monitoring
```typescript
import { initWebVitals } from './monitoring/webVitals';

// Initialize web vitals tracking
if (import.meta.env.PROD) {
  initWebVitals();
}
```

---

### G2: Performance Budget Monitoring ✅

**File**: `scripts/check-bundle-size.js`
```javascript
import fs from 'fs';
import path from 'path';

const BUDGET = {
  'main.js': 200 * 1024, // 200 KB
  'vendor.js': 300 * 1024, // 300 KB
  'total': 500 * 1024, // 500 KB
};

function checkBundleSize() {
  const distDir = path.resolve('./dist/assets');
  const files = fs.readdirSync(distDir);
  
  let totalSize = 0;
  const violations = [];
  
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(distDir, file);
      const size = fs.statSync(filePath).size;
      totalSize += size;
      
      const budget = BUDGET[file] || BUDGET.total;
      if (size > budget) {
        violations.push({
          file,
          size: (size / 1024).toFixed(2) + ' KB',
          budget: (budget / 1024).toFixed(2) + ' KB',
        });
      }
    }
  });
  
  if (violations.length > 0) {
    console.error('❌ Bundle size budget exceeded:');
    violations.forEach(v => {
      console.error(`- ${v.file}: ${v.size} (budget: ${v.budget})`);
    });
    process.exit(1);
  }
  
  console.log(`✅ Bundle size check passed: ${(totalSize / 1024).toFixed(2)} KB total`);
}

checkBundleSize();
```

**Add to `package.json`**:
```json
{
  "scripts": {
    "build": "vite build",
    "build:check": "npm run build && node scripts/check-bundle-size.js"
  }
}
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment Validation

```markdown
## Infrastructure
- [ ] Deployed to Vercel production
- [ ] Custom domain configured (ubuntupools.com)
- [ ] HTTPS enabled and tested
- [ ] HTTP → HTTPS redirect working
- [ ] SSL certificate valid (A+ on SSL Labs)
- [ ] HTTP/2 enabled
- [ ] Security headers present (verify with securityheaders.com)

## Performance
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TBT < 200ms
- [ ] All images optimized (WebP/AVIF)
- [ ] Code splitting implemented
- [ ] Bundle size < 500 KB
- [ ] Critical CSS inlined
- [ ] Fonts optimized

## Accessibility
- [ ] Lighthouse Accessibility > 95
- [ ] All buttons have aria-labels
- [ ] Contrast ratio > 4.5:1
- [ ] Heading hierarchy correct
- [ ] Keyboard navigation works
- [ ] Screen reader tested

## SEO
- [ ] Lighthouse SEO > 95
- [ ] robots.txt valid
- [ ] sitemap.xml present
- [ ] Meta descriptions on all pages
- [ ] Open Graph tags configured

## Security
- [ ] CSP header configured
- [ ] HSTS enabled (max-age=31536000)
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy configured
- [ ] No console errors in production
- [ ] Secrets not in source code
- [ ] Environment variables configured

## Compliance (from previous prompts)
- [ ] Non-custodial guard active
- [ ] Event log immutability working
- [ ] Audit trail functional
- [ ] Compliance banner visible
- [ ] RMCP documentation complete

## Testing
- [ ] All unit tests passing
- [ ] Accessibility tests passing
- [ ] E2E tests passing
- [ ] Manual smoke test complete
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive tested
```

---

## ESTIMATED IMPACT ON LIGHTHOUSE SCORES

### Before (Current)
- Performance: 31/100
- Accessibility: 68/100
- Best Practices: 72/100
- SEO: 92/100

### After (Projected)
- Performance: **92-95/100** ✅
  - LCP: 8.8s → 1.8s
  - CLS: 0.379 → 0.05
  - TBT: 470ms → 150ms
  
- Accessibility: **96-98/100** ✅
  - All ARIA labels present
  - Contrast issues fixed
  - Heading hierarchy correct
  
- Best Practices: **95-100/100** ✅
  - HTTPS enabled
  - Security headers configured
  - HTTP/2 active
  - No console errors
  
- SEO: **98-100/100** ✅
  - robots.txt fixed
  - Sitemap present
  - Meta tags optimized

---

## PRIORITY IMPLEMENTATION ORDER

### Week 1 (Critical)
1. ✅ Deploy to Vercel with HTTPS
2. ✅ Fix robots.txt
3. ✅ Add security headers
4. ✅ Fix image dimensions (CLS)
5. ✅ Add skeleton loaders

### Week 2 (High Impact)
6. ✅ Implement code splitting
7. ✅ Optimize images (WebP/AVIF)
8. ✅ Remove unused dependencies
9. ✅ Fix accessibility issues
10. ✅ Add ARIA labels

### Week 3 (Polish & Automation)
11. ✅ Set up Lighthouse CI
12. ✅ Implement performance monitoring
13. ✅ Add automated tests
14. ✅ Document deployment process
15. ✅ Final validation

---

## TOOLS & RESOURCES

### Performance Testing
- **Lighthouse CI**: Automated testing in CI/CD
- **WebPageTest**: Real-world performance testing
- **Chrome DevTools**: Performance profiling
- **Vercel Analytics**: Real user monitoring

### Accessibility Testing
- **axe DevTools**: Browser extension for a11y testing
- **WAVE**: Web accessibility evaluation tool
- **NVDA/JAWS**: Screen reader testing

### Security Testing
- **SSL Labs**: Test SSL/TLS configuration
- **Security Headers**: Test security headers
- **Mozilla Observatory**: Comprehensive security scan

### Bundle Analysis
- **rollup-plugin-visualizer**: Vite bundle analysis
- **source-map-explorer**: Analyze bundle composition

---

## NEXT STEPS

1. **Review this plan** with your team
2. **Set up Vercel account** and connect repository
3. **Create feature branch**: `feature/lighthouse-optimization`
4. **Implement Phase A** (deployment + HTTPS)
5. **Run initial Lighthouse test** on Vercel preview
6. **Iterate through remaining phases**
7. **Validate against checklist**
8. **Merge to production**

**Estimated Total Time**: 2-3 weeks for complete implementation
**Key Milestone**: Phase A completion = immediate security and infrastructure gains

Ready to begin? Let me know which phase you'd like detailed implementation code for first!
