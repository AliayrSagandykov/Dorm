# Timesheet MVP (Next.js + Prisma + Postgres + Excel export)

## What it does
- Creates monthly timesheets (12 months)
- Shows a calendar-based grid: employees x days of month
- Each cell stores Day/Night hours (validated: >=0 and Day+Night <= 24)
- Autosaves edits (bulk upsert)
- Exports to `.xlsx`

## 1) Requirements
- Node.js 18+ (recommended 20)
- A Postgres database (Neon / Supabase / Vercel Postgres)

## 2) Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Put your Postgres connection string into `.env`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
   ```

3. Install deps:
   ```bash
   npm install
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Create tables (migration):
   ```bash
   npm run db:migrate -- --name init
   ```

6. Run dev server:
   ```bash
   npm run dev
   ```

Open: http://localhost:3000

## 3) How to use
1. Go to **Employees** and add employees.
2. Go to **Timesheets** and click **Create** on a month.
3. Open that timesheet and click cells to edit Day/Night.
4. Click **Export .xlsx** to download.

## 4) Deploy to Vercel
- Push repo to GitHub
- Import into Vercel
- Set `DATABASE_URL` in Vercel project settings
- Run build. Prisma migrations:
  - easiest: run `npx prisma migrate deploy` in a Vercel build step or deploy pipeline.

## Notes
- This MVP has no auth/roles.
- Date is stored as `YYYY-MM-DD` string for simplicity.
