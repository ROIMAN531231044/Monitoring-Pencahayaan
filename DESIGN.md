---
name: Lumen & Circuit Telemetry
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#23b2ec'
  on-tertiary-container: '#00415a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  telemetry-metric:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.03em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system serves mission-critical electrical engineering platforms, industrial IoT monitoring hubs, and automated lux/power telemetry environments. The aesthetic blends high-precision technical instrumentation with a sleek, cyber-electric dark interface. It establishes visual authority through immediate contrast, dense information telemetry, and luminous feedback that mimics physical LED instrumentation and energized circuits.

### Design Movement & Influence
- **Cyber-Electric Glassmorphism & High-Precision Technical HUD:** Translucent Obsidian glass panels (`backdrop-filter: blur(12px)`) accented by sharp, hair-thin electrical conduits (`rgba(56, 189, 248, 0.15)`).
- **Signal-Driven Hierarchy:** Information density is treated with mathematical rigor. Structural frames remain pitch-dark to prioritize active current, voltage, photon count, and lux threshold states.
- **Sensory Tone:** Precise, alert, diagnostic, and commanding. Every luminous pulse or amber highlight maps directly to physical phenomena (luminous flux, active wattage, fault states).

## Colors

The palette operates on a base of deep space obsidian and structural slate, punctured by high-energy emitted photon frequencies:

### Foundation & Surfaces
- **Canvas Base (`#0b0f17`):** Non-reflective substrate minimizing eye fatigue during continuous control-room shifts.
- **Surface Elevation 1 (`#111827`):** Primary panel and telemetry container fill.
- **Surface Elevation 2 (`#1f2937`):** Elevated diagnostics, card insets, and header strips.
- **Border Surface (`rgba(56, 189, 248, 0.12)`): Micro-borders simulating optical circuitry traces.

### Functional Signal Emission
- **Electric Cyan (`#06b6d4`) & Neon Sky (`#38bdf8`):** Telemetry channels, active circuit state, digital switching, stream rates, and primary interactivity.
- **Solar Amber (`#f59e0b`) & Radiant Gold (`#fbbf24`):** Photometric indicators, lux intensity levels, lumen tracking, and critical warning thresholds.
- **Signal States (Operational Statuses):**
  - **BERLEBIHAN (Over-threshold / Intense Lux):** High-emission Amber-Orange (`#f59e0b`) with radiant diffuse glow.
  - **NORMAL (Nominal Flow):** Electric Cyan / Bio-Green (`#10b981` / `#06b6d4`) signaling coherent continuous loop.
  - **REDUP (Sub-threshold / Low-lux):** Dim muted slate-blue (`#64748b`) with alert boundary tinting (`#ef4444` when under fault limit).

## Typography

The typographic hierarchy enforces clear functional boundaries across three specialized typographic roles:

- **Structural Displays & Headers (Space Grotesk):** Engineered geometric grotesque with subtle industrial curves. Conveys technical sophistication in dashboard views, modal headers, and module anchors.
- **Analytical & Body Content (Geist):** Clean, unencumbered neutral sans-serif designed for ultra-crisp rendering on backlit monitors. Facilitates long-duration legibility for sensor metadata, log messages, and circuit descriptions.
- **Telemetry Readouts & Status Indicators (JetBrains Mono):** Tabular numbers and monospaced proportions ensure that shifting measurements (lx, mA, V, dBm, Hz) never introduce optical jitter or width jumping during high-frequency telemetry updates. All micro-labels, timestamps, and status tags enforce uppercase rendering with expanded tracking (`0.05em` to `0.1em`).

## Layout & Spacing

Telemetry dashboards demand an uncompromising balance between spatial density and scanning clarity. The layout follows a 12-column fluid grid system pinned to a base 4px/8px coordinate rhythm:

### Grid Architecture
- **Desktop (1280px+):** 12-column fluid grid with `margin-lg` (2rem / 32px) and `gutter-lg` (1.5rem / 24px). Telemetry widgets assemble in modular blocks (3-column mini telemetry metrics, 6-column chart plots, 12-column historical data grids).
- **Tablet (768px - 1279px):** 8-column layout with `margin-md` (1.5rem / 24px) and `gutter` (1rem / 16px). Sensor plots reflow to span full widths, stacking vertically above auxiliary node tables.
- **Mobile (< 768px):** 4-column layout with `margin` (1rem / 16px) and `gutter` (0.75rem / 12px). Dense metric cards collapse to side-by-side or stacked instrument strips with horizontal scrubbable charts.

### Internal Spacing Rhythm
Component padding strictly uses `space-sm` (8px) for tightly grouped node chips, `space-md` (16px) for standard panel bodies, and `space-lg` (24px) for expansive analytical graph containers.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop-shadows typical of consumer software. Instead, depth is conveyed through translucent glass stratification, structural luminescent outlines, and neon atmospheric glows:

