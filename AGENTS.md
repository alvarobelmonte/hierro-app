# AGENTS.md

You are an expert in **Next.js (App Router)**, **PWA (Progressive Web Apps)**, **React**, **TypeScript**, and **Supabase**. You write functional, maintainable, performant, and accessible code following modern industry standards and the specific skills provided for this project.

## Project Context
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (maximum flexibility, dynamic designs, premium aesthetics).
- **Database**: Supabase (Postgres) with Row-Level Security (RLS).
- **Architecture**: Scalable component composition and mobile-first responsive design.
- **Goal**: A high-end PWA with rich aesthetics and "pro" visual excellence.

## 🛠 Skills Usage Guidelines

This project utilizes specific skills to ensure quality. Use them as follows:

1.  **`ui-ux-pro-max`**: 
    - **When**: Designing new UI, choosing color palettes/typography, or starting new pages.
    - **Action**: Always generate a design system first using `python3 skills/ui-ux-pro-max/scripts/search.py --design-system`.
    - **Focus**: Premium aesthetics, vibrant colors, glassmorphism, and dynamic animations.

2.  **`vercel-react-best-practices`**:
    - **When**: Writing Next.js components, implementing data fetching, or optimizing performance.
    - **Focus**: Eliminating waterfalls (`Promise.all`), bundle size optimization (`next/dynamic`), and Server-Side performance.

3.  **`web-design-guidelines`**:
    - **When**: Reviewing UI code or auditing for accessibility.
    - **Focus**: WCAG AA compliance, focus management, and semantic HTML.

4.  **`supabase-postgres-best-practices`**:
    - **When**: Writing SQL, designing schemas, or implementing RLS.
    - **Focus**: Query performance, connection management, and security.

5.  **`vercel-composition-patterns`**:
    - **When**: Designing reusable component APIs or refactoring complex components.
    - **Focus**: Avoiding boolean prop proliferation, using Compound Components, and React 19 patterns.

## 🚀 Development Principles

### TypeScript Best Practices
- Use strict type checking and avoid `any`.
- Prefer interfaces for public APIs and types for unions/aliases.
- Use generated Supabase types for all database interactions.

### Next.js & React Best Practices
- **Server Components**: Prefer Server Components by default. Use Client Components only for interactivity or browser-only APIs (`'use client'`).
- **Data Fetching**: Fetch data as close as possible to where it's used. Parallelize independent fetches.
- **Streaming**: Use `loading.tsx` and `Suspense` for better perceived performance.
- **Server Actions**: Use Server Actions for all data mutations.

### 📱 PWA & Mobile-First
- **Responsive**: Designs must work perfectly from 375px to 4K.
- **Touch**: Min 44x44px touch targets. No hover-only critical interactions.
- **Offline**: Ensure service worker handles caching for a native-like experience.

### 🎨 Design & Aesthetics
- **Visual Excellence**: Avoid generic colors. Use curated, harmonious palettes (HSL) and smooth gradients.
- **Glassmorphism**: Use subtle transparency and background blurs for a premium feel.
- **Micro-animations**: Implement smooth transitions (150-300ms) for all interactive states.
- **Icons**: Use SVG icons (Lucide/Heroicons), never emojis as UI icons.

### 🛠 Git & Commits
- **Conventional Commits**: Always follow the Conventional Commits specification for all commit messages.
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools and libraries
  - `ci`: Changes to CI configuration files and scripts

### 🏗 Component Architecture
- **Composition over Props**: Instead of `<Button loading={true} error={false} />`, use composition where appropriate or explicit variants.
- **Stability**: Use stable IDs for all interactive elements to facilitate automated testing.
- **Consistency**: All components must use the central design tokens defined in the CSS variables.

## 🔒 Security & Database
- **RLS**: Never create a table without a strict RLS policy.
- **Validation**: Validate all inputs using libraries like Zod, both on the client and in Server Actions.
