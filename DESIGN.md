---
version: alpha
name: Weather Window
description: A calm, condition-responsive weather instrument modeled on a strip-chart recorder.
colors:
  primary: "#df664b"
  signal-soft: "rgba(223, 102, 75, 0.18)"
  water: "#167e91"
  surface: "#eaf0ee"
  surface-strong: "#f5f7f4"
  ink: "#14262e"
  muted: "#53686f"
  line: "rgba(20, 38, 46, 0.18)"
  line-strong: "rgba(20, 38, 46, 0.38)"
  atmosphere-a: "#bdd9dd"
  atmosphere-b: "#e9c58b"
  field: "rgba(255, 255, 255, 0.34)"
  focus: "#f06449"
  selection: "#145f6b"
  selection-text: "#f7fbfa"
typography:
  location-display:
    fontFamily: "Spline Sans Variable, sans-serif"
    fontSize: "4.8rem"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  temperature-display:
    fontFamily: "Azeret Mono Variable, monospace"
    fontSize: "9.4rem"
    fontWeight: 330
    lineHeight: 0.8
    letterSpacing: "-0.04em"
    fontFeature: "tabular-nums"
  section-headline:
    fontFamily: "Spline Sans Variable, sans-serif"
    fontSize: "2.65rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Spline Sans Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  data-label:
    fontFamily: "Azeret Mono Variable, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    fontFeature: "tabular-nums"
  brand:
    fontFamily: "Spline Sans Variable, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 690
    letterSpacing: "-0.02em"
rounded:
  micro: "3px"
  mark: "5px"
  interactive: "8px"
  control: "12px"
  dropdown: "14px"
  skeleton: "16px"
spacing:
  micro: "3px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "58px"
components:
  search-field:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "46px"

  unit-segment-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-strong}"
    rounded: "{rounded.interactive}"
    height: "36px"
  primary-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-strong}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  notice-banner:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"

---

# Design System: Weather Window

## Overview

**Creative North Star: "The Atmospheric Strip Recorder"**

Weather Window translates a contemporary meteorological recorder into a responsive web instrument. A pale atmospheric field carries deep ink type, ruled divisions, calibrated data marks, and one warm condition-led signal. The interface is calm and operational rather than decorative: current conditions form a strong register, the next 24 hours run as a continuous trace, and the week reads as an indexed ledger.

The visual world changes with the weather without changing its information architecture. Surface, ink, signal, water, and atmospheric colors shift through seven condition classes while typography, geometry, hierarchy, and interaction stay stable. Controls are compact and tactile, numeric data is precisely aligned, and depth is reserved for overlays and atmospheric emphasis rather than a field of floating cards.

**Key Characteristics:**
- Pale, condition-responsive atmospheric fields with deep, high-contrast ink.
- An oversized vertical current register anchored by mono weather numerals.
- A continuous hourly strip trace with ruled ticks, rain bars, and a movable reading line.
- Seven-day forecasts organized as full-width indexed rows instead of cards.
- Compact instrument controls with visible focus and immediate press feedback.

## Colors

The palette is role-based: a stable default clear-day set is remapped by weather condition while retaining the same semantic jobs.

### Primary
- **Signal Coral:** Marks temperature units, the hourly trace, selected data points, the brand bars, and other scarce points of emphasis.

### Secondary
- **Gauge Teal:** Encodes precipitation bars and water-related data without competing with the signal.

### Neutral
- **Atmospheric Surface:** The page field and broad environmental base.
- **Instrument Paper:** The stronger surface used by fields, menus, selected points, and high-contrast inverse controls.
- **Deep Weather Ink:** Primary text, icons, reading lines, and active control fills.
- **Instrument Muted:** Secondary copy, timestamps, quiet values, and labels.
- **Hairline and Strong Rule:** Low-contrast structural divisions; strong rules terminate major regions.
- **Atmosphere A and B:** Large gradient and orbital atmosphere colors, never standalone UI accents.
- **Field Wash:** A translucent hover, chart-grid, and loading-sheen layer.

