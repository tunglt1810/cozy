# Motion

CSS lives in [`css/effects.css`](../css/effects.css). JavaScript helpers live in [`js/cozy-motion.js`](../js/cozy-motion.js). The examples for a motion library use [Motion](https://motion.dev) (`motion/react`). Other libraries work with the same values.

## Curves and timing

| Token | Value | Use for |
| :--- | :--- | :--- |
| `motion-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | All entrances and moves. Fast start, soft stop |
| `motion-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | The theme reveal |
| `motion-duration-fast` | 160ms | Hover, press, inline reveal, tab panel |
| `motion-duration-page` | 200ms | Page enter after a route change |
| `motion-duration-medium` | 260ms | Table and list row entrance |
| `motion-duration-entrance` | 340ms | Card and section entrance, title characters |
| `motion-duration-slow` | 480ms | Theme reveal |
| `motion-stagger-step` | 28ms | Delay between rows |

| Spring | Stiffness | Damping | Mass | Use for |
| :--- | :--- | :--- | :--- | :--- |
| `COZY_SPRING` | 420 | 32 | 0.9 | Tab underline, toggles, small state changes |
| `COZY_LAYOUT_SPRING` | 400 | 34 | 0.9 | List reorder, drag and drop, size changes |
| `COZY_COUNT_SPRING` | 120 | 24 | 0.8 | A number that counts up to its value |

**Distance rule:** an element moves 6px for small parts (panel, bar, subtitle), 8px for a page, 10px for a row and 12px for a card. A larger element moves farther, but never more than 12px.

## Reduced motion

Every effect MUST stop when the user sets `prefers-reduced-motion: reduce`. The final state shows at once.

- **CSS:** put each `animation` and `transition` inside `@media (prefers-reduced-motion: no-preference)`. `effects.css` does this.
- **Web Animations API (`element.animate`):** read `matchMedia('(prefers-reduced-motion: reduce)')` before you call `animate()`. `enterPage()` does this.
- **Motion libraries:** set the global option. In Motion: `<MotionConfig reducedMotion="user">`.
- **A number that counts up:** show the final value at once. Do not count.
- **View transitions and smooth scroll:** `effects.css` turns them off under `reduce`.
- **A setting in your app:** set `<html data-motion="reduce">`. `effects.css` stops every animation and transition on the page, and the helpers in `cozy-motion.js` act as under `reduce`. Use this when your app has its own "Reduce motion" setting.

## Motion map

| Where | Effect | Values | API |
| :--- | :--- | :--- | :--- |
| Page | [Page enter](#page-enter) | Fade in, rise 8px, 200ms | `enterPage(el)` |
| Page title | [Title reveal](#title-reveal) | Each character rises from a mask, 340ms, 26ms step, total delay 240ms or less | `splitTitle(el)`, `.cozy-title-char` |
| Page title | [Highlighter](#highlighter) | Stroke grows from the left, 380ms, starts after 180ms | `.cozy-highlight` |
| Page subtitle | [Section entrance](#section-entrance) | Fade in, rise 6px, 280ms, starts after 140ms | Motion library |
| Stat cards | [Section entrance](#section-entrance) | Fade in, rise 12px, 340ms, 55ms between cards | Motion library |
| Stat number | [Count-up](#count-up) | Spring from 0 to the value | `COZY_COUNT_SPRING` |
| Content sections | [Section entrance](#section-entrance) | Fade in, rise 12px, 360ms, start after 160ms, 210ms, 260ms | Motion library |
| Side navigation | [Navigation indicator](#navigation-indicator) | Pill moves, leading edge 220ms, trailing edge 330ms after 70ms | `createNavIndicator()`, `.cozy-nav-indicator` |
| Table and list rows | [Row stagger](#table-and-list-rows) | Fade in, rise 10px, 260ms, 28ms step, first 12 rows | `.cozy-list-row`, `rowDelayStyle(i)` |
| Clickable row | [Row hover](#table-and-list-rows) | `overlay-hover` background, 150ms | `.cozy-row-interactive` |
| Dragged row | [Drag and drop](#drag-and-drop) | Opacity 0.4 while held, others move with a spring | `COZY_LAYOUT_SPRING` |
| Bulk-action bar, inserted field, warning | [Inline reveal](#inline-reveal) | Drop in from 6px above, 160ms. Leave the same way | Motion library |
| Buttons, chips, segments | [Press](#press) | Colors change in 160ms. Press: scale 0.97 in 120ms | `.cozy-press` |
| Segmented control | [Segment thumb](#segment-thumb) | Thumb slides to the selected segment, 260ms | `.cozy-seg-thumb` |
| Tabs | [Tab underline and panel](#tabs) | Underline moves with a spring. Panel fades in, rises 6px, 160ms | `COZY_SPRING` |
| Cards that open something | [Card lift](#card-lift) | Rise 2px, larger shadow, 180ms. Press: scale 0.985 | `.cozy-lift` |
| Dialog | [Dialog](patterns.md#dialog) | Fade in, grow from 98%, 200ms. Scrim fades at the same time | `.cozy-dialog` |
| Toast | [Toast](patterns.md#toast) | Rise 12px, fade in, 260ms. Leave: fade out, 160ms | `.cozy-toast`, `.cozy-toast-leave` |
| Loading block | [Skeleton](patterns.md#loading-skeleton) | Light band moves across in 1.4s, repeats | `.cozy-skeleton` |
| Theme toggle | [Circular theme reveal](#circular-theme-reveal) | New theme grows as a circle, 480ms | `revealTheme(apply, origin)` |

The expressive level uses every effect. The operational level uses only page enter, navigation indicator, row stagger, row hover, drag and drop, inline reveal, press, segment thumb, tabs, dialog, toast, skeleton and theme reveal.

## Page enter

```js
import { enterPage } from './js/cozy-motion.js';

router.afterEach((to, from) => {
	if (from) enterPage(contentWrapper);
});
```

1. Animate the element that wraps the page content. Do not remount the page. In React, do not put the route path in a `key`. A remount deletes unsaved form input.
2. Do not animate the first load.
3. Do not animate a page that has its own entrance (for example an overview page with section entrances). Two entrances at the same time look like a stutter.
4. Set `scrollTop = 0` on the main scroll container and on each inner scroll region. Do this before the animation starts.
5. Cancel the running animation when the route changes again.

## Title reveal

Use it once per page, on the main heading, at the expressive level only.

- `splitTitle()` splits by grapheme (`Intl.Segmenter`), so a letter and its diacritics move as one unit.
- Each word stays on one line. The browser breaks lines only between words.
- The step between characters is 26ms. For a long title, the step gets shorter, so the last character starts 240ms or less after the first one (`titleStepMs`).
- `splitTitle()` inserts a `.cozy-sr-only` span with the plain text and hides the character spans from screen readers.
- The mask has a small vertical padding, so stacked diacritics stay visible.

## Highlighter

- Wrap one or two words, not a full sentence.
- The stroke starts 180ms after the title, so the eye reads the title first.
- The stroke sits behind the text, so it does not change contrast.
- Change the color with `--cozy-highlight-color` (default `mark-peach`, option `mark-sage`).

## Section entrance

Content arrives from top to bottom, in reading order.

| Part | Rise | Duration | Delay |
| :--- | :--- | :--- | :--- |
| Subtitle under the title | 6px | 280ms | 140ms |
| Stat card number *n* (0, 1, 2 …) | 12px | 340ms | *n* × 55ms |
| Content section 1, 2, 3 | 12px | 360ms | 160ms, 210ms, 260ms |

```jsx
<m.div
	initial={{ opacity: 0, y: 12 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ duration: 0.34, delay: index * 0.055, ease: COZY_EASE }}
/>
```

Use section entrance only at the expressive level. The last element SHOULD be in place in 700ms or less.

## Count-up

A key number counts from 0 to its value with `COZY_COUNT_SPRING`.

- Write the value to the DOM directly on each frame. Do not re-render the component on each frame.
- When the value changes later, count from the old value to the new value, not from 0.
- When the value is not a number (loading, error), show it as text without a count.
- Under reduced motion, show the final value at once.

## Navigation indicator

One pill shows the active item. When the active item changes, the pill moves like a caterpillar:

- The edge in the direction of travel moves first, in 220ms.
- The other edge starts 70ms later and moves in 330ms. The total is 400ms.
- The horizontal edges move in 220ms. Opacity changes in 150ms.

```js
import { createNavIndicator } from './js/cozy-motion.js';

const pill = createNavIndicator(navContainer, indicatorEl);
pill.sync(navContainer.querySelector('[aria-current="page"]'));
new ResizeObserver(() => pill.sync(navContainer.querySelector('[aria-current="page"]'), { instant: true })).observe(navContainer);
```

Rules:

1. Put the indicator outside the item list. Then the item count and keyboard order do not change.
2. Measure again when the list changes size: a group opens or closes, or the navigation collapses. Use `ResizeObserver`. A layout change moves the pill without animation (`instant`).
3. The first placement has no animation. The pill does not fly in from the top.
4. While the pill shows, the container has `.cozy-nav-indicator-on`. Use it to make the own background of the selected item transparent. Otherwise two backgrounds show.
5. Ignore items that are not visible, for example items in a closed flyout of a collapsed navigation. The pill stays on the parent item.
6. When no item is active, or the active item has no size, hide the pill.
7. In a mobile drawer, set `--cozy-nav-indicator-bg: var(--cozy-bg-muted)` on the container. The drawer has `bg-surface`, so the default `nav-active` pill does not show clearly on it.

## Table and list rows

- **Row stagger:** add `.cozy-list-row` and the delay from `rowDelayStyle(index)` to each row. Only the first 12 rows get a delay. Row 13 and later use the delay of row 12, so a long list is complete in about 600ms.
- The animation uses `animation-fill-mode: backwards`. After the animation, the row has no transform and no extra stacking context. Sticky cells and row borders keep working.
- The rows animate when they mount: on first load, on a page change and on a new filter. Rows do not animate again when one cell value changes.
- **Row hover:** a clickable row uses `.cozy-row-interactive`. On hover, it gets `overlay-hover` with a 150ms color transition. Do not move or scale a row on hover.

## Drag and drop

- While the user holds a row, set the row opacity to 0.4.
- The other rows move to their new place with `COZY_LAYOUT_SPRING`.
- Animate position only (`layout="position"` in Motion). A size animation stretches the text.
- When the scroll container is itself an animated element, tell the library (`layoutScroll` in Motion). Otherwise rows jump while you scroll.
- A table row cannot have a transform with `border-collapse: collapse`. Use `border-collapse: separate` and `border-spacing: 0`.

## Inline reveal

Use it for a part that appears inside a screen. Examples: a bulk-action bar after the user selects rows, a new condition in an editor, a warning under a field.

- Enter: `opacity 0 → 1`, `y -6px → 0`, 160ms, `motion-ease-out`. The part drops down from the place it belongs to.
- Leave: the same values in reverse.
- Give each part a stable key. Do not use the list index as the key. Otherwise the wrong part leaves.
- Set `pointer-events: none` while the part leaves, so a second click does not hit it.
- Do not animate parts that are already on screen when the page loads (`initial={false}` on `AnimatePresence`).

## Press

For every control that the user clicks: buttons, chips, segments, icon buttons.

- Background, border, text color and shadow change in 160ms. The change is a fade, not a cut.
- While the pointer is down, the control scales to 0.97 in 120ms. It returns when the pointer goes up.
- Do not move a control on hover. Only the color changes.
- A disabled control has no press effect.

## Segment thumb

The selected segment of a segmented control has one `bg-surface` pill behind it. The pill slides to the new segment.

1. Put one `.cozy-seg-thumb` element inside the track. The track has `position: relative`.
2. Set `--cozy-seg-x` and `--cozy-seg-w` from the `offsetLeft` and `offsetWidth` of the selected segment.
3. The first placement has no animation.
4. Place the thumb again after the web font loads (`document.fonts.ready`). The segment width changes when the font changes.

## Tabs

- **Underline:** the active underline moves to the new tab with `COZY_SPRING`. In Motion, use a shared `layoutId`. Give each tab group its own `layoutId` (for example from `useId()`).
- **Panel:** the new panel fades in and rises 6px in 160ms. If the panel holds rows or cards, add the row stagger.
- A panel with a form keeps its state when hidden. See [patterns.md](patterns.md#tab-state-and-accessibility).

## Card lift

For a card that opens something (a shortcut, a stat with a link):

- Hover: rise 2px. The shadow changes from `shadow-low` to `shadow-med`. 180ms.
- Press: scale to 0.985.
- Do not lift a card that does nothing on click.

## Circular theme reveal

```js
import { revealTheme } from './js/cozy-motion.js';

button.addEventListener('click', () => {
	const r = button.getBoundingClientRect();
	revealTheme(() => {
		document.documentElement.dataset.theme = next;
	}, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
});
```

- The new theme grows as a circle from the center of the button. The circle ends at the farthest corner of the window.
- Call `revealTheme` only when the resolved mode changes. A change from "system" to "light" on a light system needs no animation.
- `apply` must change the DOM synchronously. In React, wrap the state update in `flushSync`.
- Without the View Transitions API, or under reduced motion, the theme changes at once.
