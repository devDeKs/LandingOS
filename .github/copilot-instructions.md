# Microsonic Hub - AI Copilot Instructions

## Project Overview
**LandingOS** is a premium React + Vite web application for luxury real estate & high-end service marketing. The site combines animated shader backgrounds, scroll-based interactions, and minimal UI patterns to create high-conversion landing pages. Portuguese content targets Brazilian luxury market.

## Architecture & Key Components

### Tech Stack
- **Framework**: React 19 with React Router v7 for multi-page routing
- **Build**: Vite v7.2.4 with `@vitejs/plugin-react` (Babel-powered Fast Refresh)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Animation**: 3 complementary libraries (NOT interchangeable):
  - **GSAP 3.13** - Timeline-based, choreographed sequences (use for staggered reveals)
  - **Framer Motion 12** - Spring physics animations (use for interactive hover/scroll states)
  - **Three.js + React Three Fiber** - WebGL shaders for animated backgrounds
- **Icons**: Lucide React (tree-shakeable icon library)
- **3D**: React Three Fiber v9.4 with Drei helpers

### Project Structure
```
src/
├── pages/           # Route pages (HomePage, ChatPage)
├── components/      # Reusable UI components
│   ├── *Section.jsx # Landing page sections with scroll triggers
│   ├── ui/          # Primitive components (neural-network-hero, display-cards)
│   └── Shader*.jsx  # Three.js shader components
├── lib/utils.js     # Utility functions (classname merging, etc.)
└── App.jsx          # Router configuration
```

## Critical Patterns & Conventions

### Animation Pattern Hierarchy
**DO NOT MIX animation libraries in same element**. Use this decision tree:

1. **Timeline choreography** (multiple elements in sequence) → **GSAP + useGSAP()**
   - Example: `HeroSection.jsx` word-by-word reveal with blur/scale/position
   - Pattern: `useGSAP(() => { gsap.to(...).stagger(0.15) }, { scope })`

2. **Interactive state changes** (hover/focus/scroll) → **Framer Motion**
   - Example: `FloatingNavbar.jsx` opacity/blur on scroll
   - Pattern: `useTransform(scrollY, [trigger, end], [startVal, endVal])`

3. **Animated backgrounds** (WebGL/shaders) → **React Three Fiber**
   - Shader materials extend using `shaderMaterial()` from `@react-three/drei`
   - Update uniforms in `useFrame()` hook
   - Always set `dpr={[1, 1.5]}` for device pixel ratio

