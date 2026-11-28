# Patterns

These patterns do not depend on a component library. Class names in the examples use Tailwind CSS syntax with Cozy variables. You can write the same rules in plain CSS.

## Tabs, segmented control, filter chips

Three controls look alike. They do different jobs. Do not swap them.

| Control | Use it to | Do not use it to |
| :--- | :--- | :--- |
| **Underline tabs** | Change between large content areas, at page level or card level | Filter data |
| **Segmented control** | Change the view, the sort order, or a small option (`2D / 3D`, `EN / VI`). Put it in a toolbar or a card corner | Change between large content areas |
| **Filter chips** | Filter by category, often with a count. The active chip uses `bg-inverted` and `text-on-inverted` | Replace tabs |

The segmented control is a pill on a `bg-muted` track. The selected segment is a `bg-surface` pill that slides. See [segment thumb](motion.md#segment-thumb).

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

## Form fields

All fields use the same frame. The user learns one shape and sees it everywhere.

### Text field and select

| Part | Value |
| :--- | :--- |
| Label | Above the field. `label` style (14px, weight 500), `text-primary`. 4px gap to the field |
| Field | 36px high, 12px horizontal padding, `radius-element`, `bg-surface`, 1px `border-emphasized`, `body` text |
| Placeholder | `text-disabled`. A placeholder is an example, not a label |
| Helper text | Below the field. `supporting` style, `text-secondary`. 4px gap |
| Select | Same frame. A chevron icon in `text-secondary` at the end, 12px from the edge |

| State | Change |
| :--- | :--- |
| Hover | Border changes to `text-disabled` |
| Focus | `shadow-focus`. The border stays |
| Error | Border changes to `error`. The helper text changes to the error message in `text-error`, with an error icon. Set `aria-invalid="true"` and link the message with `aria-describedby` |
| Disabled | `bg-muted` fill, `text-disabled` text, no hover change |
| Read-only | No border. `bg-muted` fill. The text stays `text-primary` |

Show an error after the user leaves the field or submits the form. Do not show it while the user types for the first time.

### Checkbox, radio, switch

| Control | Off | On |
| :--- | :--- | :--- |
| Checkbox | 16px box, 4px radius, 1.5px `border-emphasized` border, `bg-surface` | `accent` fill, tick mark in `on-accent` |
| Radio | 16px circle, same border | `accent` ring with a 6px `accent` dot |
| Switch | 36 × 20px pill, `track` fill, 16px `bg-surface` thumb | `accent` fill. The thumb slides to the end in 160ms |

- The label is to the right of the control. Clicking the label changes the control.
- The click area is at least 24 × 24px, also when the control is smaller.
- Use a switch only for a setting that applies at once. Inside a form that the user saves, use a checkbox.

## Dialog

- `bg-surface`, `radius-page`, `shadow-high`, 24px padding, maximum width 480px.
- The scrim is `overlay`.
- Title in `heading-2`. Body text in `body`.
- Actions at the bottom right. The secondary action is on the left, the primary or destructive action is on the right.
- Use the native `<dialog>` element with `showModal()`. It keeps focus inside the dialog and closes on `Escape`.
- Motion: fade in and grow from 98% in 200ms. The scrim fades in at the same time. Class: `.cozy-dialog`.

A confirmation dialog names the object and the result: "Delete 3 drafts? You cannot undo this." Not "Are you sure?".

## Toast

- Bottom end of the window, 16px from the edges. Maximum 3 toasts. A new toast goes at the bottom.
- `bg-inverted` fill, `text-on-inverted` text, `radius-element`, `shadow-high`, 12px × 16px padding.
- A status icon at the start shows the type. The icon uses the `<status>-on-inverted` token, so it stays visible on `bg-inverted` in both modes.
- `role="status"` for information. `role="alert"` only for an error that needs action.
- Hide after 5 seconds. Keep the toast while the pointer is on it or it has focus. A toast with an action stays until the user closes it.
- Motion: rise 12px and fade in, 260ms. Leave: fade out, 160ms. Class: `.cozy-toast`, then `.cozy-toast-leave`.

## Empty state

- Center it in the area that has no content.
- A 48px icon chip: `bg-muted`, `radius-element`, icon in `text-secondary`.
- Title in `heading-3`. One sentence in `text-secondary` that says why the area is empty and what to do.
- Maximum one primary action. A filter result with no rows shows a "Clear filters" secondary action instead.

## Loading skeleton

- Use a skeleton when you know the layout: rows, cards, a profile header. Use a spinner only for an action in a button.
- Each block has the shape of the content it replaces. Text lines are 12px high with `radius-inner`. The last line is shorter.
- `skeleton` fill. A light band moves across in 1.4s. Under reduced motion, the band stops. Class: `.cozy-skeleton`.
- Set `aria-busy="true"` on the region while it loads.
