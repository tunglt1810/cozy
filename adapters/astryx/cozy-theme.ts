// Optional adapter for the Astryx design system.
// Requires @astryxdesign/core and @astryxdesign/theme-neutral (tested with 0.7.16).
// If you do not use Astryx, ignore this folder and use tokens/cozy.css.
import { defineTheme, type TokenValue } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { cozyTokens, type CozyColorToken } from '../../tokens/cozy';

const pair = (token: CozyColorToken): TokenValue => {
	const { light, dark } = cozyTokens.color[token];
	return [light, dark];
};

// Astryx token name → Cozy token name.
const colorMap: Record<string, CozyColorToken> = {
	'--color-background-body': 'bg-body',
	'--color-background-surface': 'bg-surface',
	'--color-background-card': 'bg-surface',
	'--color-background-popover': 'bg-surface',
	'--color-background-muted': 'bg-muted',
	'--color-background-inverted': 'bg-inverted',
	'--color-accent': 'accent',
	'--color-accent-muted': 'accent-muted',
	'--color-on-accent': 'on-accent',
	'--color-text-accent': 'text-accent',
	'--color-icon-accent': 'text-accent',
	'--color-text-primary': 'text-primary',
	'--color-text-secondary': 'text-secondary',
	'--color-text-disabled': 'text-disabled',
	'--color-icon-primary': 'text-primary',
	'--color-icon-secondary': 'text-secondary',
	'--color-icon-disabled': 'text-disabled',
	'--color-overlay': 'overlay',
	'--color-overlay-hover': 'overlay-hover',
	'--color-overlay-pressed': 'overlay-pressed',
	'--color-border': 'border',
	'--color-border-emphasized': 'border-emphasized',
	'--color-skeleton': 'skeleton',
	'--color-track': 'track',
	'--color-shadow': 'shadow',
};

for (const s of ['success', 'warning', 'error', 'info'] as const) {
	colorMap[`--color-${s}`] = s;
	colorMap[`--color-on-${s}`] = `on-${s}`;
	colorMap[`--color-${s}-muted`] = `${s}-muted`;
	colorMap[`--color-on-${s}-muted`] = `on-${s}-muted`;
	colorMap[`--color-text-${s}`] = `text-${s}`;
}

for (const c of ['green', 'orange', 'yellow', 'blue', 'teal', 'cyan', 'purple', 'pink', 'red', 'gray'] as const) {
	colorMap[`--color-background-${c}`] = `${c}-bg`;
	colorMap[`--color-border-${c}`] = `${c}-border`;
	colorMap[`--color-icon-${c}`] = `${c}-icon`;
	colorMap[`--color-text-${c}`] = `${c}-text`;
}

const colors = Object.fromEntries(Object.entries(colorMap).map(([astryx, cozy]) => [astryx, pair(cozy)]));

const splitFontStack = (stack: string): { family: string; fallbacks: string } => {
	const comma = stack.indexOf(',');
	const family = (comma === -1 ? stack : stack.slice(0, comma)).trim().replace(/^["']|["']$/g, '');
	const fallbacks = comma === -1 ? '' : stack.slice(comma + 1).trim();
	return { family, fallbacks };
};

const sansFont = splitFontStack(cozyTokens.font['family-sans']);
const monoFont = splitFontStack(cozyTokens.font['family-mono']);

export const cozyTheme = defineTheme({
	name: 'cozy',
	extends: neutralTheme,
	typography: {
		scale: { base: 14, ratio: 1.2 },
		body: sansFont,
		heading: { ...sansFont, weights: { 3: 'bold', 4: 'bold' } },
		code: monoFont,
	},
	motion: { fast: 160, medium: 360, slow: 800, ratio: 0.75 },
	tokens: {
		...colors,
		'--radius-inner': cozyTokens.radius.inner,
		'--radius-element': cozyTokens.radius.element,
		'--radius-container': cozyTokens.radius.container,
		'--radius-page': cozyTokens.radius.page,
		'--radius-full': cozyTokens.radius.full,
		'--shadow-low': cozyTokens.shadow.low,
		'--shadow-med': cozyTokens.shadow.med,
		'--shadow-high': cozyTokens.shadow.high,
	},
	components: {
		card: { base: { borderRadius: 'var(--radius-container)', boxShadow: 'var(--shadow-low)', padding: 'var(--spacing-4)' } },
		button: {
			base: { borderRadius: 'var(--radius-full)' },
			'variant:destructive': { backgroundColor: 'var(--color-error-muted)', color: 'var(--color-on-error-muted)' },
		},
		'side-nav': {
			base: {
				backgroundColor: 'var(--cozy-nav-bg)',
				color: 'var(--cozy-nav-text)',
				'--color-text-primary': 'var(--cozy-nav-text)',
				'--color-text-secondary': 'var(--cozy-nav-text-muted)',
				'--color-icon-primary': 'var(--cozy-nav-text)',
				'--color-icon-secondary': 'var(--cozy-nav-text-muted)',
			},
		},
		'side-nav-item': {
			base: { borderRadius: 'var(--cozy-radius-nav-item)' },
			selected: { backgroundColor: 'var(--cozy-nav-active)' },
		},
	},
});
