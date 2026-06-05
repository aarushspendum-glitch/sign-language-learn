# SignLearn — Setup Guide

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Copy env file
```bash
cp .env.example .env
```

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized JavaScript origins:
   - `http://localhost:3000`
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.up.railway.app/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** into `.env`

### 4. Set up a local database
```bash
# Option A: Docker
docker run --name signlearn-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
# Then set: DATABASE_URL="postgresql://postgres:password@localhost:5432/signlearn"

# Option B: Use Railway's dev database (see Railway section below)
```

### 5. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Paste the output into `.env` as `NEXTAUTH_SECRET`.

### 6. Push the database schema
```bash
npm run db:push
```

### 7. Start the dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Railway

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create sign-language-learn --public --push
```

### 2. Create a Railway project
1. Go to [railway.app](https://railway.app) → New Project
2. Choose **Deploy from GitHub repo** → select `sign-language-learn`
3. Add a **PostgreSQL** plugin (click + in the project dashboard)

### 3. Set environment variables in Railway
In your service settings → Variables, add:
```
DATABASE_URL          → (Railway auto-fills this from the Postgres plugin)
NEXTAUTH_SECRET       → (output of: openssl rand -base64 32)
NEXTAUTH_URL          → https://your-app.up.railway.app
GOOGLE_CLIENT_ID      → from Google Cloud Console
GOOGLE_CLIENT_SECRET  → from Google Cloud Console
```

### 4. Update Google OAuth redirect URIs
Back in Google Cloud Console, add your Railway URL:
- `https://your-app.up.railway.app/api/auth/callback/google`

### 5. Deploy
Railway will auto-deploy on every push to `main`. The `railway.toml` handles:
- Building with nixpacks
- Running `prisma migrate deploy` before start
- Health check on `/`

---

## Project Structure

```
sign-language-learn/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # User progress dashboard
│   ├── learn/
│   │   ├── page.tsx          # All modules list
│   │   └── [moduleId]/
│   │       ├── page.tsx      # Module lesson list
│   │       └── [lessonId]/page.tsx  # Active lesson with camera
│   ├── diagnostic/page.tsx   # Diagnostic placement test
│   ├── login/page.tsx        # Sign-in page
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth Google OAuth
│       ├── progress/            # Save/load lesson progress
│       ├── diagnostic/          # Save/load diagnostic results
│       └── modules/             # Curriculum data endpoint
├── components/
│   ├── SignDetector.tsx      # MediaPipe webcam + hand landmark overlay
│   ├── Navbar.tsx
│   └── ModuleCard.tsx
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                 # Prisma client singleton
│   ├── curriculum.ts         # All modules, lessons, sign data
│   └── signClassifier.ts     # Hand landmark → ASL letter classifier
├── prisma/schema.prisma      # User, Progress, DiagnosticResult models
└── railway.toml              # Railway deployment config
```

## How the Computer Vision Works

1. **MediaPipe Hands** is loaded from CDN into the browser (no server cost).
2. It detects **21 hand landmarks** (wrist + 4 joints per finger) at ~24fps via the webcam.
3. `lib/signClassifier.ts` maps landmark positions to ASL letters using geometric rules
   (which fingers are extended, distances between tips, relative positions).
4. The user must hold the correct sign for ~0.5 seconds (12 consecutive frames) to pass.
5. A green/red skeleton overlay is drawn on the canvas in real time.

The classifier currently covers all 26 ASL alphabet letters, numbers 0–10, and
common directional signs. It runs 100% client-side — no video is ever uploaded.
