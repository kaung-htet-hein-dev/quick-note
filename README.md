# Quick Note

A minimal online note-taking app. Open a URL, start writing. Notes are saved automatically and can be shared with anyone via a custom slug URL.

## Features

- Instant notes — visiting any URL creates a note at that path
- Auto-save with a debounced save on edit, plus a manual save button
- Custom slug URLs — rename the note path to something memorable
- Password protection — lock a note with a password; only those who know it can read it
- Image support — paste or drag and drop images directly into the editor
- Dark mode toggle persisted via localStorage
- Rich text editing powered by Tiptap (Markdown-compatible)
- Supabase credentials are kept server-side only; the browser never sees them

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tiptap](https://tiptap.dev) rich text editor
- [Supabase](https://supabase.com) for storage and database
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn
- A Supabase project with a `notes` table and a storage bucket

### Supabase Setup

Create a `notes` table with the following columns:

| Column     | Type      | Notes                     |
| ---------- | --------- | ------------------------- |
| id         | uuid      | primary key, default uuid |
| slug       | text      | unique                    |
| content    | text      |                           |
| password   | text      | nullable                  |
| updated_at | timestamp |                           |

Create a storage bucket (e.g. `note-attachments`) for image uploads.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=note-attachments
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

All Supabase variables are server-side only. Do not prefix them with `NEXT_PUBLIC_`.

### Run Locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to a new note at a UUID path.

## Deployment

Deploy to [Vercel](https://vercel.com) and add the four environment variables under Project Settings > Environment Variables. The app works on the free Vercel plan with the default `.vercel.app` domain.

After deploying, update `NEXT_PUBLIC_BASE_URL` to your production URL so the sitemap and Open Graph metadata point to the correct domain.
