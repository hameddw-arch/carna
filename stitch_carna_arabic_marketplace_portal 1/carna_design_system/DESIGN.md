---
name: CARNA Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4f4632'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#827660'
  outline-variant: '#d4c5ab'
  surface-tint: '#785900'
  primary: '#785900'
  on-primary: '#ffffff'
  primary-container: '#ffc107'
  on-primary-container: '#6d5100'
  inverse-primary: '#fabd00'
  secondary: '#0061a4'
  on-secondary: '#ffffff'
  secondary-container: '#33a0fd'
  on-secondary-container: '#00355c'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#cbcbcb'
  on-tertiary-container: '#555555'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf9e'
  primary-fixed-dim: '#fabd00'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#9ecaff'
  on-secondary-fixed: '#001d36'
  on-secondary-fixed-variant: '#00497d'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  surface-white: '#FFFFFF'
  border-light: '#E0E0E0'
  text-primary: '#000000'
  text-muted: '#757575'
  verification-blue: '#2196F3'
  accent-yellow: '#FFC107'
typography:
  display-lg:
    fontFamily: Tajawal
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
  headline-lg:
    fontFamily: Tajawal
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Tajawal
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Tajawal
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Tajawal
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Tajawal
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Tajawal
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Tajawal
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Tajawal
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Tajawal
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style

The design system for CARNA is engineered for speed, reliability, and precision. It serves a dual-purpose marketplace: a high-intent car trading platform and a trustworthy workshop directory. The brand identity is captured by the slogan "کارنا... والكار كارنا," which emphasizes professional mastery and belonging in the automotive industry.

The visual style is **Corporate Modern with a Minimalist focus**. It utilizes a "Flat Card UI" philosophy to ensure maximum performance and clarity. By stripping away heavy shadows and complex gradients, the system prioritizes rapid information scanning—essential for users comparing vehicle specs or looking for urgent mechanical help. The aesthetic is sharp, functional, and unapologetically professional, utilizing high-contrast elements to guide user action.

## Colors

The palette is built on high-visibility contrast. **Pure White (#FFFFFF)** serves as the primary canvas to maintain a clean, "ultra-fast" feel. **Black (#000000)** is reserved for primary typography and structural grounding elements like the footer and navigation headers.

**Yellow (#FFC107)** is the primary highlight color. It is used sparingly but strategically for high-priority CTAs and status indicators, demanding attention without cluttering the UI. **Blue (#2196F3)** is dedicated to "Verified" badges, trust markers, and secondary action links. **Light Gray (#F5F5F5)** provides the necessary separation for section backgrounds and card borders, ensuring the layout remains organized without the need for heavy elevation.

## Typography

This design system uses **Tajawal** for its geometric clarity and exceptional readability in Right-to-Left (RTL) contexts. The type scale is strictly enforced to maintain hierarchy in data-dense car listings. 

- **Headlines:** Set in Bold (700) or Medium (500) weights to provide immediate structure. 
- **Body Text:** Optimized at 16px for general content to ensure comfort during long reading sessions (e.g., technical car descriptions).
- **Labels:** Used for technical specs (mileage, year, fuel type) and verification badges, utilizing Medium weights to stand out even at smaller sizes.
- **RTL Alignment:** All typography is right-aligned by default. Numerical data (prices, years) should use standard Arabic numerals (123...) for international clarity within the Arabic layout.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop and a **Fluid** model for mobile, ensuring the CARNA platform feels like a high-end tool.

- **Grid:** A 12-column grid is used for desktop (1280px max width) with 16px gutters.
- **RTL Flow:** All layouts mirror the standard Western flow. The "Start" of the page is the right side. Sidebars, navigation icons, and back buttons are positioned to support right-to-left scanning.
- **Rhythm:** An 8px spatial system (with a 4px half-step) governs all padding and margins. 
- **Mobile:** Margins are set to 16px to maximize screen real estate for vehicle images, which are the primary drivers of user engagement.

## Elevation & Depth

This design system avoids traditional shadows to maintain its "ultra-fast" and flat aesthetic. Instead, hierarchy is created through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** The primary background is White. Secondary content areas (like filter sidebars or specification tables) use Light Gray (#F5F5F5).
- **Borders:** Cards and input fields are defined by a 1px solid border (#E0E0E0).
- **Active States:** When an element is focused or active, the border color shifts to the Primary Yellow or Verification Blue, rather than increasing shadow depth. This keeps the UI feeling light and performant.
- **Interactions:** Subtle background color shifts (e.g., from White to a slightly darker Gray) indicate hover states on clickable list items or cards.

## Shapes

The shape language is **Rounded**, balancing the industrial nature of the automotive world with modern digital friendliness. 

- **Cards & Inputs:** Use a 0.5rem (8px) base radius. This is soft enough to feel modern but sharp enough to maintain a professional, structured grid.
- **Large Components:** Images and large featured containers use a 1rem (16px) radius to draw the eye.
- **CTAs:** Primary buttons maintain the 0.5rem radius to match the input fields, creating a cohesive "form" language.

## Components

- **Buttons:** Primary buttons use a solid Yellow (#FFC107) background with Black text. No gradients. Secondary buttons use a 1px Black or Blue border with transparent backgrounds.
- **Cards:** Cards are the core of the marketplace. They feature 1px Gray borders, 8px rounded corners, and no shadows. In RTL, the car image is typically on the right for horizontal cards, with text and price on the left.
- **Chips/Badges:** Used for car features (e.g., "Automatic", "Sunroof"). These use a Light Gray background with small 12px Medium-weight text. "Verified" badges must use the Secondary Blue (#2196F3).
- **Input Fields:** Flat design with a 1px border. Labels are positioned above the field, right-aligned. Error states use a bold red border and text.
- **Lists:** Workshop and directory listings use a clean, row-based format with 1px dividers. Every row is a high-speed touch target.
- **Price Tags:** Prices are always emphasized using Headline-MD or Headline-SM styles, often highlighted with a subtle Yellow background tint or bold Black text.