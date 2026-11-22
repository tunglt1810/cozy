# Foundations

All values come from [`tokens/cozy.tokens.json`](../tokens/cozy.tokens.json). Each color token becomes a CSS custom property `--cozy-<name>` with the value `light-dark(<light>, <dark>)`.

## Color

### Theme mode

`light-dark()` follows `color-scheme` on the root element.

- `tokens/cozy.css` sets `color-scheme: light dark`. The page follows the operating system.
- `<html data-theme="light">` or `<html data-theme="dark">` forces one mode.
- Set `data-theme` in an inline script in `<head>`, before the first paint. If you set it later, the page shows the wrong theme for one frame.

### Surfaces

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `bg-body` | `#FAEBDA` | `#18140E` | Page canvas |
| `bg-surface` | `#FBF1E1` | `#231D16` | Cards, tables, panels, popovers |
| `bg-muted` | `#F3DFC8` | `#30261D` | Segmented-control track, quiet emphasis |
| `bg-inverted` | `#3B2A1C` | `#FFFEF7` | Active filter chip, inverted badge |
| `text-on-inverted` | `#FBF1E1` | `#231D16` | Text on `bg-inverted` |

### Text and accent

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#261101` | `#FFFEF7` | Body text, headings, primary icons |
| `text-secondary` | `#5B4C3B` | `#C2B7B1` | Supporting text, secondary icons |
| `text-disabled` | `#968574` | `#70655C` | Disabled text and icons |
| `text-accent` | `#A84A24` | `#F2A57E` | Links and accent text |
| `accent` | `#EF8F63` | `#EE8F64` | Primary action fill, active tab underline |
| `on-accent` | `#261101` | `#18140E` | Text and icons on `accent` |
| `focus-ring` | `#A84A24` | `#F2A57E` | Keyboard focus outline |

`accent` reaches only 2.05:1 on `bg-body` in light mode. That is too low for a focus outline (WCAG 1.4.11 needs 3:1). Use `focus-ring` for focus, not `accent`.

### Status

Each status has five tokens. Use the correct one for each job.

| Token pattern | Use for | Example (error, light / dark) |
| :--- | :--- | :--- |
| `<status>` | Fill, border, icon | `#C8433B` / `#F27B70` |
| `on-<status>` | Text on the `<status>` fill | `#FFFEF7` / `#18140E` |
| `<status>-muted` | Banner or destructive-button background | `#F9CFC8` / `#472826` |
| `on-<status>-muted` | Text on `<status>-muted` | `#7E211C` / `#F9BEB8` |
| `text-<status>` | Status text on `bg-body` or `bg-surface` | `#B0322B` / `#F5938A` |

`<status>` is one of `success`, `warning`, `error`, `info`.

**Status text rule:**

- Do not use `<status>` as a text color. In light mode, `success`, `error` and `warning` are below 4.5:1 on `bg-body`. `warning` is 3.08:1.
- Text with a status meaning MUST use `text-<status>`. These tokens reach AA (5.36:1 or more) in light mode and AAA in dark mode.
- Every `<status>` color reaches 3:1 on `bg-body` and `bg-surface`, so a status icon or border is visible. A status icon SHOULD still have a text label, because color alone does not tell the meaning.

### Lines and layers

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `border` | `#5B4C3B22` | `#3E3831` | Default divider and outline |
| `border-emphasized` | `#DFCBB5` | `#52493F` | Input outline, emphasized divider |
| `overlay` | `#26110166` | `#0D0A07B3` | Modal scrim |
| `overlay-hover` | `#2611010D` | `#FFFEF70F` | Hover layer on any surface |
| `overlay-pressed` | `#2611011A` | `#FFFEF71C` | Pressed layer on any surface |
| `shadow` | `#6E4A2A1A` | `#00000059` | Color for custom shadows |
| `skeleton` | `#EBD9C4` | `#332B23` | Loading placeholder |
| `track` | `#E6D2BC` | `#30271E` | Progress and slider track |

### Navigation

