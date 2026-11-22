# Principles

**Requirement levels.** **MUST** and **MUST NOT** are rules. A review rejects a change that breaks one. **SHOULD** is the default. You can do something different when you write down the reason.

## 1. Warm, never pure

The palette uses cream, oat, espresso and roasted-coffee tones. It has no cold white and no cold black.

- Colors MUST come from tokens. Do not write a hex value in component code.
- Do not use `#FFFFFF` or `#000000`. The lightest color is `#FFFEF7`. The darkest color is `#18140E`.
- Do not use neon gradients or hard, dark shadows. Light-mode shadows use a brown tint. Dark-mode shadows add a thin, warm inset line.

## 2. Contrast is measured, not assumed

- Body text (`text-primary`, `text-secondary`) MUST reach WCAG AAA (7:1) on `bg-body` and `bg-surface`.
- Text on the accent MUST use `on-accent`. White text on the coral accent reaches only about 2.4:1.
- The build script measures every documented pair. It fails when a pair is below its minimum. See [contrast.md](contrast.md).

## 3. Two density levels

One palette serves two kinds of screen.

| Level | Use it for | What changes |
| :--- | :--- | :--- |
| **Expressive** | Overview pages, app shell, first-run screens | Pastel stat cards with 20px corners, highlighter under the page title, spring motion, title reveal |
| **Operational** | Lists, tables, forms, settings | Same colors and pill buttons. Compact rows. Short fades only. No decoration that slows repeated work |

A screen SHOULD use one level. Do not put a highlighter or a title reveal on a table that people use all day.

## 4. Motion is optional

- Every animation MUST stop when the user sets `prefers-reduced-motion: reduce`. The final state shows at once.
- Motion explains a change: where an item went, which tab is active, which theme is new. Motion that explains nothing is decoration. Use decoration only at the expressive level.
- Do not remount a page to animate a route change. A remount deletes form state. Animate the wrapper element instead.

## 5. One name, one meaning

A token name describes a role, not a color. Use `text-error` for error text, not `red-text`. The category hues (`green-*`, `orange-*` …) are only for labels that have no meaning beyond "this group is different from that group".
