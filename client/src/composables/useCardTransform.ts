import { computed, type ComputedRef, type Ref } from 'vue';
import mana_symbols from '../symbols';

const mana_regex = /{([^}]+)}/g;

export interface CardTransformResult {
	card_face: ComputedRef<any>;
	back_face: ComputedRef<any>;
	mana_cost: ComputedRef<string[]>;
	adventure_mana_cost: ComputedRef<string[]>;
	mdfc_back_mana_cost: ComputedRef<string[]>;
	mdfc_hint_text: ComputedRef<string>;
	oracle_lines: ComputedRef<string[]>;
	adventure_oracle_lines: ComputedRef<string[]>;
	copyright: ComputedRef<string>;
	color_indicator: ComputedRef<string | null>;
}

export function useCardTransform(
	card: ComputedRef<any>,
	currentFace: Ref<number>,
	is_adventure: ComputedRef<boolean>,
	parse_oracle: (str: string) => string
): CardTransformResult {
	const card_face = computed(() => {
		if (card.value?.card_faces)
			return card.value.card_faces[is_adventure.value ? 0 : currentFace.value];
		return card.value;
	});

	const back_face = computed(() => {
		if (card.value?.card_faces)
			return card.value.card_faces[(currentFace.value + 1) % 2];
		return card.value;
	});

	const mana_cost = computed(() => {
		if (!card_face.value?.mana_cost) return [];
		return [...card_face.value.mana_cost.matchAll(mana_regex)].map((m) =>
			['archive', 'japanese-archive'].includes(card_face.value?.art_variant)
				? `/assets/img/archives_symbols/${m[1]}.svg`
				: mana_symbols[m[0]].svg_uri
		);
	});

	const adventure_mana_cost = computed(() => {
		if (!card.value?.card_faces?.[1]?.mana_cost) return [];
		return [...card.value.card_faces[1].mana_cost.matchAll(mana_regex)].map(
			(m) => mana_symbols[m[0]].svg_uri
		);
	});

	const mdfc_back_mana_cost = computed(() => {
		if (!card.value?.card_faces?.[(currentFace.value + 1) % 2]?.mana_cost) return [];
		return [
			...card.value.card_faces[(currentFace.value + 1) % 2].mana_cost.matchAll(
				mana_regex
			),
		].map((m) => mana_symbols[m[0]].svg_uri);
	});

	const mdfc_hint_text = computed(() => {
		return (
			card_face.value?.mdfc_hint ??
			back_face.value?.type_line?.substr(back_face.value.type_line.indexOf('—') + 1).trim()
		);
	});

	const oracle_lines = computed(() => {
		if (!card_face.value?.oracle_text) return [];
		return card_face.value.oracle_text.split('\n').map(parse_oracle);
	});

	const adventure_oracle_lines = computed(() => {
		if (!card.value?.card_faces?.[1]?.oracle_text) return [];
		return card.value.card_faces[1].oracle_text.split('\n').map(parse_oracle);
	});

	const copyright = computed(() => {
		return (
			card.value?.copyright ??
			`™ & © ${new Date().getFullYear()} Wizards of the Coast`
		);
	});

	const color_indicator = computed(() => {
		if (!card_face.value?.color_indicator || card_face.value.color_indicator.length === 0)
			return null;
		return new URL(
			`/assets/img/color_indicators/${[...card_face.value.color_indicator]
				.sort((lhs, rhs) => 'WUBRG'.indexOf(lhs) - 'WUBRG'.indexOf(rhs))
				.join('')}.webp`,
			import.meta.url
		).href;
	});

	return {
		card_face,
		back_face,
		mana_cost,
		adventure_mana_cost,
		mdfc_back_mana_cost,
		mdfc_hint_text,
		oracle_lines,
		adventure_oracle_lines,
		copyright,
		color_indicator,
	};
}