### Stratification Layers
- **Ground (Canvas):** Pure `#0b0f17` with subtle geometric dot grid (`radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)` spaced at 24px intervals).
- **Level 1 (Card & Module Shells):** Semi-transparent `#111827` blended with `backdrop-filter: blur(12px)` and a 1px border of `rgba(56, 189, 248, 0.12)`.
- **Level 2 (Active Gauges, Popovers & Flyouts):** Solidified `#1f2937` with `border: 1px solid rgba(56, 189, 248, 0.3)` and an ambient dark halo `0 8px 32px -4px rgba(0, 0, 0, 0.7)`.

### Luminous Emission (The Glow Effect)
Elevated active states use targeted chromatic bloom rather than neutral blur:
- **Active Cyan Nodes:** `box-shadow: 0 0 16px -2px rgba(6, 182, 212, 0.35)`.
- **Warning / High Lux Radiation:** `box-shadow: 0 0 20px -2px rgba(245, 158, 11, 0.3)`.

## Shapes

The design system enforces a precision-machined aesthetic utilizing tight, disciplined corner radii (Level `1` - Soft, baseline `0.25rem` / 4px). This creates the feel of physical avionics displays and ruggedized instrumentation panels.

- **Standard Containers & Cards:** `0.25rem` (4px). Clean, technical, and structural.
- **Chips, Badges & Pills:** `0.25rem` with micro-chamfer styling or pill structures solely for active toggle swatches.
- **Buttons & Form Fields:** Strict 4px corners to maintain crisp alignment alongside data tables and numeric telemetry monitors.

## Components

### Telemetry Cards
- **Structure:** Obsidian glass backing (`rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)`), bordered by a 1px perimeter of `rgba(56, 189, 248, 0.15)`.
- **Header:** Features an uppercase `label-md` category identifier, an active status dot (pulsing indicator), and an optional auxiliary circuit ID.
- **Readout Area:** Prominent `telemetry-metric` value in `JetBrains Mono`, followed by inline unit designation (e.g., `lx`, `lm`, `W/m²`) in `rgba(243, 244, 246, 0.6)`.

### High-Contrast Status Tags & Badges
- **Shared Architecture:** Monospaced (`JetBrains Mono`), uppercase font, weight 600, padding `2px 8px`, border radius `4px`, border thickness `1px`.
- **`BERLEBIHAN (Terlalu Terang)`:**
  - Background: `rgba(245, 158, 11, 0.12)`.
  - Border: `rgba(245, 158, 11, 0.6)`.
  - Text: `#fbbf24`.
  - Indicator: Emits a subtle persistent amber glow.
- **`NORMAL`:**
  - Background: `rgba(6, 182, 212, 0.1)`.
  - Border: `rgba(6, 182, 212, 0.5)`.
  - Text: `#38bdf8`.
- **`REDUP`:**
  - Background: `rgba(100, 116, 139, 0.12)`.
  - Border: `rgba(100, 116, 139, 0.4)`.
  - Text: `#94a3b8`.

### Buttons
- **Primary (Electric Execute):** Background `#06b6d4`, foreground `#0b0f17`, font weight 600. On hover, background shifts to `#38bdf8` accompanied by `0 0 14px rgba(56, 189, 248, 0.5)`.
- **Secondary (Sub-bus Command):** Background `rgba(31, 41, 55, 0.8)`, border `1px solid rgba(56, 189, 248, 0.3)`, text `#f3f4f6`. On hover, border switches to full cyan `#06b6d4`.
- **Ghost / Trace:** Transparent background, text `#94a3b8`, hover state lights text to `#38bdf8` with `rgba(6, 182, 212, 0.05)` background tint.

### Data Tables (Crisp Telemetry Grids)
- **Header Row:** Monospace `label-sm` labels, background `#111827`, border bottom `1px solid rgba(56, 189, 248, 0.25)`.
- **Data Rows:** Alternating row striation (`#0b0f17` and `rgba(17, 24, 39, 0.4)`), height 40px, cell padding `8px 16px`. Hover highlights row with a thin electric cyan line at the left edge (`border-left: 2px solid #06b6d4`).
- **Data Types:** Monospaced font for timestamps, addresses, and numeric sensor values. Right-aligned for all numerical columns.

### Dynamic Telemetry Line Charts
- **Plot Area:** Transparent canvas over a faint horizontal grid (`rgba(255, 255, 255, 0.04)` per 50 lux increments).
- **Traces:** 2px high-luminance paths. Amber/Gold `#f59e0b` denotes ambient light & lux history; Electric Cyan `#06b6d4` maps voltage/current trends.
- **Area Fills:** Vertical gradients fading from 20% trace opacity at peak down to 0% at zero-baseline.
- **Crosshair Tooltip:** Glassmorphic HUD overlay displaying exact time (`HH:mm:ss.SSS`) and calibrated metric values with precision tags.

### Inputs & Toggles
- **Input Fields:** Obsidian background (`#0b0f17`), border `1px solid #1f2937`, text `#f9fafb`. Focus state triggers `border-color: #06b6d4` with an inner shadow ring of `rgba(6, 182, 212, 0.2)`.
- **Checkboxes & Radios:** Sharp 2px/4px boxes, filled with `#06b6d4` when checked, featuring electric glow micro-animations upon state change.