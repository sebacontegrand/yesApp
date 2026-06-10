# Walkthrough — YesCard

A Next.js 14+ (App Router) shareable invitation application called **YesCard**. The application allows creators to design custom step-by-step invitation questionnaire cards where recipients are prompted to say YES (the NO button escaping on hover or touch approach).

---

## 🚀 Accomplishments

### 1. Landing Page (`/`)
- Immersive editorial hero section featuring a custom Playfair Display serif font and Inter body sans.
- **Interactive mini-demo** card built with `framer-motion` spring physics, allowing visitors to test the escaping NO button directly on the homepage before starting the creator flow.
- A card listing the 3 steps of creating, customize, and sharing to explain the product mechanics clearly.

### 2. Invitation Creator Wizard (`/create`)
- A 4-step wizard interface:
  - **Step 1 (Identity)**: Form inputs for the creator's name and main question, coupled with custom avatar selectors (emojis) and card gradient themes (rose, violet, ocean, sunset, forest, noir).
  - **Step 2 (YES Flow Steps)**: A questionnaire designer allowing creators to add, remove, and reorder steps using `@hello-pangea/dnd` drag-and-drop. Supported question formats include Inline Calendars, Single/Multi-Choice Emoji Grids, and Free Text.
  - **Step 3 (Celebration Settings)**: Input custom header titles, subtitles, and toggle a canvas confetti celebration.
  - **Step 4 (Share Panel)**: Instantly serializes the configuration as URL-safe Base64. Renders a QR code (`qrcode.react`), copy link button, and WhatsApp deep-linking direct reply.
- **Live Mobile Card Preview**: A side-by-side phone mock frame rendering all configuration changes in real time.

### 3. Recipient Invitation Page (`/card?data=[base64]`)
- Decodes URL-safe Base65 configuration. If invalid, displays a friendly error state.
- **Hook Invitation Screen**: Displays the sender's avatar, name, and question.
  - YES button: satisfying heart pulse infinite animation.
  - NO button: mouse hover reposition (desktop), touch proximity reposition (mobile - within 80px).
  - Teleportation threshold: disappears after 3 attempts, revealing lock text: "Looks like there's only one answer 😏".
- **Questionnaire Cards**: Progress indicator dots and slide-in/out transitions using `framer-motion`. Includes a custom styled inline calendar, emoji card grid, and text-area counter.
- Redirects to `/confirmed` on completion, passing config and answers as Base64.

### 4. Confirmed Status Page (`/confirmed?data=[base64_config]&answers=[base64_answers]`)
- Displays customized celebration headers.
- Triggers a confetti animation on mount (using `canvas-confetti`) if enabled by the creator.
- Summarizes the recipient's answers matching their respective custom labels and icons in a clean layout.
- "Share Your Excitement" CTA: opens WhatsApp with pre-filled, nicely formatted answers text back to the sender.

---

## 🛠️ Tech Stack & Packages Installed

- **Framework**: Next.js 16.2.9 (App Router)
- **UI/Logic**: React 19.2.4 & TypeScript
- **Styling**: Tailwind CSS v4 & custom glassmorphic properties
- **Animations**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **Utilities**: canvas-confetti, qrcode.react, clsx, tailwind-merge, class-variance-authority, Radix UI primitives.

---

## 🧪 Validation & Testing

### 1. URL-Safe Base64 Serialization
Refactored the Base64 serialization codecs (`lib/codec.ts`) to be fully URL-safe:
- Replaces standard Base64 `+` and `/` characters with URL-safe `-` and `_`.
- Strips padding `=` signs at the end of configurations.
- Sanitizes incoming URLs that may have converted `+` to spaces during transfer (e.g. through WhatsApp or manual typing) by mapping spaces back to `+` before decoding.
- Resolves `InvalidCharacterError` on `atob` across all browsers.

### 2. Build Verification
Verified Next.js production builds compile without type-checking or layout configuration conflicts:
```bash
npm run build
```
**Status**: `Compiled successfully` and type-checked in `Finished TypeScript in 1112ms`.

### 3. Code Quality & Standards
Configured custom ESLint overrides for React 19 types support and validated all sources cleanly:
```bash
npm run lint
```
**Status**: `0 errors, 0 warnings`.
