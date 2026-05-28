---
name: Voltage Velocity
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#504532'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#837560'
  outline-variant: '#d5c4ac'
  surface-tint: '#7c5800'
  primary: '#7c5800'
  on-primary: '#ffffff'
  primary-container: '#fdb700'
  on-primary-container: '#6a4b00'
  inverse-primary: '#ffbb1c'
  secondary: '#0058bb'
  on-secondary: '#ffffff'
  secondary-container: '#1471e6'
  on-secondary-container: '#fefcff'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#c3c3c3'
  on-tertiary-container: '#4f5151'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea7'
  primary-fixed-dim: '#ffbb1c'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc7ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Archivo Narrow
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Archivo Narrow
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system employs a **Neo-Brutalist** aesthetic characterized by high-energy visuals, stark contrast, and structural honesty. Designed for a modern car marketplace, it rejects traditional soft gradients and subtle depth in favor of a "Flat Pop" philosophy. The interface should feel kinetic, authoritative, and unapologetically bold.

The target audience is energetic and decisive. The UI evokes a sense of urgency and transparency through thick strokes and vibrant saturation. Every interactive element is framed by heavy "ink" borders, creating a tactile, comic-book-inspired clarity that makes the automotive inventory feel iconic rather than just functional.

## Colors

The palette is driven by high-impact saturation. 
- **Primary (Bright Yellow):** Used for the global background and high-level containers to establish the brand's energetic identity.
- **Secondary (Google Blue):** Reserved for primary actions, links, and highlighted status indicators to provide a functional contrast against the yellow.
- **Surface (White):** Used for card interiors and input fields to ensure content legibility and provide visual "breathing room" amidst the bold colors.
- **Borders/Text (Deep Black):** Every element is defined by this color. It provides the structural skeleton of the design system.

## Typography

We use **Archivo Narrow** across the entire system. Its condensed nature mimics technical specifications and automotive engineering while allowing for massive, impactful headlines that don't crowd the horizontal space.

- **Headlines:** Must always be Bold or Extra Bold (700-800 weight). Use tight letter spacing for display text.
- **Body:** Maintains a medium weight (500) to ensure readability against high-saturation backgrounds.
- **Labels:** Always uppercase with slight tracking (letter-spacing) to create a "tag" effect for car specs and prices.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns, 1200px max-width) and a fluid single-column model on mobile. 

The spacing philosophy is "roomy but rigid." We use an 8px base unit. 
- **Desktop:** 24px gutters provide clear separation between car listing cards.
- **Mobile:** Margins shrink to 16px, but internal padding within cards remains generous (24px) to emphasize the heavy borders.
- **Alignment:** All elements must align to the grid edges; do not use centered layouts for content blocks. Everything is left-aligned to reinforce the structural, technical feel.

## Elevation & Depth

This system avoids all forms of soft shadows, blurs, or gradients. Depth is strictly communicated through **Hard Offset Shadows**.

- **Level 0 (Flat):** Secondary information or passive containers. 2px black border, no shadow.
- **Level 1 (Interactive):** Standard buttons and hover states. 2px black border with a 4px black shadow offset to the bottom-right (4px 4px 0px 0px #1A1A1A).
- **Level 2 (Active/Prominent):** Key CTAs like "Buy Now" or "Book Test Drive." 2px black border with an 8px black shadow offset (8px 8px 0px 0px #1A1A1A).

When an element is "pressed," the shadow should disappear, and the element should translate 4px or 8px down and right to meet the shadow's original position, simulating a physical mechanical press.

## Shapes

The shape language is "Chunky Geometry." We use a consistent **8px border radius** (Level 2) across all primary UI components including buttons, cards, and input fields.

- **Standard Elements:** 8px radius.
- **Small Elements (Chips/Tags):** 4px radius.
- **Exceptions:** Icons and decorative geometric patterns may use 0px radius to emphasize the "raw" brutalist feel when used as background accents.

## Components

- **Buttons:** Backgrounds must be either White or Blue. 2px Black border. Primary buttons use the 4px hard black shadow. Text is always Archivo Narrow Bold.
- **Car Cards:** Pure White background. 2px Black border. No shadow unless hovered. Price tags within cards should be "pinned" to the top right with a Bright Yellow background and 2px border.
- **Input Fields:** Pure White background. 2px Black border. Placeholder text in 50% opacity Black. On focus, the border thickness remains 2px but the background shifts to a very pale tint of the primary yellow.
- **Chips (Specs):** Used for "Automatic," "Petrol," etc. Small 4px radius, White background, 2px Black border, Label-md typography.
- **Checkboxes:** Square with an 2px radius. When checked, the fill is Blue (#1A73E8) with a heavy Black checkmark icon.
- **Navigation:** Top-bar should have a 2px Black bottom-border only. Navigation links use Label-lg typography and turn Blue on hover.