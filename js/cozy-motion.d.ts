export interface CozySpring {
	readonly type: 'spring';
	readonly stiffness: number;
	readonly damping: number;
	readonly mass: number;
}

export interface CozyNavIndicator {
	sync(activeEl: HTMLElement | null, options?: { instant?: boolean }): void;
	hide(): void;
	destroy(): void;
}

export const COZY_EASE: readonly [number, number, number, number];
export const COZY_SPRING: CozySpring;
export const COZY_LAYOUT_SPRING: CozySpring;
export const COZY_COUNT_SPRING: CozySpring;

export function reducedMotion(): boolean;
export function enterPage(el: HTMLElement): Animation | null;
export function createNavIndicator(container: HTMLElement, indicator: HTMLElement): CozyNavIndicator;
export function rowDelayStyle(index: number, maxRows?: number, stepMs?: number): { '--cozy-row-delay': string };
export function splitGraphemes(text: string): string[];
export function titleStepMs(charCount: number): number;
export function splitTitle(el: HTMLElement): void;
export function revealTheme(apply: () => void, origin?: { x: number; y: number }): ViewTransition | null;
