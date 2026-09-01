# TECHLO Production Deployment Guide

Platform: **TECHLO** (*a product of arix*)  
Stack: Next.js 14 (App Router) + Prisma ORM + Tailwind CSS (Monochrome Black & White)  

---

## 1. Environment Variables

Create your production environment file `.env` or set these in your hosting dashboard (e.g. Vercel / Railway / Render):

```env
# Database connection (SQLite by default, or PostgreSQL for cloud databases)
DATABASE_URL="file:./dev.db"

# For PostgreSQL on Supabase/Railway/Neon:
# DATABASE_URL="postgresql://user:password@host:5432/techlo?schema=public"

# App URL (for dynamic sitemaps and SEO links)
NEXT_PUBLIC_APP_URL="https://techlo.pk"
NODE_ENV="production"
```

---

## 2. Option A: Deploy on Vercel (Recommended for Next.js)

1. Push your repository to **GitHub** / **GitLab**.
2. Go to [vercel.com](https://vercel.com) -> **Add New Project**.
3. Import your `techlo` repository.
4. Add your Environment Variable: `DATABASE_URL` (e.g. using a Supabase PostgreSQL connection string or Serverless Postgres).
5. Build Command: `npx prisma generate && npm run build`
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
