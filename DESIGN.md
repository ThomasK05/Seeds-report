# Hidden Harvest — Design System

## Colors

### Palette
- Forest Green: `oklch(35% 0.09 145)` / `#2D5A3D` — primary brand, hero backgrounds, headings
- Earth Brown: `oklch(50% 0.06 60)` / `#8B6F47` — accents, borders, sub-labels
- Soil Dark: `oklch(22% 0.04 50)` / `#3D2B1F` — footer, deep contrast
- Light Blue: `oklch(84% 0.05 215)` / `#A8D5E5` — badges, highlights, interactive (max 20%)
- Cream: `oklch(97% 0.01 85)` / `#F9F6F0` — primary background (80% of surfaces)
- Charcoal: `oklch(20% 0.005 250)` / `#2C2C2C` — body text
- Soft Red: `oklch(60% 0.10 25)` / `#D4726A` — problem/pain-point callouts only

### Color strategy
Committed. Forest Green carries 30–60% on hero slides. Cream carries 80% on content slides.

### Distribution rule
80/20 — Cream background (80%) + Forest Green or Soil Dark accents (20%)

## Typography

### Fonts (Google Fonts CDN)
- `Playfair Display` — serif, weight 700 + 900. Headlines, slide titles. Min 40px web.
- `Inter` — sans-serif, weight 300 + 400 + 600. Body, metadata, supporting text. Min 16px.
- `JetBrains Mono` — monospace, weight 400. Tags, labels, counters. 12px, UPPERCASE, 1px letter-spacing.

### Scale
| Role | Font | Size | Weight |
|------|------|------|--------|
| Display | Playfair Display | 72–96px | 900 |
| H1 | Playfair Display | 48–64px | 700 |
| H2 | Playfair Display | 32–40px | 700 |
| Body | Inter | 16–18px | 300–400 |
| Label/Tag | JetBrains Mono | 11–13px | 400 |
| Caption | Inter | 13–14px | 400 |

## Spacing
Base unit: 8px. Use multiples: 8, 16, 24, 32, 48, 64, 96.

## Motion
Slide transitions: CSS transform, 380ms cubic-bezier(0.4, 0, 0.2, 1). No bounce, no elastic.
Entrance: fade-up (translateY 20px → 0, opacity 0 → 1), 300ms, staggered 80ms.
Float: translateY 0 → -10px → 0, 3.5s ease-in-out, infinite. Cover badge only.
