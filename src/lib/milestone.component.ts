import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	inject,
	input,
	signal,
	ViewEncapsulation
} from '@angular/core';
import { HUB_MILESTONES_CONFIG } from './hub-milestones.config';
import { HubMilestoneNodeDirective } from './milestone-node.directive';
import { resolveHubAccent } from 'ng-hub-ui-utils';

/** Visual state of a milestone node. */
export type HubMilestoneState = 'complete' | 'active' | 'pending' | 'error';

/**
 * Built-in wording announced for each state.
 *
 * `active` is deliberately empty: the host already carries `aria-current="step"`, which every
 * screen reader renders as "current step", and a second word beside it only repeats it. The
 * other three have no such attribute — colour was their only carrier — so each gets a word.
 */
const DEFAULT_STATE_LABELS: Record<HubMilestoneState, string> = {
	complete: 'Completed',
	active: '',
	pending: 'Pending',
	error: 'Error'
};

/**
 * A single node in a `hub-milestones` timeline. Renders a circular node (with optional
 * custom content via `hubMilestoneNode`, an auto-incremented number otherwise) plus its
 * projected body content. Fully themeable per node through `color` and `--hub-milestone-*`.
 */
@Component({
	selector: 'hub-milestone',
	standalone: true,
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'hub-milestone',
		role: 'listitem',
		'[attr.data-state]': 'state()',
		'[attr.aria-current]': "state() === 'active' ? 'step' : null",
		'[class.hub-milestone--complete]': "state() === 'complete'",
		'[class.hub-milestone--active]': "state() === 'active'",
		'[class.hub-milestone--pending]': "state() === 'pending'",
		'[class.hub-milestone--error]': "state() === 'error'",
		'[style.--hub-milestone-node-color]': 'accentVar()',
		'[style.--hub-milestone-index]': '_autoIndex()'
	},
	template: `
		<div class="hub-milestone__rail" aria-hidden="true">
			<span class="hub-milestone__node">
				@if (nodeTemplate()) {
					<ng-container [ngTemplateOutlet]="nodeTemplate()!.template" />
				} @else if (label()) {
					{{ label() }}
				} @else {
					{{ displayNumber() }}
				}
			</span>
			@if (state() === 'error') {
				<span class="hub-milestone__marker">!</span>
			}
			<span class="hub-milestone__connector"></span>
		</div>
		<div class="hub-milestone__body">
			@if (stateText(); as text) {
				<span class="hub-milestone__state">{{ text }}</span>
			}
			<ng-content />
		</div>
	`
})
export class HubMilestoneComponent {
	/** Visual state, drives the node/connector colors. */
	readonly state = input<HubMilestoneState>('pending');

	/**
	 * Per-node color override. Accepts a semantic accent name (e.g. `primary`, or any
	 * registered/CSS named colour) or a literal value (`#hex`, `rgb()`, `oklch()`, `var()`).
	 * Wins over the state color.
	 */
	readonly color = input<string>('');

	/**
	 * The state in words, read out with the step and clipped out of the page.
	 *
	 * Overrides the global `stateLabels` ({@link provideHubMilestones}) for this node — which
	 * is how the wording gets translated. `''` silences this node; `undefined` (the default)
	 * inherits the global config, and the built-in English wording under that.
	 */
	readonly stateLabel = input<string | undefined>(undefined);

	/**
	 * Resolved accent bound to `--hub-milestone-node-color`. A bareword resolves to the ds
	 * token `var(--hub-sys-color-<name>, <name>)` (so semantic names work, with the raw word
	 * as fallback); a literal `#hex`/`rgb()`/`oklch()`/`var()` is passed through unchanged.
	 */
	protected readonly accentVar = computed(() => resolveHubAccent(this.color()));

	/** Fallback content shown inside the node when no `hubMilestoneNode` template is given. */
	readonly label = input<string>('');

	/** Custom node content projected as `<ng-template hubMilestoneNode>`. */
	readonly nodeTemplate = contentChild(HubMilestoneNodeDirective);

	private readonly _config = inject(HUB_MILESTONES_CONFIG, { optional: true });

	/** Per-node input, then the application's `stateLabels`, then the built-in wording. */
	protected readonly stateText = computed(() => {
		const explicit = this.stateLabel();
		if (explicit !== undefined) {
			return explicit;
		}
		const state = this.state();
		return this._config?.stateLabels?.[state] ?? DEFAULT_STATE_LABELS[state];
	});

	/** Zero-based position assigned by the parent `hub-milestones`. */
	protected readonly _autoIndex = signal(0);

	/** 1-based number shown when the node has neither custom template nor label. */
	readonly displayNumber = computed(() => this._autoIndex() + 1);

	/** Called by the parent container to number the nodes automatically. */
	setAutoIndex(index: number): void {
		this._autoIndex.set(index);
	}
}
