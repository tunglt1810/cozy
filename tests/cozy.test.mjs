import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	createNavIndicator,
	enterPage,
	revealTheme,
	rowDelayStyle,
	splitGraphemes,
	splitTitle,
	titleStepMs,
} from '../js/cozy-motion.js';
import { cozyTokens, cozyVar } from '../tokens/cozy.ts';

const root = join(import.meta.dir, '..');

function makeClassList(initial = []) {
	const set = new Set(initial);
	return {
		add: (...names) => names.forEach((n) => set.add(n)),
		remove: (...names) => names.forEach((n) => set.delete(n)),
		contains: (name) => set.has(name),
	};
}

function makeStyle() {
	const props = new Map();
	return {
		setProperty: (k, v) => props.set(k, v),
		getPropertyValue: (k) => props.get(k) ?? '',
		whiteSpace: '',
		display: '',
	};
}

function makeEl(tag = 'div', rect = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }) {
	const attrs = new Map();
	const children = [];
	const el = {
		tagName: tag.toUpperCase(),
		className: '',
		classList: makeClassList(),
		style: makeStyle(),
		dataset: {},
		children,
		clientTop: 0,
		clientLeft: 0,
		clientWidth: rect.width,
		clientHeight: rect.height,
		scrollTop: 0,
		scrollLeft: 0,
		offsetHeight: rect.height,
		_text: '',
		get textContent() {
			return this.children.length > 0 ? this.children.map((c) => c.textContent).join('') : this._text;
		},
		set textContent(v) {
			this._text = String(v);
			this.children.length = 0;
		},
		setAttribute: (k, v) => attrs.set(k, String(v)),
		getAttribute: (k) => attrs.get(k) ?? null,
		querySelector: (selector) => {
			if (selector === ':scope > .cozy-sr-only') {
				return children.find((c) => c.className === 'cozy-sr-only') ?? null;
			}
			return null;
		},
		append: (...nodes) => children.push(...nodes),
		getBoundingClientRect: () => ({ ...rect }),
	};
	return el;
}

describe('cozy tokens', () => {
	test('package.json and tokens version match', () => {
		const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
		expect(cozyTokens.version).toBe(pkg.version);
	});

	test('cozyVar formats color and grouped tokens', () => {
		expect(cozyVar('accent')).toBe('var(--cozy-accent)');
		expect(cozyVar('success-on-inverted')).toBe('var(--cozy-success-on-inverted)');
		expect(cozyVar('radius-element')).toBe('var(--cozy-radius-element)');
		expect(cozyVar('space-4')).toBe('var(--cozy-space-4)');
		expect(cozyVar('motion-duration-fast')).toBe('var(--cozy-motion-duration-fast)');
	});
});

describe('cozy-motion pure helpers', () => {
	test('splitGraphemes keeps Vietnamese stacked diacritics together', () => {
		expect(splitGraphemes('Tiếng Việt')).toEqual(['T', 'i', 'ế', 'n', 'g', ' ', 'V', 'i', 'ệ', 't']);
		expect(splitGraphemes('e\u0302\u0301')).toEqual(['ế']);
	});

	test('titleStepMs caps at 26ms and compresses long titles', () => {
		expect(titleStepMs(1)).toBe(26);
		expect(titleStepMs(5)).toBe(26);
		expect(titleStepMs(24)).toBe(10);
	});

	test('rowDelayStyle clamps negative and long indices', () => {
		expect(rowDelayStyle(-2)).toEqual({ '--cozy-row-delay': '0ms' });
		expect(rowDelayStyle(3)).toEqual({ '--cozy-row-delay': '84ms' });
		expect(rowDelayStyle(50)).toEqual({ '--cozy-row-delay': '336ms' });
	});
});

