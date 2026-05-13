# Property Project Marketing (PPM)

A real estate marketing and client management platform. Agents use it to manage clients, documents, and enquiries. Clients use it to view their documents and browse properties.

**Stack:** Next.js · TypeScript · MongoDB · Tailwind CSS · Netlify

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How the App Works](#how-the-app-works)
- [Environment Variables](#environment-variables)
- [Git Conventions](#git-conventions)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### What you need installed first

| Tool | Version | How to get it |
|---|---|---|
| Node.js | 20 or newer | https://nodejs.org |
| pnpm | 10.32.1 | Run: `npm install -g pnpm@10.32.1` |
| Git | Latest | https://git-scm.com |

> **Why pnpm and not npm?** This project uses a patch file to fix a bug in one of its dependencies (`docusign-esign`). The patch only works with pnpm. Using `npm install` will break the DocuSign feature.

### Step 1 — Get the code

```bash
git clone <repository-url> ppm
cd ppm
```

### Step 2 — Install dependencies

```bash
pnpm install
```

### Step 3 — Set up your environment file

Create a file called `.env.local` in the root of the project. This file holds secret credentials and is **never committed to git**.

```env
# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000/

# ── Authentication ─────────────────────────────────────────
# Generate a random secret with: openssl rand -base64 32
AUTH_SECRET=your-random-secret-here
AUTH_TRUST_HOST=true

# ── Database ───────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/

# ── Email (Resend) ─────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Property Project Marketing <noreply@yourdomain.com>

# ── Image Hosting (Cloudinary) ─────────────────────────────
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# ── DocuSign eSignature ────────────────────────────────────
DOCUSIGN_INTEGRATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DOCUSIGN_OAUTH_BASE_PATH=account-d.docusign.com
DOCUSIGN_BASE_PATH=https://demo.docusign.net/restapi
DOCUSIGN_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----

# ── Webflow CMS ────────────────────────────────────────────
WEBFLOW_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEBFLOW_COLLECTION_ID=xxxxxxxxxxxxxxxxxxxxxxxx
WEBFLOW_SITE_ID=xxxxxxxxxxxxxxxxxxxxxxxx

# ── AgentBox CRM ───────────────────────────────────────────
AGENTBOX_API_KEY=your_agentbox_api_key
AGENTBOX_CLIENT_ID=your_agentbox_client_id
```

Where do these credentials come from? See the [External Services](#external-services) section below.

### Step 4 — Start the app

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

### Step 5 — Create the first admin account

The database starts completely empty. You need to create an admin user before you can use the admin dashboard.

**Option A — Use the signup page, then promote in the database:**
1. Go to http://localhost:3000/signup and create an account
2. Open MongoDB Atlas, find your user in the `users` collection
3. Change `role` from `"client"` to `"admin"` and save

**Option B — Update directly in the MongoDB Atlas shell:**
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

The admin dashboard is at http://localhost:3000/admin/dashboard.

---

## Project Structure

Here is what every folder and important file does. Read this before diving into any specific file.

```
ppm/
│
├── app/                        # Everything Next.js renders or serves lives here
│   │
│   │   ── Public pages (no login needed) ──────────────────────────────────
│   ├── page.tsx                # Home / landing page  →  /
│   ├── about/                  # About the company  →  /about
│   ├── blog/                   # Blog list  →  /blog
│   │   └── [slug]/             # Individual blog post  →  /blog/some-post
│   ├── buyers/                 # Buyers information  →  /buyers
│   ├── developers/             # Developers landing  →  /developers
│   ├── login/                  # Login page  →  /login
│   ├── signup/                 # Register a new account  →  /signup
│   ├── forgot-password/        # Request a password reset email  →  /forgot-password
│   ├── reset-password/         # Set a new password (via emailed link)
│   ├── access-denied/          # Shown when a user tries a page above their role
│   ├── account-rejected/       # Shown when an account has been rejected by admin
│   └── contact/                # Contact forms (general, buyer, developer)
│
│       ── Admin area (login required + role must be "admin") ──────────────
├── admin/dashboard/
│   ├── page.tsx                # Main dashboard with tabs  →  /admin/dashboard
│   ├── blogs/                  # Write and publish blog posts
│   ├── pages/                  # Manage CMS pages and sync them to Webflow
│   ├── content/                # Edit the text on public pages (about, landing, etc.)
│   ├── clients-panel/          # View and approve/reject buyer accounts
│   ├── developers-panel/       # View and manage developer accounts
│   ├── documents-panel/        # Upload files and assign them to users
│   ├── enquiries-panel/        # See all incoming contact enquiries
│   ├── esignature-panel/       # Send documents for digital signature via DocuSign
│   └── stats-panel/            # Charts and usage numbers
│
│       ── Client area (login required) ──────────────────────────────────
├── client/
│   ├── dashboard/              # Client home screen
│   ├── documents/              # Documents the admin has shared with the client
│   ├── enquiries/              # Client's own enquiries
│   ├── profile/                # Edit personal details
│   ├── portfolio/              # Browse available properties
│   └── vip/                    # Extra section for approved "existing clients" only
│
│       ── Developer area (login required + must be a developer-type client) ──
├── developer/
│   ├── page.tsx                # Public developer landing  →  /developer
│   ├── dashboard/              # Developer dashboard (private)
│   └── documents/              # Developer documents (private)
│
│       ── API endpoints ─────────────────────────────────────────────────
├── api/
│   ├── auth/                   # Login, signup, forgot/reset password, session handling
│   ├── admin/                  # All admin actions (CRUD for blogs, clients, documents, etc.)
│   ├── client/                 # Client's own data (documents, enquiries, profile)
│   ├── developer/              # Developer's own data
│   ├── blogs/                  # Public blog data (no auth needed)
│   ├── projects/               # Public property listings (no auth needed)
│   ├── contact/                # Handles contact form submissions
│   └── public/                 # Public CMS page content
│
│       ── Shared components ───────────────────────────────────────────────
├── components/
│   ├── ui/                     # Ready-made UI pieces (Button, Input, Card…)
│   │                           # Generated by shadcn — run: npx shadcn add <name>
│   ├── globe/                  # The interactive 3D globe on the landing page
│   ├── Navbar.tsx              # The navigation bar shown on every page
│   ├── Footer.tsx              # The footer shown on every page
│   ├── HeroCarousel.tsx        # Sliding image banner
│   ├── TestimonialCard.tsx     # Displays one testimonial
│   ├── SpotlightCard.tsx       # Card with a glowing hover effect
│   ├── Waves.tsx               # Animated wave background
│   └── Threads.tsx             # Animated strand/particle background
│
├── layout.tsx                  # The outer HTML shell — adds Navbar and Footer to every page
├── globals.css                 # Global styles and Tailwind imports
└── middleware.ts               # Controls which pages require login/admin
│                               # ← Edit this file to add new protected routes
│
├── models/                     # Database table definitions (MongoDB uses "collections")
│   ├── User.ts                 # Stores all user accounts (both admin and client)
│   ├── Project.ts              # Real estate properties listed in the portfolio
│   ├── Enquiry.ts              # Contact form submissions from buyers and developers
│   ├── BlogPost.ts             # Blog articles
│   ├── Page.ts                 # CMS pages that can be synced to Webflow
│   ├── Testimonial.ts          # Client testimonials
│   ├── AboutContent.ts         # Editable text for the About page
│   ├── BuyerContent.ts         # Editable text for the Buyers page
│   ├── DeveloperContent.ts     # Editable text for the Developers page
│   ├── LandingContent.ts       # Editable text for the Landing page
│   └── TestimonialContent.ts   # Testimonial section configuration
│
├── lib/                        # Helper files — logic that is shared across route handlers
│   ├── mongodb.ts              # Connects to the database (call connectDB() first in every route)
│   ├── email.ts                # Sends emails using the Resend service
│   ├── email-templates.ts      # The actual HTML content of emails (e.g. password reset)
│   ├── cloudinary.ts           # Connects to Cloudinary for image/file storage
│   ├── docusign.ts             # Sends documents for digital signature via DocuSign
│   ├── webflow-admin.ts        # Syncs CMS pages to the Webflow website
│   ├── agentbox.ts             # Sends enquiries to the AgentBox CRM system
│   ├── password-validation.ts  # Checks that a password is strong enough
│   └── utils.ts                # Small helpers used everywhere (e.g. merging CSS class names)
│
├── public/                     # Images and icons served directly (e.g. /logo.png)
├── patches/                    # Auto-applied fixes for third-party library bugs
├── auth.ts                     # Configures login — JWT sessions, credentials provider
├── next.config.ts              # Next.js settings (image domains, external packages)
├── netlify.toml                # Deployment settings for Netlify
├── package.json                # Lists all dependencies and available scripts
├── pnpm-lock.yaml              # Exact versions of every package — always commit this file
└── .env.local                  # Your secret credentials — NEVER commit this file
```

---

## How the App Works

### User roles and what they can access

The app has two roles: `admin` and `client`. Within the `client` role there are different types (`buyer_investor`, `developer`, `existing_client`) that control which sections a client can see.

| Who | Can access |
|---|---|
| Anyone (not logged in) | Public pages, blog, contact forms, login/signup |
| Any logged-in user | `/client/*` — their own dashboard, documents, enquiries |
| Developer-type clients | `/developer/*` — developer dashboard and documents |
| Existing clients (approved) | `/client/vip/*` — VIP section |
| Admin | Everything above, plus `/admin/*` |

### How login works

1. User submits email + password at `/login`
2. The server checks the password against the stored bcrypt hash in MongoDB
3. If correct, a signed JWT (a secure token) is saved in an HTTP-only cookie
4. The cookie expires after 1 hour — the user must log in again after that
5. Every protected page checks the cookie before loading (`app/middleware.ts`)

### How the database is accessed

The database is MongoDB, hosted on MongoDB Atlas (cloud). All the database table definitions ("schemas") are in the `models/` folder.

To query the database in an API route:
```ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();              // always call this first
  const users = await User.find();
  return Response.json(users);
}
```

**Never import `connectDB` in a component file** — it only works in server-side route handlers.

### How file uploads work

When an admin uploads a file, it goes to Cloudinary (a cloud file storage service), not to the server. The server just stores the file's URL in MongoDB. That URL is what gets displayed to users.

### How the Webflow sync works

The client's public marketing website runs on Webflow. When an admin creates or edits a CMS page in the admin dashboard, they can click "Sync to Webflow" to push that content to the Webflow site automatically. The code for this is in `lib/webflow-admin.ts`.

---

## External Services

The app connects to several external services. Each one needs its own account and API key (stored in `.env.local`).

| Service | What it does | Sign up at |
|---|---|---|
| **MongoDB Atlas** | Hosts the database | https://cloud.mongodb.com |
| **Resend** | Sends password reset emails | https://resend.com |
| **Cloudinary** | Stores uploaded images and documents | https://cloudinary.com |
| **DocuSign** | Sends documents for digital signature | https://developers.docusign.com |
| **Webflow** | The public marketing website (CMS sync) | https://webflow.com |
| **AgentBox** | Real estate CRM — receives enquiry leads | https://agentboxcrm.com.au |

> **Important:** Never paste real API keys into code files or commit them to git. Always keep them in `.env.local` only.

---

## Git Conventions

These rules keep the commit history readable for everyone on the team, including future developers who weren't here when the code was written.

### Branch names

Use a short prefix that describes the type of work, followed by a hyphenated description.

| Type of work | Pattern | Example |
|---|---|---|
| New feature | `feature/what-you-built` | `feature/developer-portal` |
| Bug fix | `fix/what-was-broken` | `fix/pdf-route-404` |
| Refactoring code | `refactor/what-changed` | `refactor/navbar-layout` |
| Visual / styling | `ui/what-changed` | `ui/admin-tab-colours` |
| Urgent production fix | `hotfix/what-was-broken` | `hotfix/login-loop` |
| Documentation | `docs/what-you-wrote` | `docs/api-setup-guide` |

**Rules:**
- Lowercase letters and hyphens only
- Keep it short — 2 to 4 words
- Branch from `main` and merge back into `main` via a pull/merge request
- Delete your branch after it has been merged

---

### Commit messages

Every commit needs a **type prefix**, followed by a colon, followed by a short description.

```
<type>: <what you did, written as a command>
```

**Types:**

| Prefix | Use when… |
|---|---|
| `feat:` | You added something new |
| `fix:` | You fixed a bug |
| `refactor:` | You reorganised code without changing how it works |
| `style:` | You changed colours, spacing, or CSS only |
| `docs:` | You updated documentation or comments |
| `chore:` | You updated a config file or dependency |

**The description:**
- Write it as a command — "add login page", not "added login page" or "adding login page"
- Keep it under 50 characters
- No capital letter at the start, no full stop at the end

**Good commit messages:**
```
feat: add DocuSign eSignature panel to admin dashboard
fix: resolve pdf route 404 on Netlify deploy
refactor: extract agentbox enquiry logic into lib/agentbox.ts
style: update admin tab strip background colour
chore: update pnpm lockfile after dependency change
docs: add environment variable reference to README
```

**Bad commit messages:**
```
fix things           ← too vague
update               ← no description
Added login page     ← wrong tense, capital letter
WIP                  ← never commit "work in progress" to main
more changes for netlify   ← still too vague
```

**When you need to explain more**, add a blank line after the summary and write a longer explanation below:
```
fix: prevent duplicate MongoDB connections in development

Next.js hot-reload creates a new module instance on every file
save. Without caching the connection, each save opened a new
connection to Atlas and eventually hit the connection limit.
```

---

### Naming things in code

| What | Style | Example |
|---|---|---|
| React component files | PascalCase | `HeroCarousel.tsx` |
| Pages and API routes | lowercase (Next.js requires this) | `page.tsx`, `route.ts` |
| Helper / utility files | camelCase or kebab-case | `agentbox.ts`, `email-templates.ts` |
| Database model files | PascalCase matching the collection | `User.ts`, `BlogPost.ts` |
| Environment variables | UPPER_SNAKE_CASE | `MONGODB_URI` |
| TypeScript interfaces | PascalCase with `I` prefix | `IUser`, `IAssignedDocument` |
| CSS files | kebab-case | `globals.css` |

---

## Common Tasks

### Add a new page

1. Create a folder under `app/` matching the URL you want (e.g. `app/pricing/`)
2. Add a `page.tsx` file inside it
3. If the page should require login, add the path to the matcher in `app/middleware.ts`

### Add a new database field

1. Open the relevant model in `models/` (e.g. `models/User.ts`)
2. Add the field to the Mongoose schema
3. Add it to the TypeScript interface at the top of the file
4. MongoDB will start storing the new field automatically — no migration needed

### Add a new API endpoint

1. Create a folder under `app/api/` matching the URL (e.g. `app/api/admin/reports/`)
2. Add a `route.ts` file with exported functions for each HTTP method:
```ts
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  // ... your logic here
}
```

### Add a new UI component

Run the shadcn CLI to generate an accessible, pre-styled component:
```bash
npx shadcn add <component-name>
# Examples:
npx shadcn add dialog
npx shadcn add table
npx shadcn add select
```
The file will appear in `app/components/ui/`.

### Reset an admin password

**Via the forgot password flow (easiest):**
1. Go to `/forgot-password`
2. Enter the admin email address
3. Check the inbox for a reset link (sent via Resend)
4. Follow the link and set a new password

**Via the database (if email is not working):**
You need to generate a bcrypt hash of the new password, then update it in MongoDB Atlas:
```js
// In MongoDB Atlas → Data Explorer → users collection → find the user
// Replace the passwordHash field with a bcrypt hash of the new password
// (use bcrypt.hashSync("NewPassword1!", 10) in a Node.js script)
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { passwordHash: "<new-bcrypt-hash>" } }
)
```

Password requirements: at least 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.

---

## Available Scripts

```bash
pnpm dev        # Start the development server (http://localhost:3000)
pnpm build      # Build the app for production
pnpm start      # Run the production build locally
pnpm lint       # Check the code for errors and style issues
```

---

## Troubleshooting

### "Please define the MONGODB_URI environment variable"
Your `.env.local` file is missing or the variable is not set. Make sure the file exists in the project root (not inside any subfolder).

### Login always fails even with the right password
- Check that your MongoDB Atlas cluster allows connections from your IP address (Atlas → Network Access)
- Check that the user's `accountStatus` in the database is not `"rejected"`

### The app works locally but not on Netlify
- Check that all environment variables from `.env.local` have been added in the Netlify dashboard (Site Settings → Environment Variables)
- Make sure `NEXT_PUBLIC_APP_URL` is set to the Netlify URL, not `http://localhost:3000`

### DocuSign says "consent_required"
Open the URL printed in the terminal error message in your browser and click Accept. This only needs to be done once.

### Webflow sync fails
- Check that `WEBFLOW_API_TOKEN` is still valid (tokens can expire)
- Make sure the field names in Webflow's collection exactly match what `lib/webflow-admin.ts` sends

### Images are not loading
- Check that `CLOUDINARY_URL` is set correctly in your environment
- Images must be hosted on `res.cloudinary.com` — the app blocks images from other domains for security
