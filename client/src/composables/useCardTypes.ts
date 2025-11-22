import { computed, type ComputedRef } from 'vue';

function contains(str: string | undefined, search: string | string[]): boolean {
	if (!str || !search) return false;
	if (Array.isArray(search))
		return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
	return str.toLowerCase().includes(search.toLowerCase());
}

export interface CardTypesResult {
	is_land: ComputedRef<boolean>;
	is_legendary: ComputedRef<boolean>;
	has_legendary_crown: ComputedRef<boolean>;
	is_adventure: ComputedRef<boolean>;
	is_planeswalker: ComputedRef<boolean>;
	is_saga: ComputedRef<boolean>;
	is_class: ComputedRef<boolean>;
	is_vehicle: ComputedRef<boolean>;
	is_dualfaced: ComputedRef<boolean>;
	is_mdfc: ComputedRef<boolean>;
	is_transform: ComputedRef<boolean>;
	is_levelup: ComputedRef<boolean>;
}

export function useCardTypes(
	card: ComputedRef<any>,
	card_face: ComputedRef<any>
): CardTypesResult {
	const is_land = computed(() => {
		return card_face.value?.type_line?.startsWith('Land') ||
			card_face.value?.type_line?.startsWith('Terrain')
			? true
			: false;
	});

	const is_legendary = computed(() => {
		return card.value?.frame_effects?.includes('legendary') ||
			card_face.value?.type_line?.startsWith('Legendary') ||
			card_face.value?.type_line?.includes('légendaire')
			? true
			: false;
	});

	const is_adventure = computed(() => {
		return card.value?.layout === 'adventure';
	});

	const is_planeswalker = computed(() => {
		return card_face.value?.type_line?.toLowerCase().includes('planeswalker');
	});

	const has_legendary_crown = computed(() => {
		return (
			is_legendary.value &&
			!is_planeswalker.value &&
			!card.value?.frame_effects?.includes('compasslanddfc')
		);
	});

	const is_saga = computed(() => {
		return (
			card_face.value?.layout === 'saga' ||
			contains(card_face.value?.type_line, 'Saga')
		);
	});

	const is_class = computed(() => {
		return (
			card_face.value?.layout === 'class' ||
			contains(card_face.value?.type_line, 'Class')
		);
	});

	const is_vehicle = computed(() => {
		if (!card.value?.type_line) return false;
		return contains(card_face.value?.type_line, ['Vehicle', 'Véhicule']);
	});

	const is_dualfaced = computed(() => {
		return card.value?.card_faces && !is_adventure.value;
	});

	const is_mdfc = computed(() => {
		return card.value?.layout === 'modal_dfc';
	});

	const is_transform = computed(() => {
		return card.value?.layout === 'transform';
	});

	const is_levelup = computed(() => {
		return (
			card_face.value?.oracle_text?.includes('Level up') ||
			card_face.value?.oracle_text?.includes('Montée de niveau')
		);
	});

	return {
		is_land,
		is_legendary,
		has_legendary_crown,
		is_adventure,
		is_planeswalker,
		is_saga,
		is_class,
		is_vehicle,
		is_dualfaced,
		is_mdfc,
		is_transform,
		is_levelup,
	};
}