Seven condition classes ship: clear day, clear night, cloud, fog, rain, snow, and storm. Cloud and fog share one override set; rain and storm share another. Clear night reverses the field to dark surfaces and light ink, while all other classes remain light.

**The One Signal Rule.** Use one condition-led signal color for the trace and selected or emphasized instrument details; do not scatter unrelated accents across the forecast.

## Typography

**Display Font:** Spline Sans Variable (with sans-serif fallback)  
**Body Font:** Spline Sans Variable (with sans-serif fallback)  
**Label/Mono Font:** Azeret Mono Variable (with monospace fallback)

**Character:** Spline Sans provides a direct, compact editorial voice. Azeret Mono makes temperatures, times, percentages, and measurement readouts feel calibrated and keeps changing values visually stable.

### Hierarchy
- **Location Display:** Tight, bold place names with a balanced wrap and an approximately 11-character desktop measure; the mobile measure tightens to 9 characters.
- **Temperature Display:** The dominant reading, set in lightweight mono with tabular numerals and an 0.8 line height; its unit is smaller, heavier, and signal-colored.
- **Section Headline:** Tight, bold headings for the hourly and seven-day regions.
- **Body:** Plain-language conditions, descriptions, controls, and recovery copy in the sans face.
- **Data Label:** Small mono timestamps, timezone labels, chart values, and measurement readouts with tabular numerals.
- **Brand:** Compact semibold sans with slightly tightened tracking.

**The Numeric Instrument Rule.** Temperatures, times, percentages, and measured values use Azeret Mono with tabular numerals; descriptive weather language stays in Spline Sans.

## Layout

The shell is centered at `min(100% - 48px, 1440px)` on desktop and narrows to `min(100% - 28px, 1440px)` below 760px. The desktop header is a three-column instrument bar: brand, search/geolocation cluster, and unit switch. The first forecast viewport uses two unequal columns, with current conditions on the left and the hourly trace on the right; the current area is further divided into the register, orbital condition field, and metric stack.

At 1040px and below, the header becomes two rows, the first forecast viewport stacks, current metrics become a three-column strip, and the hourly chart spans the container. At 760px and below, location text collapses to an icon-only control, the current region becomes a single flow, metrics become stacked ruled rows, the hourly trace scrolls horizontally, daily rows collapse to two columns, and the footer stacks. At 420px and below, the unit switch and daily labels tighten further. The document supports a 320px minimum viewport and was composed for 390px mobile and 1440px desktop.

Spacing is structural rather than card-based: 1px rules establish sections, 48–60px bands separate major forecast regions, and smaller 8–24px intervals group controls and local data. The hourly SVG preserves a wide minimum canvas on narrow screens rather than compressing the trace until it becomes unreadable.

## Elevation & Depth

The system is flat by default. Depth comes from tonal atmosphere, translucent field washes, ruled overlaps, a large breathing atmospheric disc, and a faint icon drop shadow. Only the search-results overlay receives conventional elevation; everything else remains on the continuous weather field.

### Shadow Vocabulary
- **Atmospheric Bloom:** A very large, color-mixed shadow behind the condition disc; environmental rather than card-like.
- **Search Overlay:** A compact `0 18px 48px rgba(19, 41, 49, 0.19)` shadow reserved for the results menu.
- **Condition Glyph:** A restrained drop shadow derived from the active ink color.

**The Flat Field Rule.** Forecast regions stay on one continuous field and are separated with rules, spacing, and tone; do not turn them into a grid of floating glass cards.

## Shapes

Controls use gently rounded rectangles: 12px for search, location, unit containers, notices, and recovery actions; 8–9px for nested interactive segments and result rows; 14px for the search-results overlay. Loading placeholders use 12–16px corners. The brand mark is a small 5px-corner instrument housing with three rounded signal bars.

Circles are reserved for atmospheric and measurement motifs: the large background disc, concentric condition orbits, trace points, loading spinners, and the orbital signal bead. Most forecast structure remains linear and rectilinear, reinforced by 1px horizontal and vertical rules.

## Components

