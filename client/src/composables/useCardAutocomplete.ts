import { ref } from 'vue';
import type { AutocompleteStatus } from '../types/card';
import { scryfallService } from '../services/scryfallService';

export function useCardAutocomplete() {
	const searchCardName = ref('');
	const autocompleteStatus = ref<AutocompleteStatus>(null);

	const autocompleteCardName = async (query: string) => {
		if (!query || query.trim() === '') {
			autocompleteStatus.value = null;
			return;
		}

		autocompleteStatus.value = 'updating';

		try {
			const results = await scryfallService.autocomplete(query);
			autocompleteStatus.value = results.length > 0 ? results : null;
		} catch (error) {
			autocompleteStatus.value = 'error';
		}
	};

	const closeAutocomplete = () => {
		autocompleteStatus.value = null;
	};

	const selectCard = (cardName: string) => {
		searchCardName.value = cardName;
		closeAutocomplete();
		return cardName;
	};

	const handleAutocompleteKeydown = (event: KeyboardEvent) => {
		const el = document.querySelector('.card-name-autocomplete');
		if (!el) return;

		switch (event.key) {
			case 'ArrowDown':
				el.querySelector('li')?.focus();
				break;
		}
	};

	const handleAutocompleteCycle = (event: KeyboardEvent) => {
		const target = event.target as HTMLElement;

		switch (event.key) {
			case 'Enter':
				target.click();
				break;
			case 'ArrowUp':
				if (target.previousElementSibling) {
					(target.previousElementSibling as HTMLElement).focus();
				} else {
					(target.parentNode?.lastElementChild as HTMLElement)?.focus();
				}
				event.stopPropagation();
				break;
			case 'ArrowDown':
				if (target.nextElementSibling) {
					(target.nextElementSibling as HTMLElement).focus();
				} else {
					(target.parentNode?.firstElementChild as HTMLElement)?.focus();
				}
				event.stopPropagation();
				break;
			default:
				target.blur();
				document.querySelector<HTMLInputElement>('#card-seach-input')?.focus();
				break;
		}
	};

	return {
		searchCardName,
		autocompleteStatus,
		autocompleteCardName,
		closeAutocomplete,
		selectCard,
		handleAutocompleteKeydown,
		handleAutocompleteCycle,
	};
}
