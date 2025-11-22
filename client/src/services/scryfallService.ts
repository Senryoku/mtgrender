import type { Card } from '../types/card';

export interface ScryfallAutocompleteResponse {
	object: string;
	total_values: number;
	data: string[];
}

export interface ScryfallCardResponse extends Card {
	status?: number;
	details?: string;
}

export const scryfallService = {
	async autocomplete(query: string): Promise<string[]> {
		try {
			const response = await fetch(
				`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`
			);

			if (response.status !== 200) {
				throw new Error('Autocomplete request failed');
			}

			const data: ScryfallAutocompleteResponse = await response.json();
			return data.total_values > 0 ? data.data : [];
		} catch (error) {
			console.error('Scryfall autocomplete error:', error);
			throw error;
		}
	},

	async getCard(name: string): Promise<Card> {
		try {
			const response = await fetch(
				`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
			);

			const data: ScryfallCardResponse = await response.json();

			if (data.status && data.status !== 200) {
				throw new Error(data.details || 'Card not found');
			}

			return data;
		} catch (error) {
			console.error('Scryfall card fetch error:', error);
			throw error;
		}
	},
};