The side navigation floats on the canvas as a sage card.

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `nav-bg` | `#C3CBB9` | `#29332A` | Navigation background |
| `nav-active` | `#F8E8D3` | `#404A41` | Active item pill |
| `nav-text` | `#403B26` | `#FFFEF7` | Item label |
| `nav-text-muted` | `#55503A` | `#B8C4B6` | Group label, secondary icon |

### Expressive colors

Use these only at the expressive density level.

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `mark-peach` | `#FAD3B9` | `#7D4737` | Highlighter stroke under a heading |
| `mark-sage` | `#E4DEC8` | `#527366` | Alternative highlighter stroke |
| `pastel-sage` / `-icon` | `#E2DEC4` / `#7EAB9A` | `#31392C` / `#5E8C7A` | Stat card / icon chip |
| `pastel-peach` / `-icon` | `#FBCBB4` / `#F48A65` | `#432F28` / `#E5866B` | Stat card / icon chip |
| `pastel-butter` / `-icon` | `#FAE1B5` / `#FAC76A` | `#443A26` / `#D9A74E` | Stat card / icon chip |
| `pastel-mist` / `-icon` | `#D2D7DA` / `#A2B3C1` | `#2B333D` / `#6D8296` | Stat card / icon chip |
| `on-pastel` | `#261101` | `#18140E` | Icon on a pastel icon chip |

### Category hues

Ten hues for tags and badges: `green`, `orange`, `yellow`, `blue`, `teal`, `cyan`, `purple`, `pink`, `red`, `gray`. Each hue has `-bg`, `-border`, `-icon` and `-text`. All `-text` tokens reach AA on their `-bg`. All `-icon` tokens reach 3:1. See the [token file](../tokens/cozy.tokens.json) for the values.

## Typography

**Font:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (SIL Open Font License). It has full Vietnamese and Latin Extended support. Load weights 400, 500, 600 and 700.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
```

| Style | Size | Line height | Weight |
| :--- | :--- | :--- | :--- |
| `display` | 35px (2.1875rem) | 1.2 | 700 |
| `heading-1` | 24px (1.5rem) | 1.3333 | 600 |
| `heading-2` | 20px (1.25rem) | 1.4 | 600 |
| `heading-3` | 17px (1.0625rem) | 1.4118 | 700 |
| `heading-4` | 14px (0.875rem) | 1.4286 | 700 |
| `body` | 14px (0.875rem) | 1.4286 | 400 |
| `label` | 14px (0.875rem) | 1.4286 | 500 |
| `supporting` | 12px (0.75rem) | 1.6667 | 400 |

**Weight rules:**

| Weight | Use for |
| :--- | :--- |
| 400 | Body text |
| 500 | Labels, menu items |
| 600 | Headings, buttons, the selected item |
| 700 | Key numbers, card titles |

## Spacing

The grid unit is 4px. `--cozy-space-N` is N × 4px: `space-1` = 4px, `space-2` = 8px, `space-4` = 16px, up to `space-12` = 48px.

## Radius

| Token | Value | Use for |
| :--- | :--- | :--- |
| `radius-inner` | 8px | Small items, icon boxes, buttons in a popover |
| `radius-element` | 12px | Inputs, menu items, icon chips |
| `radius-nav-item` | 14px | Navigation items and the navigation indicator |
| `radius-container` | 18px | Cards, sections, panels |
| `radius-card-expressive` | 20px | Stat cards (expressive level) |
| `radius-nav` | 22px | The floating navigation card |
| `radius-page` | 28px | Page frame |
| `radius-full` | 9999px | Pills: buttons, avatar, highlighter |

A nested element SHOULD have a smaller radius than its parent. The usual order is page → container → element → inner.

## Shadow

| Token | Use for |
| :--- | :--- |
| `shadow-low` | Cards at rest |
| `shadow-med` | Cards on hover, dropdowns |
| `shadow-high` | Dialogs, popovers |
| `shadow-toolbar` | A toolbar that stays at the bottom edge of a card. The shadow goes up |
| `shadow-focus` | Keyboard focus. A 2px surface gap, then a 2px `focus-ring` line |

Light-mode shadows use `rgba(110, 74, 42, …)`. Dark-mode shadows use black plus a 1px inset line in `rgba(255, 240, 220, …)`. The inset line keeps a card edge visible on a dark canvas.
