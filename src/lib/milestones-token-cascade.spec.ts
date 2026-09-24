import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubMilestoneComponent } from './milestone.component';
import { HubMilestonesComponent } from './milestones.component';

@Component({
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	template: `
		<hub-milestones [reveal]="false">
			<hub-milestone state="complete">First</hub-milestone>
		</hub-milestones>
	`
})
class Host {}

/** One `selector { … }` rule of the stylesheet as it is injected into the document. */
interface StyleRule {
	selector: string;
	body: string;
}

/**
 * The stylesheet the component actually ships, read back from the document. Going through
 * the DOM rather than the `.scss` source is the point: what decides the cascade is the CSS
 * that reaches the page, after the build has compiled and (where it applies) scoped it.
 */
function shippedRules(): StyleRule[] {
	const css = Array.from(document.querySelectorAll('style'))
		.map((style) => style.textContent ?? '')
		.filter((text) => text.includes('hub-milestone'))
		.join('\n')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	const rules: StyleRule[] = [];
	// Nested at-rules (`@media`, `@keyframes`) are stepped over rather than parsed: their
	// wrapper never matches this pattern, and the rules inside them do.
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		rules.push({ selector: match[1].trim(), body: match[2] });
	}
	return rules;
}

describe('milestones token cascade', () => {
	beforeEach(() => {
		const fixture = TestBed.createComponent(Host);
		fixture.detectChanges();
	});

	it('ships every `--hub-milestone-*` default at zero specificity', () => {
		const declaring = shippedRules().filter((rule) => /--hub-milestone-[a-z-]+\s*:/.test(rule.body));

		expect(declaring.length).toBeGreaterThan(0);
		for (const rule of declaring) {
			// A plain `:root` here scores the same as the application's own `:root`, and the
			// component stylesheet is injected last, so the library won every tie and nothing
			// a product wrote on `:root` ever reached a milestone. `:where()` scores zero, so
			// the consumer's rule wins on specificity instead of on injection order.
			expect(rule.selector, `${rule.selector} declares tokens above zero specificity`).toMatch(/^:where\(/);
		}
	});

	it('declares the whole token family in that one zero-specificity block', () => {
		const [block] = shippedRules().filter((rule) => rule.selector === ':where(:root)');
		const declared = [...block.body.matchAll(/(--hub-milestone-[a-z-]+)\s*:/g)].map((match) => match[1]);

		// The tokens the READMEs and the docs page tell a reader to redefine. Named rather
		// than counted: the guarantee is that each of these is overridable, and a count would
		// still pass with the wrong ones in the block.
		expect(declared).toEqual(
			expect.arrayContaining([
				'--hub-milestone-node-size',
				'--hub-milestone-node-font-size',
				'--hub-milestone-node-color',
				'--hub-milestone-pending-bg',
				'--hub-milestone-pending-color',
				'--hub-milestone-pending-border',
				'--hub-milestone-error-bg',
				'--hub-milestone-connector-thickness',
				'--hub-milestone-connector-pending-bg',
				'--hub-milestone-gap',
				'--hub-milestone-spacing',
				'--hub-milestone-body-color',
				'--hub-milestone-body-muted'
			])
		);
	});

	// Both READMEs have always said the trail follows the node accent and matches a per-node
	// `color`. Declaring the pair at the root broke that promise quietly: the fallback resolved
	// there, where no per-node value exists, so a coloured milestone kept the global trail.
	it('lets the trail follow a per-node accent, which is what the READMEs promise', () => {
		const [connector] = shippedRules().filter((rule) => rule.selector.includes('hub-milestone__connector'));

		expect(connector, 'the connector rule reaches the document').toBeTruthy();
		expect(connector.body, 'the connector reads the accent where it paints, with the token first').toMatch(
			/background:\s*var\(--hub-milestone-connector-bg,\s*var\(--hub-milestone-node-color\)\)/
		);

		const declaring = shippedRules().filter((rule) => /--hub-milestone-connector-bg\s*:/.test(rule.body));
		expect(declaring, 'nothing declares the token upstream, or the fallback would resolve there').toEqual([]);
	});

	// `--hub-milestone-node-text` belongs to the same family as the connector pair: its default
	// is derived from the node's own colour, so it has to resolve where the node is painted. A
	// root declaration would compute the derivation against the root accent and hand every node
	// the same ink, whatever colour the consumer gave it — which is how white ended up on an
	// amber disc at 2.15:1. It stays a full override hook, read first at the point of use.
	it('keeps the node ink derived at the node, with the override hook first', () => {
		const [node] = shippedRules().filter((rule) => rule.selector === '.hub-milestone__node');

		expect(node, 'the node rule reaches the document').toBeTruthy();
		expect(node.body, 'the node reads its ink where it paints, with the token first').toMatch(
			/color:\s*var\(--hub-milestone-node-text,\s*oklch\(from var\(--hub-milestone-node-color\)/
		);

		const declaring = shippedRules().filter((rule) => /--hub-milestone-node-text\s*:/.test(rule.body));
		expect(declaring, 'nothing declares the token upstream, or the fallback would resolve there').toEqual([]);
	});
});
