# Utsav Studio (उत्सव स्टूडियो)
**Har Khushi Ka Digital Nimantaran • हर खुशी का डिजिटल निमंत्रण**

Utsav Studio is a 100% free digital invitation creation platform tailored specifically for Indian celebrations — weddings, birthdays, engagements, anniversaries, baby showers, housewarming ceremonies, and religious gatherings.

---

## 🌟 Core Product Rules & Commitments

1. **Zero Sign-up Barrier**: Public users can create, edit, and export invitations immediately without registering or providing phone numbers.
2. **100% Free Forever**: No locked premium tiers, hidden paywalls, or export fees.
3. **No Watermarks**: Pristine, watermark-free high-definition exports in 9:16 mobile format.
4. **Device-First Privacy**: User photos, text, and invitations are stored locally in **IndexedDB**.
5. **In-Browser Video & Card Rendering**: Video reels and card designs compile client-side; user media is never harvested by external servers.
6. **Bilingual Typography**: Authentic Devanagari Hindi Unicode fonts (Rozha One, Yatra One, Noto Sans Devanagari) and royal English fonts (Cinzel, Plus Jakarta Sans, Great Vibes).
7. **Secure Admin Portal**: Dedicated admin authentication via Supabase.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a warm Indian festive palette (Ivory, Gold, Deep Royal Purple, Rani Magenta)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Storage**: [IndexedDB via `idb`](https://github.com/jakearchibald/idb) for client-side project persistence
- **Backend & Admin Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Asset CDN**: [Cloudinary](https://cloudinary.com/) (configured for template catalog assets)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Scalable Folder Structure

```
d:\Utsav-Studio\
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration with @/* path alias
├── tailwind.config.ts        # Design tokens: ivory, gold, royal, magenta
├── postcss.config.mjs        # PostCSS configuration
├── next.config.mjs           # Next.js image domain permissions
└── src/
    ├── app/
    │   ├── layout.tsx        # Root layout with Google Fonts (Cinzel, Rozha, etc.)
    │   ├── globals.css       # Festive patterns, gradients, and custom scrollbars
    │   ├── page.tsx          # Home page with hero, categories, why choose us
    │   ├── loading.tsx       # Festive loader with Om/Ganesh motif
    │   ├── error.tsx         # Client error boundary with graceful retry
    │   ├── not-found.tsx     # Custom 404 page
    │   ├── wedding/          # Wedding & Shubh Vivah collection
    │   ├── birthday/         # Birthday celebrations & milestones
    │   ├── engagement/       # Roka & Ring Ceremony collection
    │   ├── anniversary/      # Silver 25th & Golden 50th jubilees
    │   ├── other-events/     # Griha Pravesh, Baby Shower, Puja invites
    │   ├── templates/        # Interactive template gallery with live filters
    │   ├── card-editor/      # Card editor shell with live preview & export
    │   ├── video-editor/     # Video reel editor shell with browser rendering
    │   ├── my-projects/      # Local IndexedDB vault for saved drafts
    │   ├── help/             # Help center & Hindi typing guides
    │   ├── about/            # Story of Utsav Studio & 5 pillars
    │   ├── contact/          # Feedback & template request form
    │   ├── privacy/          # Privacy manifesto & zero-harvesting policy
    │   └── admin/
    │       ├── login/        # Secure Supabase admin login
    │       └── dashboard/    # Template catalog & service metrics
    ├── components/
    │   ├── common/           # Button, Container, Badge, SectionHeading, DecorativeMotif
    │   ├── home/             # Hero, CategoryGrid, FeaturedInvitations, WhyChooseUs, Faq
    │   ├── layout/           # Responsive Header, Footer, LanguageSwitch
    │   └── templates/        # TemplateCard with format & language indicators
    ├── lib/
    │   ├── constants/        # siteConfig, categories, sample templates
    │   ├── storage/          # db.ts (IndexedDB helper functions)
    │   ├── store/            # useEditorStore.ts, useLanguageStore.ts
    │   ├── supabase/         # client.ts (Safe Supabase wrapper)
    │   └── utils/            # cn.ts (Tailwind merge helper)
    └── types/
        ├── editor.ts         # Canvas elements & editor state types
        ├── project.ts        # Local project schema
        └── template.ts       # Template metadata & category types
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for public features)
Copy the example environment file:
```bash
cp .env.example .env.local
```
Update with your Supabase and Cloudinary credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```
*Note: The public invitation creator, IndexedDB local storage, and template browsing work out-of-the-box even without remote backend credentials.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
