# AI X-Risk Spectrum — Interactive Scrollytelling Website

## Concept
An interactive, scroll-driven website that tells the story of how people perceive AI risk. It uses a **skew normal distribution** as its central visual metaphor, segmented into 6 groups across a spectrum from "Zero Risk" to "Existential Risk." The same base distribution is reused across multiple sections, each adding different overlays, annotations, and narrative context.

## Core Technical Requirements

### Stack suggestion
- **Vite + React** (or Next.js if SSR matters)
- **Tailwind CSS** for styling
- **Framer Motion** or **GSAP + ScrollTrigger** for scroll-based animations
- All chart rendering is **SVG-based** (no chart library needed — custom implementation exists)

### Architecture

```
src/
  context/DistributionContext.jsx   ← Central state: curve params + boundaries
  components/
    DistributionChart.jsx           ← Reusable SVG chart (accepts overlay props)
    SegmentLegend.jsx               ← Segment cards with percentages
    BoundaryControls.jsx            ← Slider controls for boundaries
    CurveControls.jsx               ← Slider controls for curve shape
    SectionNav.jsx                  ← Sticky navigation / scroll progress
  sections/
    Section01_Intro.jsx             ← Each section = one story beat
    Section02_Spectrum.jsx
    Section03_...jsx
  utils/
    math.js                         ← skewNormalPDF, integrate, erf, etc.
  App.jsx
```

### Central State (DistributionContext)
All sections read from the same context. If the user adjusts the base curve (e.g. in an interactive section), every downstream section updates. The context holds:
- `location` (default 0.3) — peak position
- `scale` (default 0.66) — spread
- `shape` (default 5.5) — skewness
- `boundaries` (default [0.0, 0.6, 1.4, 1.95, 2.5]) — 5 boundaries for 6 segments
- Computed: `curveData`, `segmentAreas` (percentages)

### The 6 Segments
| ID | Label | Color | Description |
|---|---|---|---|
| dismissive | Dismissive | #2d6a4f | AI risk is essentially zero |
| unconcerned | Unconcerned | #52b788 | Risks are manageable through existing institutions |
| cautious | Cautiously Optimistic | #f4a261 | Real risks need attention, governance can handle it |
| concerned-current | Concerned (Current) | #e07a5f | Surveillance, job loss, algorithmic bias, misinfo |
| concerned-future | Concerned (Future) | #c1440e | Bioterrorism, dystopia, oligarchy, automated war |
| alarmed | Alarmed / Doomer | #9b2226 | Genuine existential threat, catastrophe trajectory |

### Chart Component API (design target)
```jsx
<DistributionChart
  // Override context defaults per-section:
  highlightSegments={["concerned-current", "concerned-future"]}
  dimOtherSegments={true}
  annotations={[{ x: 1.5, label: "You are here", color: "#fff" }]}
  comparisonCurve={{ location: 1.2, scale: 0.9, shape: 1.5, label: "2030 projection", color: "#ff6b6b", dashed: true }}
  showBoundaries={true}
  showLabels={true}
  interactive={false}  // lock for presentation sections
  height={400}
/>
```

### Math (proven, working implementations)
See `xrisk-distribution.jsx` for all math functions:
- `erf(x)` — error function approximation
- `normalPDF(x)`, `normalCDF(x)`
- `skewNormalPDF(x, location, scale, shape)`
- `integrate(data, xStart, xEnd)` — trapezoidal numerical integration
- `genCurve(loc, sc, sh, xMin, xMax, steps)` — generates array of {x, y} points

### Design Direction
- **Dark theme** — background #0d0d14, light text #f0ece2
- **Fonts** — Playfair Display (headings), DM Sans (body), DM Mono (data)
- **Chart background** — warm paper tone #f7f5ef (contrast against dark page)
- **Scroll-driven** — sections reveal as user scrolls, charts animate in
- **Qualitative disclaimer** — this is perception-based, not empirical survey data

## Story Sections (to be built incrementally)
The user will define each section's content as they go. Expect sections like:
1. Hero / intro — what is the AI risk spectrum?
2. The full distribution — interactive, let reader explore
3. Zoomed segments — highlight specific groups with overlays
4. Comparison views — overlay multiple curves (e.g. "tech workers vs general public")
5. The concerned split — current vs future risks deep dive
6. Conclusion / call to action

## Starting Point
The attached `xrisk-distribution.jsx` is a working React component with all math, chart rendering, segment definitions, boundary sliders, and curve controls. Extract and refactor into the architecture above.

---

*This is a qualitative, perception-based visualization — not derived from empirical survey data.*