### Color & Design System
- **Primary Palette**: Deep purples (#030014, #140033, #4000BF, #6000BF)
- **Accent**: Violet/Indigo gradients for CTAs
- **Background**: `#030014` (almost black with purple undertones)
- **Text**: White with opacity variants (`/90`, `/75`, `/50`, `/30`)
- **Borders**: `border-white/10` or `border-white/5` for subtle glass effect

**Tailwind Extensions** (in `tailwind.config.js`):
- Custom colors: `space-black`, `titanium`, `glass-border`
- Custom gradient: `glass-gradient`

### Component Communication
- **Navigation**: Use React Router's `useNavigate()` + `navigate(path, { state: {...} })`
- **Parent → Child State**: Pass as props (see `HeroSection` receiving `onOpenChat`, `title`, `description`)
- **Shared Refs**: Use `useRef()` for GSAP animations within component scope
- **Global Scroll**: `useScroll()` from Framer Motion (NOT manual scroll listeners)

### Tailwind + Animations
- Use `animate-*` classes for simple keyframe animations (e.g., `animate-pulse`)
- For complex sequences, use GSAP instead of Tailwind classes
- Example: `.animate-blob` class chains multiple animations via `animation-delay-*`

### Shader Pattern (Critical for Performance)
**Location**: `src/components/ShaderBackground.jsx` defines reusable shader material

```jsx
const CPPNShaderMaterial = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector2(1, 1) }, // uniforms
  vertexShader,
  fragmentShader
);
extend({ CPPNShaderMaterial }); // Register with Three.js
```

**When adding new shader effects**:
1. Define vertex/fragment shader strings
2. Create material with `shaderMaterial()` (includes uniform definitions)
3. Use `useFrame()` to update time-based uniforms
4. Always test with `dpr={[1, 1.5]}` on mobile

## Developer Workflows

### Local Development
```powershell
npm install                 # Install dependencies
npm run dev                 # Start Vite dev server (HMR enabled)
npm run build               # Production build
npm run lint                # Run ESLint
npm run preview             # Serve production build locally
```

### Debugging Common Issues
- **Animations stuttering**: Check if multiple animation libraries are fighting (use devtools to inspect refs)
- **Shader not loading**: Verify `extend()` call after `shaderMaterial()` definition
- **Styles not applying**: Check Tailwind content paths in `tailwind.config.js`
- **Router state not persisting**: Use `useLocation().state` instead of URL params for sensitive data

### ESLint Configuration
- Project uses flat config (`eslint.config.js`)
- React Hooks rules enforced
- Ignores: `dist/` directory
- Custom rule: Unused vars OK if SCREAMING_SNAKE_CASE (constants)

## Integration Points & External Data

### Routing Boundaries
- **HomePage**: Landing page with all sections; entry point
- **ChatPage**: Modal-like interface receiving user input via route state
- Both share `ShaderBackground`, `FloatingNavbar` (reusable pattern)

### Asset Locations
- Images: `/public/` directory (e.g., `/dashboard-dark.png`)
- Fonts: Reference via Google Fonts or Tailwind fontFamily
- Icons: Use Lucide React (e.g., `import { User, Menu } from 'lucide-react'`)

### No Backend Assumption
- This is a static marketing site
- Chat functionality is UI-only (no API calls visible)
- If adding backend: Use `.env.local` for API URLs, never hardcode endpoints

## Project-Specific Conventions

### Naming Patterns
- **Sections**: PascalCase ending in `Section` (e.g., `HeroSection.jsx`, `PhilosophySection.jsx`)
- **UI components**: PascalCase (e.g., `ContainerScroll.jsx`)
- **Utility functions**: camelCase (e.g., `utils.js` → `cn()` for classname merging)
- **CSS classes**: Tailwind utility-first; rarely use custom CSS

### Composition Pattern
Sections receive configuration via props, not internal state:
```jsx
// ✓ Correct: Section accepts content as props
<HeroSection title="..." description="..." onOpenChat={handler} />

// ✗ Avoid: Sections with hardcoded content in 10+ places
```

### Responsive Breakpoints
Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`. Example:
```jsx
className="text-6xl sm:text-7xl md:text-8xl"  // ✓ Progressive enhancement
```

### Accessibility Notes
- Use semantic HTML (rarely needed; mostly `<div>` + roles)
- Icons should have ARIA labels if not decorative
- Buttons use `<button>` elements, not `<div>` with onClick
- Form inputs (textarea) have proper label association

## What NOT To Do

1. **Don't import CSS directly** - Use Tailwind utility classes only
2. **Don't mix GSAP + Framer Motion on same element** - Pick one per element
3. **Don't use `animate-*` for complex sequences** - Use GSAP timeline instead
4. **Don't hardcode colors** - Use Tailwind classes or `tailwind.config.js` extensions
5. **Don't forget useGSAP dependency** - Always include `{ scope }` to prevent memory leaks
6. **Don't use old React patterns** - React 19 supports hooks-only; no class components

## When Adding New Features

### New Section Component
1. Create `src/components/NewSection.jsx`
2. Accept props: `{ title?, description?, onAction? }`
3. Use GSAP for entrance animations with `useGSAP({ scope })`
4. Add ID to root element for scroll anchors: `id="new-section"`
5. Export as named export

### New Page Route
1. Create `src/pages/NewPage.jsx`
2. Include `<ShaderBackground />` for visual consistency
3. Use `useNavigate()` for internal linking
4. Add route in `App.jsx`: `<Route path="/new" element={<NewPage />} />`

### New Animation
1. Check if Framer Motion scroll trigger fits (interactive) → use `useTransform()`
2. Else check if GSAP timeline needed (choreographed) → use `useGSAP()`
3. Else if visual effect → consider shader in `ShaderBackground.jsx`

## References
- **Tailwind Documentation**: Check config for custom colors (purple palette)
- **GSAP useGSAP Hook**: Always pass `{ scope }` to prevent global timeline pollution
- **React Three Fiber**: Shader materials must be extended before use
- **Vite Config**: Tailwind CSS plugin already configured via `@tailwindcss/vite`
