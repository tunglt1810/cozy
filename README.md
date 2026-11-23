# Cozy

I wanted my admin app to feel warm instead of clinical. So I pulled its colors and motion out into this design system. Light and dark mode come from one set of tokens.

**Live preview:** <https://tunglt1810.github.io/cozy/>

There are no components here. You get tokens, CSS effects, a bit of motion JavaScript and the rules I follow. Bring whatever component library you like.

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="assets/palette-dark.svg" />
	<img alt="Cozy color tokens" src="assets/palette-light.svg" />
</picture>

## Contents

| Path | What it is |
| :--- | :--- |
| [`tokens/cozy.tokens.json`](tokens/cozy.tokens.json) | Source of truth for all tokens. Edit this file only |
| [`tokens/cozy.css`](tokens/cozy.css) | CSS custom properties. Colors use `light-dark()` |
| [`tokens/cozy.ts`](tokens/cozy.ts) | The same tokens as a typed TypeScript object |
| [`tokens/dtcg/`](tokens/dtcg/) | The tokens in the W3C Design Tokens format, one file for each mode |
| [`css/tailwind.css`](css/tailwind.css) | Theme variables for Tailwind CSS v4 |
| [`css/effects.css`](css/effects.css) | Named effects: highlighter, title reveal, list row stagger, navigation indicator, press, skeleton, dialog, toast, card lift, theme reveal |
| [`js/cozy-motion.js`](js/cozy-motion.js) | Easing and spring presets, stagger delay, title splitter, circular theme reveal |
| [`adapters/astryx/`](adapters/astryx/) | Optional theme for the [Astryx](https://www.npmjs.com/package/@astryxdesign/core) component library |
| [`preview/index.html`](preview/index.html) | A page that shows every token and effect |
| [`docs/`](docs/) | The rules |

## Quick start

Load the font and the two style sheets:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="cozy/tokens/cozy.css" />
<link rel="stylesheet" href="cozy/css/effects.css" />
```

Then use the tokens:

```css
body {
	background: var(--cozy-bg-body);
	color: var(--cozy-text-primary);
	font-family: var(--cozy-font-family-sans);
}

.button-primary {
	background: var(--cozy-accent);
	color: var(--cozy-on-accent);
	border-radius: var(--cozy-radius-full);
}
```

The page follows the OS theme. Add `<html data-theme="dark">` to force a mode.

Install from Git with `bun add github:tunglt1810/cozy`.

## Tailwind CSS v4

```css
@import 'tailwindcss';
@import 'cozy/tokens.css';
@import 'cozy/tailwind.css';
```

Utilities drop the `bg-` or `text-` prefix from the token name: `bg-surface`, `text-primary`, `rounded-container`. If the short name clashes with another token, the full name stays, for example `text-text-accent`. Type styles look like `text-cozy-heading-1`.

## Design tools

`tokens/dtcg/cozy.light.json` and `tokens/dtcg/cozy.dark.json` use the [W3C Design Tokens](https://www.designtokens.org/) format. Tokens Studio, Style Dictionary and Figma plugins can import them.

## Docs

- [Principles](docs/principles.md)
- [Foundations](docs/foundations.md): color, type, spacing, radius, shadow
- [Motion](docs/motion.md)
- [Patterns](docs/patterns.md): tabs, buttons, forms, dialog, toast, empty state, skeleton
- [Contrast report](docs/contrast.md): every color pair, measured

## Run the preview locally

It loads ES modules, so `file://` won't work. Serve it:

```bash
bunx serve -l 8000
```

Then open <http://localhost:8000/preview/>.

## Change the tokens

1. Edit `tokens/cozy.tokens.json`.
2. Run `bun run build`. It regenerates the CSS, TS, DTCG and Tailwind files, plus the contrast report, the palette images and the preview page.
3. Run `bun run check`. It fails if a generated file is stale or a color pair drops below its contrast minimum.

Run `bun run build` after you touch `css/effects.css` or `js/cozy-motion.js` too. The preview links each file with a content hash, so browsers don't serve an old copy.

The script runs on [Bun](https://bun.sh) with no dependencies.

## Browser support

`light-dark()` needs Chrome 123, Edge 123, Firefox 120 or Safari 17.5. The circular theme reveal needs the View Transitions API. Without it, the theme still changes, just without the animation.

## License

[MIT](LICENSE). Plus Jakarta Sans uses the SIL Open Font License 1.1.

If Cozy is useful to you, [buy me a coffee](https://buymeacoffee.com/bbeeezzzzz).

[@tunglt1810](https://github.com/tunglt1810)
