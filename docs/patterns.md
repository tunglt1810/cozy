# Patterns

These patterns do not depend on a component library. Class names in the examples use Tailwind CSS syntax with Cozy variables. You can write the same rules in plain CSS.

## Tabs, segmented control, filter chips

Three controls look alike. They do different jobs. Do not swap them.

| Control | Use it to | Do not use it to |
| :--- | :--- | :--- |
| **Underline tabs** | Change between large content areas, at page level or card level | Filter data |
| **Segmented control** | Change the view, the sort order, or a small option (`2D / 3D`, `EN / VI`). Put it in a toolbar or a card corner | Change between large content areas |
| **Filter chips** | Filter by category, often with a count. The active chip uses `bg-inverted` and `text-on-inverted` | Replace tabs |

The segmented control is a pill on a `bg-muted` track. The selected segment is a `bg-surface` pill that slides.

### Tab layout

**Page-level tabs**

- Place them directly below the page header, on the canvas. Do not give them a background or a border box.
- Draw one bottom border across the full width: `border-bottom: 1px solid var(--cozy-border)`.
- Leave 16–20px between the tabs and the content below.
- SHOULD keep the active tab in the URL (`?tab=…` or a nested route), and show it in the breadcrumb.

**Card-level tabs**

- Place them at the top edge of a card that has no padding. Use 16px horizontal padding and a bottom border.
- Do not let the tab bar shrink (`flex-shrink: 0`). When the card body scrolls, the tab bar stays in place.

### Tab button

| Part | Value |
| :--- | :--- |
| Row gap | 4px (card), 8px (page) |
| Button | Transparent, no border, `12px` horizontal padding, `10px` vertical padding, 14px text |
| Active label | `text-primary`, weight 500 (card) or 600 (page) |
| Inactive label | `text-secondary`. On hover: `text-primary` |
| Underline | 2px high, fully rounded, `accent`, across the full button width at the bottom edge. The accent is below 3:1 on light surfaces, so the label weight and color MUST also change |

The underline moves between tabs with `COZY_SPRING`. In Motion, use a shared `layoutId`. Give each tab group its own `layoutId` (for example from `useId()`). A global `layoutId` makes the underline jump between two tab groups on the same page.

### Tab state and accessibility

- **Unsaved form:** a tab that holds a form with unsaved input MUST stay mounted when the user changes tab. Hide it with the `hidden` attribute. If a utility class sets `display: flex` on it, delete that class from the hidden element too, because the class overrides `[hidden]`.
- **ARIA:** `role="tablist"` with an `aria-label`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with `aria-labelledby`.
- **Keyboard:** `ArrowLeft` / `ArrowRight` move between tabs. `Home` / `End` go to the first or last tab. Only the focused tab has `tabindex="0"`. The others have `tabindex="-1"`.
- **Focus:** use `shadow-focus` or a 2px `focus-ring` outline.

## Button hierarchy

| Level | Look | Rule | Examples |
| :--- | :--- | :--- | :--- |
| Primary | `accent` fill, `on-accent` text, pill | Maximum one in each toolbar or action area | Save, Create, Sign in |
| Secondary | `bg-surface` fill, `border-emphasized` outline, pill | — | Reset, Cancel, Import |
| Destructive | `error-muted` fill, `on-error-muted` text, pill | Always ask for confirmation in a dialog. Apply the change only after the server confirms it | Delete |
| Ghost | No fill. `overlay-hover` on hover | For row actions and icon buttons | Edit, More |

Every button is a pill (`radius-full`) and uses weight 600.

## Sticky form toolbar

A long form keeps its actions visible.

**Desktop (768px and wider)**

- The page does not scroll. The form card fills the remaining height of the viewport.
- The page header stays at the top. The form body scrolls inside the card.
- The toolbar stays at the bottom edge of the card, inside its border and its rounded corners.
- Toolbar style: `bg-surface` background, `border` top line, `shadow-toolbar`.

**Mobile (below 768px):** the page scrolls normally. Do not lock the height.

**Toolbar layout** (space between the two groups):

| Left | Right |
| :--- | :--- |
| Save (primary), Reset (secondary), extra actions | Extra actions, Delete (destructive) |

Hide Delete on a create screen. There is no record to delete yet.

Every create and edit form SHOULD use one shared toolbar component. Do not build a new toolbar for each form.