describe('cozy-motion DOM helpers', () => {
	test('splitTitle adds .cozy-sr-only text and is idempotent across repeated calls', () => {
		const prevDoc = globalThis.document;
		globalThis.document = {
			documentElement: { dataset: {} },
			createElement: (tag) => makeEl(tag),
		};
		try {
			const span = makeEl('span');
			span.textContent = 'Warm UI';
			splitTitle(span);
			splitTitle(span);

			expect(span.getAttribute('aria-label')).toBeNull();
			expect(span.children[0].className).toBe('cozy-sr-only');
			expect(span.children[0].textContent).toBe('Warm UI');
			for (const visual of span.children.slice(1)) {
				expect(visual.getAttribute('aria-hidden')).toBe('true');
			}
		} finally {
			globalThis.document = prevDoc;
		}
	});

	test('enterPage cancels previous animation on the same element', () => {
		const prevDoc = globalThis.document;
		const prevMatch = globalThis.matchMedia;
		globalThis.document = { documentElement: { dataset: {} } };
		globalThis.matchMedia = () => ({ matches: false });
		try {
			let cancelled = 0;
			const el = {
				animate: () => ({ cancel: () => (cancelled += 1) }),
			};
			enterPage(el);
			enterPage(el);
			expect(cancelled).toBe(1);
		} finally {
			globalThis.document = prevDoc;
			globalThis.matchMedia = prevMatch;
		}
	});

	test('createNavIndicator handles scroll/border offsets, horizontal direction, and destroy', () => {
		const prevRaf = globalThis.requestAnimationFrame;
		const prevCancel = globalThis.cancelAnimationFrame;
		let nextId = 1;
		const cancelled = [];
		globalThis.requestAnimationFrame = () => nextId++;
		globalThis.cancelAnimationFrame = (id) => {
			if (id) cancelled.push(id);
		};
		try {
			const container = makeEl('nav', { top: 10, bottom: 110, left: 20, right: 220, width: 200, height: 100 });
			container.clientTop = 2;
			container.clientLeft = 2;
			container.scrollTop = 15;
			container.clientHeight = 96;
			container.clientWidth = 196;

			const indicator = makeEl('span');
			const item1 = makeEl('a', { top: 22, bottom: 52, left: 32, right: 112, width: 80, height: 30 });
			const item2 = makeEl('a', { top: 22, bottom: 52, left: 122, right: 202, width: 80, height: 30 });

			const pill = createNavIndicator(container, indicator);
			pill.sync(item1);
			expect(indicator.style.getPropertyValue('--cozy-pill-top')).toBe('25px');
			expect(indicator.style.getPropertyValue('--cozy-pill-left')).toBe('10px');
			expect(indicator.classList.contains('cozy-nav-instant')).toBe(true);

			pill.sync(item2);
			expect(indicator.classList.contains('cozy-nav-dir-horizontal')).toBe(true);
			expect(indicator.style.getPropertyValue('--cozy-pill-left')).toBe('100px');

			pill.sync(item1, { instant: true });
			pill.destroy();
			expect(cancelled.length).toBeGreaterThanOrEqual(2);
		} finally {
			globalThis.requestAnimationFrame = prevRaf;
			globalThis.cancelAnimationFrame = prevCancel;
		}
	});

	test('revealTheme handles rapid overlapping transitions and rejected finished promises', async () => {
		const prevDoc = globalThis.document;
		const prevWin = globalThis.window;
		const prevMatch = globalThis.matchMedia;
		const rootEl = makeEl('html');
		rootEl.animate = () => ({});

		const pending = [];
		globalThis.window = { innerWidth: 1000, innerHeight: 800 };
		globalThis.matchMedia = () => ({ matches: false });
		globalThis.document = {
			documentElement: rootEl,
			startViewTransition: (cb) => {
				cb();
				let resolveFinished;
				let rejectFinished;
				const finished = new Promise((res, rej) => {
					resolveFinished = res;
					rejectFinished = rej;
				});
				pending.push({ resolve: resolveFinished, reject: rejectFinished });
				return { ready: Promise.resolve(), finished };
			},
		};
		try {
			revealTheme(() => {});
			revealTheme(() => {});
			expect(rootEl.classList.contains('cozy-theme-transition')).toBe(true);

			pending[0].reject(new Error('aborted'));
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
			expect(rootEl.classList.contains('cozy-theme-transition')).toBe(true);

			pending[1].resolve();
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
			expect(rootEl.classList.contains('cozy-theme-transition')).toBe(false);
		} finally {
			globalThis.document = prevDoc;
			globalThis.window = prevWin;
			globalThis.matchMedia = prevMatch;
		}
	});
});

describe('github page output', () => {
	test('root index.html renders directly without redirect and links cache-busted root assets', () => {
		const html = readFileSync(join(root, 'index.html'), 'utf8');
		expect(html).not.toContain('http-equiv="refresh"');
		expect(html).toContain('<link rel="canonical" href="https://tunglt1810.github.io/cozy/" />');
		expect(html).toMatch(/href="tokens\/cozy\.css\?v=[0-9a-f]{8}"/);
		expect(html).toMatch(/href="css\/effects\.css\?v=[0-9a-f]{8}"/);
		expect(html).toMatch(/'\.\/js\/cozy-motion\.js\?v=[0-9a-f]{8}'/);
		expect(html).not.toContain('{{BG_BODY_LIGHT}}');
		expect(html).not.toContain('{{BG_BODY_DARK}}');
		expect(html).not.toContain('{{VERSION}}');
		expect(html).not.toContain('{{COZY_SPRING_LINEAR}}');
	});

	test('root index.html keeps JS fallbacks for new dialog features', () => {
		const html = readFileSync(join(root, 'index.html'), 'utf8');
		expect(html).toContain("'commandForElement' in HTMLButtonElement.prototype");
		expect(html).toContain("'closedBy' in HTMLDialogElement.prototype");
	});

	test('preview/index.html redirects legacy bookmarks to root and keeps the hash', () => {
		const html = readFileSync(join(root, 'preview/index.html'), 'utf8');
		expect(html).toContain("location.replace('../' + location.hash)");
		expect(html).toContain('content="0; url=../"');
		expect(html).toContain('<link rel="canonical" href="https://tunglt1810.github.io/cozy/" />');
	});
});

