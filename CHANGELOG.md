# Changelog

This project uses [Semantic Versioning](https://semver.org/). Before 1.0.0, a minor version can change or remove tokens.

## 0.1.0 – 2026-11-22

First public release.

### Added

- 96 color tokens with light and dark values: surfaces, text, accent, four status sets, lines and layers, navigation, expressive pastels, ten category hues.
- `focus-ring` token. It reaches 3:1 or more on `bg-body` and `bg-surface`. The accent color does not.
- `text-on-inverted` token for text on `bg-inverted`.
- Typography, 4px spacing, radius, shadow and motion tokens.
- `tokens/cozy.css` with `light-dark()` values, and `tokens/cozy.ts`.
- `css/effects.css`: highlighter, title reveal, list row stagger, row hover, press, segment thumb, navigation indicator, stat card, card lift, circular theme reveal.
- `js/cozy-motion.js`: `COZY_EASE`, `COZY_SPRING`, `COZY_LAYOUT_SPRING`, `COZY_COUNT_SPRING`, `enterPage`, `createNavIndicator`, `rowDelayStyle`, `splitGraphemes`, `titleStepMs`, `splitTitle`, `revealTheme`.
- Optional Astryx adapter.
- Build script with a contrast check, palette images and a preview page.
- Documentation: principles, foundations, motion (with a motion map for every animated element), patterns, contrast report.
