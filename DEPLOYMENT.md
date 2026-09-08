# TECHLO Production Deployment Guide

Platform: **TECHLO** (*a product of arix*)  
Stack: Next.js 14 (App Router) + Prisma ORM + Tailwind CSS (Monochrome Black & White)  

---

## 1. Environment Variables

Create your production environment file `.env` or set these in your hosting dashboard (e.g. Vercel / Railway / Render):

```env
# PostgreSQL on Supabase/Railway/Neon
DATABASE_URL="postgresql://user:password@host:5432/techlo?sslmode=require"

# App URL (for dynamic sitemaps and SEO links)
NEXT_PUBLIC_APP_URL="https://www.techlo.store"
JWT_SECRET="generate-a-long-random-production-secret"

# Cloudflare R2 (server-only)
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-bucket-scoped-access-key-id"
R2_SECRET_ACCESS_KEY="your-bucket-scoped-secret-access-key"
R2_BUCKET_NAME="techlo-images"
R2_PUBLIC_URL="https://images.techlo.store"

# Resend email OTP
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="TECHLO <verify@send.techlo.store>"
NODE_ENV="production"
```

All R2 credentials must come from the hosting provider's encrypted environment
variables. Create an **Object Read & Write** R2 token scoped only to
`techlo-images`. If a credential has ever been committed to Git, rotate it.

Connect the bucket to `images.techlo.store`, then add this CORS policy in the
R2 bucket's **Settings > CORS Policy** JSON editor:

```json
[
  {
    "AllowedOrigins": [
      "https://www.techlo.store",
      "https://techlo.store"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

The application compresses selected JPG/PNG/WebP files in the browser, strips
metadata through canvas rendering, and uploads a WebP file of at most 250 KB
using a five-minute presigned URL. The server verifies ownership, content type,
and stored size before attaching an image to a listing.

---

## 2. Option A: Deploy on Vercel (Recommended for Next.js)

1. Push your repository to **GitHub** / **GitLab**.
2. Go to [vercel.com](https://vercel.com) -> **Add New Project**.
3. Import your `techlo` repository.
4. Add every environment variable listed above.
5. Build Command: `npm run build`
6. Click **Deploy**!

---

## 3. Option B: Deploy with Docker / Railway / Render

The repository includes a production multi-stage `Dockerfile`.

### Build & Run locally or on VPS:
```bash
# Build the production Docker image
docker build -t techlo-app .

# Run the container on port 3000
docker run -p 3000:3000 -e DATABASE_URL="file:./prisma/dev.db" techlo-app
```

---

## 4. Option C: Node.js VPS / Ubuntu Server (PM2)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd techlo

# 2. Install dependencies & generate Prisma client
npm ci
npx prisma generate
npx prisma db push

# 3. Build optimized production bundle
npm run build

# 4. Start with PM2 process manager
pm2 start npm --name "techlo" -- start -- -p 3000
```

---

## 5. Clean Database Commands

To reset or inspect the production database at any time:
```bash
# Wipe test records
node prisma/clean.js

# Open Prisma Studio GUI
npx prisma studio
```
