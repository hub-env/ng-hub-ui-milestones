import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHubMilestones } from './hub-milestones.config';
import { HubMilestoneComponent, HubMilestoneState } from './milestone.component';
import { HubMilestonesComponent } from './milestones.component';

/**
 * The error state used to be a red circle and nothing else.
 *
 * The rail is `aria-hidden`, so the colour was the whole of the signal: a reader who does not
 * separate red from green got no difference at all, on the one state where the difference is
 * the point. What is pinned here is the second signal in both of its halves — the word carried
 * into the accessibility tree, and a mark on the node that survives greyscale — and that the
 * word is CLIPPED rather than hidden, because `display: none` would take it away again.
 */
@Component({
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	template: `
		<hub-milestones>
			<hub-milestone state="complete">Ordered</hub-milestone>
			<hub-milestone state="active">Packed</hub-milestone>
			<hub-milestone state="pending">Delivered</hub-milestone>
			<hub-milestone [state]="lastState()" [stateLabel]="lastLabel()">Invoiced</hub-milestone>
		</hub-milestones>
	`
})
class Host {
	lastState = signal<HubMilestoneState>('error');
	lastLabel = signal<string | undefined>(undefined);
}

describe('a milestone in error is distinguishable without colour', () => {
	let fixture: ReturnType<typeof TestBed.createComponent<Host>>;

	function milestones(): HTMLElement[] {
		return Array.from(fixture.nativeElement.querySelectorAll('.hub-milestone'));
	}

	function errorNode(): HTMLElement {
		return milestones()[3];
	}

	function stateWordOf(milestone: HTMLElement): HTMLElement | null {
		return milestone.querySelector('.hub-milestone__state');
	}

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [Host] });
		fixture = TestBed.createComponent(Host);
		fixture.detectChanges();
	});

	it('says the state in words, where a screen reader reaches it', () => {
		const word = stateWordOf(errorNode());

		expect(word, 'state word rendered for an error milestone').not.toBeNull();
		expect(word!.textContent?.trim()).toBe('Error');
	});

	it('keeps the word out of the aria-hidden rail, which is where the colour lives', () => {
		const rail = errorNode().querySelector('.hub-milestone__rail')!;

		expect(rail.getAttribute('aria-hidden')).toBe('true');
		expect(rail.querySelector('.hub-milestone__state'), 'state word buried inside the hidden rail').toBeNull();
		expect(errorNode().querySelector('.hub-milestone__body .hub-milestone__state')).not.toBeNull();
	});

	it('clips the word instead of hiding it, so it stays in the accessibility tree', () => {
		const word = stateWordOf(errorNode())!;
		const styles = getComputedStyle(word);

		expect(styles.display, 'display:none takes the name away with the pixels').not.toBe('none');
		expect(styles.visibility).not.toBe('hidden');
		expect(word.hasAttribute('aria-hidden')).toBe(false);
	});

	it('marks the node itself with something that is not its colour', () => {
		expect(errorNode().querySelector('.hub-milestone__marker'), 'non-colour mark on the error node').not.toBeNull();

		for (const other of milestones().slice(0, 3)) {
			expect(other.querySelector('.hub-milestone__marker'), 'mark leaking onto a healthy node').toBeNull();
		}
	});

	it('reflects the state as a data attribute, the way the rest of the family does', () => {
		expect(milestones().map((item) => item.getAttribute('data-state'))).toEqual(['complete', 'active', 'pending', 'error']);
	});

	it('names complete and pending too, and leaves active to aria-current', () => {
		expect(stateWordOf(milestones()[0])?.textContent?.trim()).toBe('Completed');
		expect(stateWordOf(milestones()[2])?.textContent?.trim()).toBe('Pending');
		expect(stateWordOf(milestones()[1]), 'active would be announced twice').toBeNull();
		expect(milestones()[1].getAttribute('aria-current')).toBe('step');
	});

	it('drops the mark and the word when the state stops being an error', () => {
		fixture.componentInstance.lastState.set('complete');
		fixture.detectChanges();

		expect(errorNode().querySelector('.hub-milestone__marker')).toBeNull();
		expect(stateWordOf(errorNode())?.textContent?.trim()).toBe('Completed');
	});

	it('takes the wording from the node, which is how it gets translated', () => {
		fixture.componentInstance.lastLabel.set('Fallido');
		fixture.detectChanges();

		expect(stateWordOf(errorNode())?.textContent?.trim()).toBe('Fallido');
	});

	it('lets a node silence its own announcement with an empty label', () => {
		fixture.componentInstance.lastLabel.set('');
		fixture.detectChanges();

		expect(stateWordOf(errorNode())).toBeNull();
	});
});

describe('the wording is translatable for the whole application', () => {
	@Component({
		standalone: true,
		imports: [HubMilestonesComponent, HubMilestoneComponent],
		template: `
			<hub-milestones>
				<hub-milestone state="error">Invoiced</hub-milestone>
				<hub-milestone state="pending">Paid</hub-milestone>
			</hub-milestones>
		`
	})
	class ConfiguredHost {}

	it('reads provideHubMilestones({ stateLabels }) before the built-in wording', () => {
		TestBed.configureTestingModule({
			imports: [ConfiguredHost],
			providers: [provideHubMilestones({ stateLabels: { error: 'Error de facturación', pending: '' } })]
		});
		const fixture = TestBed.createComponent(ConfiguredHost);
		fixture.detectChanges();

		const host = fixture.nativeElement as HTMLElement;
		const words = Array.from(host.querySelectorAll('.hub-milestone__state')).map((node) => node.textContent?.trim());

		expect(words).toEqual(['Error de facturación']);
	});
});
