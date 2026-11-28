// Cozy motion helpers. Framework-free ES module.

/** Ease-out curve for entrances. Same value as --cozy-motion-ease-out. */
export const COZY_EASE = [0.22, 1, 0.36, 1];

/** Spring for small state changes: tab underline, toggles. Works with Motion (motion.dev) and similar libraries. */
export const COZY_SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.9 };

/** Spring for layout changes: list reorder, size changes. */
export const COZY_LAYOUT_SPRING = { type: 'spring', stiffness: 400, damping: 34, mass: 0.9 };

/** Slow, soft spring for a number that counts up to its value. */
export const COZY_COUNT_SPRING = { type: 'spring', stiffness: 120, damping: 24, mass: 0.8 };

/**
 * True when the user prefers reduced motion, or the page sets `<html data-motion="reduce">`.
 * @returns {boolean}
 */
export const reducedMotion = () =>
	(typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduce') ||
	(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

const pageAnimations = new WeakMap();

/**
 * Plays the page-enter animation on the element that wraps the page content: fade in and rise 8px in 200ms.
 * Call it after a route change. Do not call it on the first load.
 * Cancels any running page-enter animation on the same element.
 * Returns the Animation, or null when the user prefers reduced motion.
 * @param {HTMLElement} el
 * @returns {Animation | null}
 */
export function enterPage(el) {
	pageAnimations.get(el)?.cancel();
	pageAnimations.delete(el);
	if (reducedMotion() || typeof el.animate !== 'function') return null;
	const animation = el.animate(
		[
			{ opacity: 0, transform: 'translateY(8px)' },
			{ opacity: 1, transform: 'translateY(0)' },
		],
		{ duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
	);
	pageAnimations.set(el, animation);
	return animation;
}

/**
 * Controls one `.cozy-nav-indicator` inside `container`.
 * Call `sync(activeEl)` after each navigation. Call `sync(activeEl, { instant: true })` after a layout change
 * (a group opens or closes, the navigation collapses). Pass null when no item is active.
 * Call `destroy()` on unmount to cancel any pending animation frame.
 * The container gets `.cozy-nav-indicator-on` while the pill shows. Use it to hide the own background of the selected item.
 * @param {HTMLElement} container positioned element that holds the item list and the indicator
 * @param {HTMLElement} indicator
 */
export function createNavIndicator(container, indicator) {
	let prevTop = null;
	let prevLeft = null;
	let frame = 0;

	const hide = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		indicator.style.setProperty('--cozy-pill-opacity', '0');
		container.classList.remove('cozy-nav-indicator-on');
		prevTop = null;
		prevLeft = null;
	};

	const destroy = () => {
		cancelAnimationFrame(frame);
		frame = 0;
	};

	/**
	 * @param {HTMLElement | null} activeEl
	 * @param {{ instant?: boolean }} [options]
	 */
	const sync = (activeEl, options = {}) => {
		if (!activeEl) return hide();
		const box = container.getBoundingClientRect();
		const item = activeEl.getBoundingClientRect();
		// A hidden item (for example inside a closed popover) has no size. Do not move the pill to it.
		if (box.height <= 0 || item.height <= 0) return hide();

		const borderTop = container.clientTop || 0;
		const borderLeft = container.clientLeft || 0;
		const scrollTop = container.scrollTop || 0;
		const scrollLeft = container.scrollLeft || 0;
		const top = item.top - box.top - borderTop + scrollTop;
		const left = item.left - box.left - borderLeft + scrollLeft;
		const contentHeight = container.clientHeight || box.height;
		const contentWidth = container.clientWidth || box.width;
		const bottom = contentHeight - (top + item.height);
		const right = contentWidth - (left + item.width);

		const instant = options.instant === true || prevTop === null;
		cancelAnimationFrame(frame);
		frame = 0;
		indicator.classList.remove('cozy-nav-dir-down', 'cozy-nav-dir-up', 'cozy-nav-dir-horizontal');
		if (instant) {
			indicator.classList.add('cozy-nav-instant');
		} else {
			indicator.classList.remove('cozy-nav-instant');
			if (top !== prevTop) indicator.classList.add(top > prevTop ? 'cozy-nav-dir-down' : 'cozy-nav-dir-up');
			else if (left !== prevLeft) indicator.classList.add('cozy-nav-dir-horizontal');
		}

		indicator.style.setProperty('--cozy-pill-top', `${top}px`);
		indicator.style.setProperty('--cozy-pill-bottom', `${bottom}px`);
		indicator.style.setProperty('--cozy-pill-left', `${left}px`);
		indicator.style.setProperty('--cozy-pill-right', `${right}px`);
		indicator.style.setProperty('--cozy-pill-opacity', '1');
		container.classList.add('cozy-nav-indicator-on');

		if (instant) {
			// Read layout once, so the browser applies the new position without a transition. Then turn transitions on again.
			void indicator.offsetHeight;
			frame = requestAnimationFrame(() => indicator.classList.remove('cozy-nav-instant'));
		}
		prevTop = top;
		prevLeft = left;
	};

	return { sync, hide, destroy };
}

/**
 * Returns the inline style for one `.cozy-list-row`.
 * Rows after `maxRows` share the last delay, so a long list never waits more than maxRows × stepMs.
 * @param {number} index
 * @param {number} [maxRows=12]
 * @param {number} [stepMs=28]
 * @returns {{ '--cozy-row-delay': string }}
 */
export function rowDelayStyle(index, maxRows = 12, stepMs = 28) {
	return { '--cozy-row-delay': `${Math.min(Math.max(0, index), maxRows) * stepMs}ms` };
}

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

/**
 * Splits text into graphemes, so a letter and its diacritics stay in one span.
 * @param {string} text
 * @returns {string[]}
 */
export function splitGraphemes(text) {
	const normalized = text.normalize('NFC');
	return segmenter ? Array.from(segmenter.segment(normalized), (s) => s.segment) : Array.from(normalized);
}

/**
 * Returns the delay between two characters of the title reveal.
 * A short title uses 26ms. A long title shares a total delay of about 240ms.
 * @param {number} charCount
 * @returns {number}
 */
export function titleStepMs(charCount) {
	return Math.min(26, Math.round(240 / Math.max(1, charCount)));
}

/**
 * Splits the text of `el` into `.cozy-title-char` spans inside `.cozy-title-char-mask` spans for the title reveal.
 * Each word stays in one `white-space: nowrap` span, so a line never breaks inside a word.
 * A `.cozy-sr-only` span keeps the plain text accessible on any element, including generic `<span>`.
 * @param {HTMLElement} el
 */
export function splitTitle(el) {
	const existingSr = typeof el.querySelector === 'function' ? el.querySelector(':scope > .cozy-sr-only') : null;
	const text = existingSr?.textContent ?? el.textContent ?? '';
	const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
	const total = tokens.reduce((n, t) => (/^\s+$/.test(t) ? n : n + splitGraphemes(t).length), 0);
	const step = titleStepMs(total);
	let index = 0;

	el.textContent = '';
	const sr = document.createElement('span');
	sr.className = 'cozy-sr-only';
	sr.textContent = text;
	el.append(sr);

	for (const token of tokens) {
		const word = document.createElement('span');
		word.setAttribute('aria-hidden', 'true');
		if (/^\s+$/.test(token)) {
			word.style.whiteSpace = 'pre';
			word.textContent = token;
			el.append(word);
			continue;
		}
		word.style.display = 'inline-flex';
		word.style.whiteSpace = 'nowrap';
		for (const g of splitGraphemes(token)) {
			const mask = document.createElement('span');
			mask.className = 'cozy-title-char-mask';
			const char = document.createElement('span');
			char.className = 'cozy-title-char';
			char.style.setProperty('--cozy-char-delay', `${index * step}ms`);
			char.textContent = g;
			mask.append(char);
			word.append(mask);
			index += 1;
		}
		el.append(word);
	}
}

let activeThemeReveal = 0;

/**
 * Applies a theme change. The new theme grows as a circle from `origin` in 480ms.
 * The function calls `apply` directly (no animation) in these conditions:
 * - The browser has no View Transitions API.
 * - The user prefers reduced motion.
 * Load css/effects.css for the `.cozy-theme-transition` rules.
 * `apply` must change the DOM synchronously. In React, wrap the state update in `flushSync`.
 * @param {() => void} apply
 * @param {{ x: number, y: number }} [origin] viewport point, for example the center of the toggle button
 * @returns {ViewTransition | null}
 */
export function revealTheme(apply, origin) {
	if (typeof document.startViewTransition !== 'function' || reducedMotion()) {
		apply();
		return null;
	}

	const x = origin?.x ?? window.innerWidth;
	const y = origin?.y ?? 0;
	const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
	const root = document.documentElement;
	const id = ++activeThemeReveal;
	root.classList.add('cozy-theme-transition');

	const transition = document.startViewTransition(apply);
	transition.ready
		.then(() => {
			if (id !== activeThemeReveal) return;
			root.animate(
				{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
				{ duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
			);
		})
		.catch(() => undefined);
	transition.finished
		.catch(() => undefined)
		.finally(() => {
			if (id === activeThemeReveal) root.classList.remove('cozy-theme-transition');
		});
	return transition;
}
