import { compile } from 'sass';
import { contrastRatio, oklchToRgb, rgbToOklch, toHex, toRgb } from 'ng-hub-ui-utils';

/**
 * A milestone node is a coloured disc with a number, a letter or a glyph inside it, and the
 * colour is the consumer's: `color="#f59e0b"` on the node, or a `--hub-milestone-node-color`
 * anywhere above it. The ink was not — it was white, always — so every accent lighter than
 * mid-grey printed white on a bright disc: measured, `#f59e0b` came out at 2.15:1, `#0ea5e9`
 * at 2.77:1 and `#16a34a` at 3.30:1.
 *
 * What is measured here is the rule the stylesheet publishes, not a box in a browser: the
 * sheet is compiled, the node's `color` chain is resolved the way a browser resolves it —
 * including the relative-colour derivation — and the result is put on a contrast meter.
 * jsdom lays nothing out and resolves no relative colour, so measuring the element would
 * measure nothing.
 */

/** The three accents the docs' own custom-nodes example paints, which is where this was seen. */
const EXAMPLE_ACCENTS: Readonly<Record<string, string>> = {
	'example amber': '#f59e0b',
	'example sky': '#0ea5e9',
	'example green': '#16a34a'
};

/** The ds light-theme accents a consumer reaches through `color="primary"` and friends. */
const DS_ACCENTS: Readonly<Record<string, string>> = {
	primary: '#0d6efd',
	secondary: '#6c757d',
	success: '#198754',
	danger: '#dc3545',
	warning: '#ffc107',
	info: '#0dcaf0',
	neutral: '#6c757d',
	light: '#f8f9fa',
	dark: '#212529'
};

const ACCENTS = { ...EXAMPLE_ACCENTS, ...DS_ACCENTS };

/** WCAG AA for text under 18.66px bold — the node glyph is 1.05rem at weight 700. */
const MIN_CONTRAST = 4.5;

const sheet = compile('projects/milestones/src/lib/milestones.component.scss').css;

/** The body of a rule, by its exact selector. */
function ruleBody(selector: string): string {
	const start = sheet.indexOf(`${selector} {`);
	expect(start).toBeGreaterThan(-1);
	return sheet.slice(start + selector.length + 2, sheet.indexOf('}', start));
}

/** A declaration's value inside a rule body. */
function declared(body: string, property: string): string {
	const match = new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`).exec(body);
	expect(match, `${property} is not declared`).not.toBeNull();
	return match![1].replace(/\s+/g, ' ').trim();
}

/** Every custom property the stylesheet declares by default. */
const TOKENS: Record<string, string> = {};
for (const line of ruleBody(':where(:root)').split(';')) {
	const match = /^\s*(--[\w-]+):\s*([\s\S]+)$/.exec(line);
	if (match) {
		TOKENS[match[1]] = match[2].replace(/\s+/g, ' ').trim();
	}
}

/** Splits a function's arguments on top-level commas. */
function args(inner: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let current = '';
	for (const char of inner) {
		if (char === '(') depth++;
		if (char === ')') depth--;
		if (char === ',' && depth === 0) {
			out.push(current.trim());
			current = '';
			continue;
		}
		current += char;
	}
	out.push(current.trim());
	return out;
}

/** Splits a relative-colour body on top-level whitespace: `from`, the source, then L C H. */
function parts(inner: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let current = '';
	for (const char of inner) {
		if (char === '(') depth++;
		if (char === ')') depth--;
		if (/\s/.test(char) && depth === 0) {
			if (current) out.push(current);
			current = '';
			continue;
		}
		current += char;
	}
	if (current) out.push(current);
	return out;
}

/** The contents of `name(...)` when `value` is exactly that call. */
function call(value: string, name: string): string | null {
	if (!value.toLowerCase().startsWith(`${name}(`) || !value.endsWith(')')) {
		return null;
	}
	return value.slice(name.length + 1, -1).trim();
}

/** Evaluates the `clamp()` a lightness flip is written with. `l` is the source's own lightness. */
function resolveNumber(value: string, lightness: number): number {
	const trimmed = value.trim();
	if (trimmed === 'l') {
		return lightness;
	}

	const clamp = call(trimmed, 'clamp');
	if (clamp) {
		const [low, mid, high] = args(clamp).map((part) => resolveNumber(part, lightness));
		// CSS resolves clamp() as max(low, min(mid, high)), so an inverted window yields `low`.
		return Math.max(low, Math.min(mid, high));
	}

	const product = /^\(([^)]+)\)\s*\*\s*([\d.]+)$/.exec(trimmed);
	if (product) {
		return resolveNumber(product[1], lightness) * Number(product[2]);
	}

	const difference = /^([\d.]+)\s*-\s*(\S+)$/.exec(trimmed);
	if (difference) {
		return Number(difference[1]) - resolveNumber(difference[2], lightness);
	}

	return Number(trimmed);
}

/** Resolves a colour-valued declaration down to a hex string, for the given node accent. */
function resolveColor(value: string, accent: string): string {
	const trimmed = value.trim();

	const variable = call(trimmed, 'var');
	if (variable) {
		const [name, ...fallback] = args(variable);
		if (name === '--hub-milestone-node-color') {
			return accent;
		}
		const declaredValue = TOKENS[name];
		return resolveColor(declaredValue ?? fallback.join(', '), accent);
	}

	const relative = call(trimmed, 'oklch');
	if (relative?.startsWith('from')) {
		// `oklch(from <color> <l> c h)` — only the lightness is rewritten, which is the whole
		// point of the flip: it picks the black or the white end and nothing in between.
		const [, source, lightness] = parts(relative);
		const base = rgbToOklch(toRgb(resolveColor(source, accent))!);
		const rewritten = oklchToRgb({ ...base, l: resolveNumber(lightness, base.l), c: 0 });
		return toHex({
			r: Math.min(255, Math.max(0, rewritten.r)),
			g: Math.min(255, Math.max(0, rewritten.g)),
			b: Math.min(255, Math.max(0, rewritten.b)),
			a: 1
		})!;
	}

	return trimmed;
}

/** The ink a node is actually painted with, for a given disc colour. */
function nodeInk(accent: string): string {
	return resolveColor(declared(ruleBody('.hub-milestone__node'), 'color'), accent);
}

describe('milestone node contrast', () => {
	it.each(Object.entries(ACCENTS))('reads on a %s node', (_name, accent) => {
		expect(contrastRatio(nodeInk(accent), accent)!).toBeGreaterThanOrEqual(MIN_CONTRAST);
	});

	/**
	 * The ink is derived, not chosen, so it may only ever be one of the two ends. Anything else
	 * would mean the derivation drifted from the `--hub-sys-color-*-on` token the design system
	 * computes with the same expression, and one accent would take two different inks.
	 */
	it.each(Object.entries(ACCENTS))('picks an end of the ramp on a %s node', (_name, accent) => {
		expect(['#000000', '#ffffff']).toContain(nodeInk(accent).toLowerCase());
	});

	/** The consumer keeps the last word: a declared `--hub-milestone-node-text` still wins. */
	it('leaves the override hook in the chain', () => {
		expect(declared(ruleBody('.hub-milestone__node'), 'color')).toMatch(/^var\(--hub-milestone-node-text,/);
	});
});
