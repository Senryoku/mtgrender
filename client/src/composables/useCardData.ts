import { ref, computed } from 'vue';
import type { Card } from '../types/card';
import { BASE_CARD } from '../constants/cardConstants';
import { useLocalStorage } from './useLocalStorage';

export function useCardData() {
	const localStorage = useLocalStorage<Record<string, any>>;

	const card = ref<Card>({ ...BASE_CARD });

	const defaultCardProperties = ref<Record<string, any>>(
		localStorage('defaultCardProperties', {}).getStoredValue()
	);

	const overrideCardProperties = ref<Record<string, any>>(
		localStorage('overrideCardProperties', {}).getStoredValue()
	);

	const finalCard = computed(() => {
		const result = Object.assign({}, defaultCardProperties.value);
		Object.assign(result, card.value);

		// Ensure array properties are always arrays
		if (!result.colors) result.colors = [];
		if (!result.color_indicator) result.color_indicator = [];
		if (!result.keywords) result.keywords = [];

		// Handle card_faces
		if (result.card_faces && Array.isArray(result.card_faces)) {
			result.card_faces = result.card_faces.map((face: any) => ({
				...face,
				colors: face.colors || [],
				color_indicator: face.color_indicator || [],
				keywords: face.keywords || [],
			}));
		}

		for (const key in overrideCardProperties.value) {
			const matches = overrideCardProperties.value[key].matchAll(/{([^}]*)}/g);
			let str = overrideCardProperties.value[key];
			for (const m of matches) {
				let k = m[1];
				if (k === '') k = key;
				str = str.replace(m[0], card.value[k] ?? '');
			}
			result[key] = str;
		}

		return result as Card;
	});

	const newCard = () => {
		card.value = { ...BASE_CARD };
	};

	const loadCard = (cardData: Card) => {
		card.value = cardData;
	};

	const editCard = (key: string | string[], value: any) => {
		if (Array.isArray(key)) {
			let obj: any = card.value;
			for (let idx = 0; idx < key.length - 1; ++idx) {
				obj = obj[key[idx]];
			}
			obj[key[key.length - 1]] = value;
		} else {
			card.value[key] = value;
		}
	};

	const layoutChange = () => {
		if (
			['modal_dfc', 'transform', 'adventure'].includes(card.value.layout || '') &&
			!card.value.card_faces
		) {
			card.value.card_faces = [{ name: '', image_uris: {} }, { name: '', image_uris: {} }];
		}
	};

	const addFrameEffect = (effect: string) => {
		if (!card.value.frame_effects) {
			card.value.frame_effects = [];
		}
		card.value.frame_effects.push(effect);
	};

	const removeFrameEffect = (index: number) => {
		card.value.frame_effects?.splice(index, 1);
	};

	return {
		card,
		defaultCardProperties,
		overrideCardProperties,
		finalCard,
		newCard,
		loadCard,
		editCard,
		layoutChange,
		addFrameEffect,
		removeFrameEffect,
	};
}
