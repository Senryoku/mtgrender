import { nextTick, type Ref } from 'vue';

function check_overflow(el: HTMLElement): boolean {
	const curOverflow = el.style.overflow;

	if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

	// FIXME: The + 1 is there for some weird rounding error (I guess, I don't actually know)
	//        Without it, planeswalker oracle text is always overflowing by a single pixel horizontally,
	//        shrinking the text to oblivion.
	const isOverflowing =
		el.clientWidth + 1 < el.scrollWidth ||
		el.clientHeight + 1 < el.scrollHeight;

	el.style.overflow = curOverflow;

	return isOverflowing;
}

export interface TextFittingResult {
	fit_font_size: (el: HTMLElement, initial_size?: number) => void;
	fit_name: () => void;
	fit_type_line: () => void;
	fit_oracle_text: () => void;
	fit: () => void;
}

export function useTextFitting(
	topLineRef: Ref<any>,
	midLineRef: Ref<any>,
	oracle_el: Ref<any>
): TextFittingResult {
	const fit_font_size = (el: HTMLElement, initial_size = 8) => {
		el.classList.add('fitting');
		let curr_font_size = initial_size;
		el.style.fontSize = curr_font_size + 'pt';
		while (check_overflow(el) && curr_font_size > 3) {
			curr_font_size *= 0.9;
			el.style.fontSize = curr_font_size + 'pt';
		}
		el.classList.remove('fitting');
	};

	const fit_name = () => {
		if (!topLineRef.value?.nameEl) return;
		nextTick(() => {
			const initial_font_size = 9.454;
			let curr_letter_spacing = 0.034;
			topLineRef.value.nameEl.style.fontSize = initial_font_size + 'pt';
			topLineRef.value.nameEl.style.letterSpacing = curr_letter_spacing + 'mm';
			while (
				check_overflow(topLineRef.value.nameEl) &&
				curr_letter_spacing > -0.09
			) {
				curr_letter_spacing -= 0.001;
				topLineRef.value.nameEl.style.letterSpacing =
					curr_letter_spacing + 'mm';
			}
			if (check_overflow(topLineRef.value.nameEl))
				fit_font_size(topLineRef.value.nameEl, initial_font_size);
		});
	};

	const fit_type_line = () => {
		if (!midLineRef.value?.typeLineEl) return;
		nextTick(() => {
			fit_font_size(midLineRef.value.typeLineEl);
		});
	};

	const fit_oracle_text = () => {
		if (!oracle_el.value) return;
		nextTick(() => {
			// For adventure layout, oracle_el is the AdventureLayout component
			if (oracle_el.value.adventureOracleEl) {
				fit_font_size(oracle_el.value.oracleEl);
				fit_font_size(oracle_el.value.adventureOracleEl);
			}
			// For saga layout, oracle_el is the SagaLayout component
			else if (oracle_el.value.sagaReminderEl) {
				fit_font_size(oracle_el.value.oracleEl);
				fit_font_size(oracle_el.value.sagaReminderEl, 7.3);
			}
			// For class layout, oracle_el is the ClassLayout component
			else if (oracle_el.value.classReminderEl) {
				fit_font_size(oracle_el.value.oracleEl);
			}
			// For other layouts (normal, planeswalker), oracle_el exposes oracleEl
			else if (oracle_el.value.oracleEl) {
				fit_font_size(oracle_el.value.oracleEl);
			}
			// For levelup layout (not refactored), oracle_el is the DOM element
			else {
				fit_font_size(oracle_el.value);
			}
		});
	};

	const fit = () => {
		fit_name();
		fit_type_line();
		fit_oracle_text();
	};

	return {
		fit_font_size,
		fit_name,
		fit_type_line,
		fit_oracle_text,
		fit,
	};
}
