# Clove & Cauldron

Research companion site for the Clove & Cauldron channel. Next.js (App Router)
+ Sanity CMS.

## Stack

- **Next.js 14** — the coded site (this repo)
- **Sanity** — the "copy desk": a visual editor for articles (rich text,
  photo drop-ins, reorderable blocks), subjects/tags, videos, and shop
  products. Content lives in Sanity's database, not in this repo.

## First-time setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a free Sanity project**

   - Go to https://www.sanity.io/manage and create an account + new project
   - Note your **Project ID** (shown on the project dashboard)
   - Create a dataset named `production` (Sanity does this by default)

3. **Set environment variables**

   Copy `.env.example` to `.env.local` and fill in your Sanity project ID:

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

4. **Run the site locally**

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 for the site, and
   http://localhost:3000/studio for the copy desk (the visual editor).

5. **Add content**

   Open `/studio`, log in with the same account you used for Sanity, and:

   - Fill in **Site Settings** (hero text, about text, social links)
   - Add a few **Subjects** (e.g. Bektashism, Tamga, Irkbitig, Kıyafetnâme,
     Göktürk Script)
   - Add **Articles** — this is the copy desk: type the body, drag in
     photos inline, add symbol callouts, tag with subjects
   - Add **Videos** and **Shop Products** as needed

   The homepage, archive, and article pages update automatically — no code
   changes needed for new content.

## Deploying

**Recommended: Vercel**

1. Push this repo to GitHub
2. Go to https://vercel.com, click "Import Project", and select the repo
3. Add the two environment variables from step 3 above in the Vercel project
   settings
4. Deploy — Vercel builds and hosts the Next.js site automatically, and
   redeploys on every push to your main branch

The Sanity Studio (`/studio`) deploys as part of the same Next.js app, so
there's nothing extra to host separately.

## Project structure

```
app/
  layout.tsx              — minimal root layout (fonts, html/body)
  globals.css             — Tailwind + custom classes from the design
  (site)/                 — all visitor-facing pages (has header/footer)
    page.tsx              — homepage
    archive/               — browse all articles / by subject
    articles/[slug]/      — article detail page
    shop/                 — shop preview page
    about/                — about page
  studio/[[...tool]]/     — embedded Sanity Studio (the copy desk)
components/               — shared React components
lib/
  fonts.ts                — your six fonts, loaded via next/font/local
  sanity.client.ts        — Sanity API client
  sanity.queries.ts       — GROQ queries for all content types
  sanity.image.ts         — image URL builder
sanity/
  schemaTypes/            — content models (article, subject, video, product, siteSettings)
  structure/              — copy desk navigation layout
  sanity.config.ts        — Studio configuration
public/
  fonts/                  — your six font files
  logo/                   — logo variants (lockup, icon, wordmark)
```

## Fonts

Six fonts are loaded locally (`lib/fonts.ts`) and mapped into the Tailwind
config (`tailwind.config.ts`) under the original design's font-family tokens:

- **Blacksword** → all headline sizes (display-lg, headline-lg/md/sm)
- **Plain Black Wide** → body copy (body-lg, body-md)
- **Jim Nightshade** → nav links and small uppercase labels (label-lg, label-sm)
- **Perrygot**, **Homemade Apple**, **Butterfly Kids** → not wired into any
  token yet; available as CSS variables (`--font-perrygot`,
  `--font-homemade-apple`, `--font-butterfly-kids`) for future decorative use
  (pull quotes, handwritten captions, special callouts)

These role assignments are a starting point — swap any of them in
`tailwind.config.ts` if a different pairing feels better once you see real
content in place.