### Header Instrument Bar
- **Structure:** Brand at the leading edge, a centered search/geolocation cluster, and a compact two-segment unit switch.
- **Responsive behavior:** Search moves to a full second row below 1040px; geolocation becomes icon-only below 760px.
- **State:** The selected unit uses an ink fill with inverse text; inactive units remain transparent and muted.

### Search Field and Results
- **Field:** 46px high with a strong hairline, translucent Instrument Paper fill, 12px corners, leading search icon, clear action, and in-field progress spinner.
- **Focus:** `:focus-within` shifts the border to ink and adds a 3px signal-tinted ring; all keyboard focus also receives the global 3px solid focus outline with a 3px offset.
- **Results:** A 14px-corner elevated list appears 54px below the field. Rows use 9px corners, a bold place name, and muted location detail. Enter selects the first result; Escape closes the list.

### Buttons and Segmented Controls
- **Primary recovery button:** Ink fill, inverse text, 44px minimum height, 12px corners, and inline icon.
- **Location button:** Transparent 46px instrument control with a hairline border; disabled state lowers opacity and uses a wait cursor.
- **Press state:** Location, unit, recovery, and result controls scale to 0.97 using a short 130ms ease.
- **Pointer hover:** Applied only for hover-capable fine pointers; field washes replace ornamental lift.

### Current Conditions Register
- **Reading:** Location, location detail, oversized mono temperature, signal unit, condition, daily range, and update time form one uninterrupted vertical register.
- **Condition field:** Concentric ruled orbits, crosshairs, a central line icon, and one signal bead create the signature weather-station motif.
- **Metrics:** Feels-like, wind, and humidity values use ruled cells and mono readings rather than standalone cards.

### Hourly Trace
- **Chart:** A continuous signal line and soft area fill run through 24 ruled hourly ticks; water-colored bars show precipitation probability.
- **Selection:** The selected point fills with signal, gains a stronger inverse stroke, and aligns with a dashed ink reading line.
- **Interaction:** Pointer movement and an overlaid native range input update the live readout. Keyboard users operate the range control; its readout is announced politely. On mobile, the wide trace scrolls horizontally and a continuation hint is shown.

### Daily Forecast Rows
- **Desktop:** Four aligned columns for day/date, condition, rain probability, and high/low temperature.
- **Mobile:** Two columns across two rows; rain and temperatures align to the trailing edge.
- **State:** Fine-pointer hover adds a subtle field wash and 14px inline inset without lifting the row.

### Notices, Errors, and Loading
- **Notice and inline error:** Ruled, 12px-corner status bands with underlined text actions.
- **Blocking error:** A large plain-language state with a weather icon and recovery button.
- **Loading:** Three atmospheric gradient placeholders scan across the location, temperature, and trace shapes.

Interaction motion is restrained and functional: theme changes use 350ms ease, control color changes use 160ms ease, row shifts use 180ms ease, the atmospheric disc breathes over 14s, condition orbits turn over 22–32s, and loading or search progress uses short looping scans or spins. Under `prefers-reduced-motion: reduce`, smooth scrolling is disabled and all animation and transition durations collapse to 0.01ms with one iteration.

## Do's and Don'ts

### Do:
- **Do** preserve the continuous ruled forecast field and use spacing, lines, and alignment before adding containers.
- **Do** let weather conditions remap the existing semantic color roles while keeping hierarchy and interactions stable.
- **Do** use Spline Sans for language and Azeret Mono with tabular numerals for measured data.
- **Do** keep keyboard focus visible, expose live data changes politely, and retain the native range input over the hourly trace.
- **Do** limit hover treatments to devices that report a fine pointer and stop or collapse motion for reduced-motion users.

### Don't:
- **Don't** replace the current register, hourly trace, or daily ledger with interchangeable glass cards.
- **Don't** introduce extra accent colors when the active signal and water roles already encode emphasis and precipitation.
- **Don't** compress the hourly trace into an unreadable mobile sparkline; preserve its width and allow horizontal scrolling.
- **Don't** use mono typography for descriptive conditions or long-form interface copy.
- **Don't** add decorative motion that competes with reading the forecast or survives the reduced-motion override.
