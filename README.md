# Portfolio — Trueone

A personal portfolio site with a password-protected admin panel. Only you
(with the admin password) can edit your **Profile** (name, tagline, bio,
GitHub/LinkedIn/email/resume links) and add, edit, or delete entries in
**Skills**, **Projects**, and **Certifications** — changes save to a
database and are visible to anyone who visits the site, not just on your
own device.

The **Education** section is intentionally static (edited directly in code,
not through the admin panel) since it rarely changes — see below.

## What's under the hood

- **Next.js** (React) + **Tailwind CSS**
- **SQLite** via Node's built-in `node:sqlite` module for storage — no
  native compiler needed, works out of the box on Windows/Mac/Linux
- **bcrypt** for password hashing + **jose** (JWT) for signed admin sessions
  in an httpOnly cookie — auth is checked server-side on every request, not
  just hidden in the UI
- Basic rate limiting on the login endpoint (5 attempts / 15 min per IP)

**Requires Node.js 22.5+** (`node -v` to check). `node:sqlite` prints a
one-line "experimental feature" warning in the terminal — that's expected
and harmless, not an error.

> Note: I first tried Prisma, then `better-sqlite3` — both need either a
> binary download or a C++ compiler (Visual Studio Build Tools on Windows)
> to install, which is a common source of setup pain. Node's built-in
> `node:sqlite` avoids that entirely: same database, zero native
> dependencies to compile.

## Running it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin` for the admin panel.

**Default admin password:** `changeme123` — change this before you show the
site to anyone (see below).

## Changing your admin password

1. Generate a new bcrypt hash:
   ```bash
   node scripts/generate-password-hash.js "your-new-password"
   ```
2. Copy the printed `ADMIN_PASSWORD_HASH=...` line into `.env.local`,
   replacing the existing one.
3. Restart the dev server.

**Important:** the hash contains `$` characters, and Next.js expands `$VAR`
patterns in `.env` files. The generator script already escapes them for you
(`\$` instead of `$`) — don't remove the backslashes if you edit the hash
by hand, or the password will silently stop working.

## Editing content

Everything is editable by logging in at `/admin` — **Profile** (name,
tagline, bio, GitHub/LinkedIn/email/resume links), **Skills**,
**Projects**, **Education**, and **Certifications**. Nothing needs to be
redeployed or edited in code — changes save to the database immediately
and show up on the public site on refresh.

### Adding your resume

The admin Profile tab has a "resume url" field — it's a link, not a file
upload, so you need to host the PDF somewhere first:

- **Easiest**: upload your resume PDF to Google Drive, right-click →
  Share → set to "Anyone with the link", copy that link, paste it into
  the resume url field.
- **Alternative**: put a file named `resume.pdf` directly inside this
  project's `public/` folder, then set the resume url field to
  `/resume.pdf` — it'll be served from your own site.

## Deploying so it's live for anyone to visit

This was built and tested locally in a sandboxed environment without
deploy access, so treat the steps below as the standard path — you'll want
to actually run through it yourself.

1. Push this project to a GitHub repo.
2. Import it on [Vercel](https://vercel.com) (or any Node host).
3. **Important — the database:** SQLite writes to a local file
   (`data/portfolio.db`). On Vercel's serverless functions, the filesystem
   is read-only/ephemeral in production, so a local SQLite file **will not
   persist** between requests once deployed. Before going live, swap the
   storage in `src/lib/db.ts` for a hosted database — good free-tier
   options that need minimal code changes:
   - **Turso** (hosted SQLite — closest to a drop-in swap, same SQL)
   - **Vercel Postgres** or **Supabase** (if you don't mind rewriting the
     SQL slightly for Postgres)
4. Set the same two environment variables (`ADMIN_PASSWORD_HASH`,
   `ADMIN_SESSION_SECRET`) in your host's dashboard — never commit
   `.env.local` to git (it's already in `.gitignore`).
5. Generate a fresh `ADMIN_SESSION_SECRET` for production rather than
   reusing the local dev one:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

Local SQLite is genuinely fine if you'd rather self-host on a normal VPS
(not serverless) where the filesystem persists — in that case skip step 3
entirely.

## Project structure

```
src/
  app/
    page.tsx                  # public homepage (reads DB server-side)
    admin/page.tsx             # admin dashboard (CRUD UI)
    admin/login/page.tsx        # admin login form
    api/                        # REST routes: skills, projects, certifications, auth
  components/                   # Hero, Skills, Projects, Education, Certifications, Footer
  lib/
    db.ts                       # SQLite connection + schema
    auth.ts                     # session create/verify
    rateLimit.ts                 # login rate limiting
  middleware.ts                  # blocks /admin/* without a valid session
scripts/
  generate-password-hash.js      # CLI to make a new bcrypt hash
  seed.js                        # one-time seed for initial skills
```
