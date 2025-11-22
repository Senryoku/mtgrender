import { computed, type ComputedRef, type Ref } from 'vue';
import type { MTGCard, CardFace, FrameColors as FrameColorsType } from '../types/card';

const FrameColors = {
	W: '#f9f4f0',
	U: '#0070b3',
	B: '#37302d',
	R: '#f20106',
	G: '#00713d',
	Gold: '#f5d15e',
	Colorless: '#e7e8ea',
};

const ArchiveColors = {
	W: '#878167',
	U: '#1c477b',
	B: '#161417',
	R: '#69201a',
	G: '#2d4429',
	Gold: '#927c43',
};

const ArchiveFrameColors = {
	W: { primary: '#9d8793', lighter: '#f0e8e5', darker: '#a89390' },
	U: { primary: '#0e3d95', lighter: '#125faf', darker: '#13316d' },
	B: { primary: '#7d7584', lighter: '#443a39', darker: '#47414b' },
	R: { primary: '#821d23', lighter: '#cd4431', darker: '#462327' },
	G: { primary: '#30513c', lighter: '#366a54', darker: '#1a3429' },
	Gold: { primary: '#ceac4b', lighter: '#ceac4b', darker: '#86622e' },
};

function contains(str: string | undefined, search: string | string[]): boolean {
	if (!str || !search) return false;
	if (Array.isArray(search))
		return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
	return str.toLowerCase().includes(search.toLowerCase());
}

export interface CardColorsResult {
	colors: ComputedRef<string>;
	boxes_colors: ComputedRef<string>;
	frame_colors: ComputedRef<{ left: string; right: string }>;
	archive_frame_colors: ComputedRef<any>;
	japanese_color: ComputedRef<string>;
	japanese_name_color: ComputedRef<string>;
	japanese_type_line_border: ComputedRef<string>;
	japanese_oracle_border: ComputedRef<string>;
	compute_colors: (face: MTGCard | CardFace) => string;
}

export function useCardColors(
	card: Ref<MTGCard>,
	card_face: Ref<CardFace>,
	is_land: ComputedRef<boolean>
): CardColorsResult {
	const compute_colors = (face: MTGCard | CardFace): string => {
		if (
			face?.colors === undefined &&
			face?.color_identity === undefined &&
			face?.mana_cost === undefined
		)
			return 'Colourless';

		let colors =
			face?.colors && face?.colors.length > 0
				? face?.colors
				: face?.color_identity
				? face?.color_identity
				: [...face.mana_cost].filter((c: string) => 'WUBRG'.includes(c));

		if (colors.length === 0 && card.value.color_identity?.length > 0)
			colors = card.value.color_identity;

		const sorted_colors = [...new Set(colors)]
			.sort((l: string, r: string) => {
				return 'WUBRG'.indexOf(l) - 'WUBRG'.indexOf(r);
			})
			.join('');

		return contains(face.type_line, ['Artifact', 'Artefact', 'Artéfact'])
			? 'Artifact'
			: sorted_colors.length === 0
			? 'Colourless'
			: sorted_colors.length > 2
			? 'Gold'
			: sorted_colors;
	};

	const colors = computed(() => compute_colors(card_face.value));

	const boxes_colors = computed(() => {
		return colors.value === 'Vehicle'
			? 'Artifact'
			: is_land.value
			? colors.value.length > 2 && colors.value.length < 5
				? 'Gold'
				: 'Land'
			: colors.value.length > 1 && colors.value.length < 5
			? 'Gold'
			: colors.value;
	});

	const frame_colors = computed(() => {
		if (colors.value.length === 0 || colors.value === 'Artifact')
			return {
				left: FrameColors['Colorless'],
				right: FrameColors['Colorless'],
			};
		if (colors.value.length == 1) {
			return {
				left: FrameColors[colors.value[0]],
				right: FrameColors[colors.value[0]],
			};
		}
		if (colors.value.length == 2) {
			return {
				left: FrameColors[colors.value[0]],
				right: FrameColors[colors.value[1]],
			};
		}
		return {
			left: FrameColors['Gold'],
			right: FrameColors['Gold'],
		};
	});

	const archive_frame_colors = computed(() => {
		const colors = card_face.value?.color_identity ?? card_face.value?.colors;
		if (!colors)
			return Object.assign(
				{
					left: ArchiveFrameColors['Gold'],
					right: ArchiveFrameColors['Gold'],
				},
				ArchiveFrameColors['Gold']
			);
		return Object.assign(
			{
				left: ArchiveFrameColors[colors[0]] ?? ArchiveFrameColors['Gold'],
				right:
					ArchiveFrameColors[colors[colors.length === 1 ? 0 : 1]] ??
					ArchiveFrameColors['Gold'],
			},
			colors.length > 1 || ArchiveFrameColors[colors[0]]
				? ArchiveFrameColors['Gold']
				: ArchiveFrameColors[colors[0]]
		);
	});

	const japanese_color = computed(() => {
		return card_face.value?.colors?.length === 1
			? ArchiveColors[card_face.value.colors[0]]
			: '#927c43';
	});

	const japanese_name_color = computed(() => {
		if (card_face.value?.colors?.length === 2)
			return `linear-gradient(to right, ${
				ArchiveColors[card_face.value.colors[0]]
			}, ${ArchiveColors[card_face.value.colors[1]]})`;
		return japanese_color.value;
	});

	const japanese_type_line_border = computed(() => {
		const c0 =
			card_face.value?.colors?.length === 2
				? ArchiveColors[card_face.value.colors[0]]
				: japanese_color.value;
		const c1 =
			card_face.value?.colors?.length === 2
				? ArchiveColors[card_face.value.colors[1]]
				: c0;
		return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-0.05 -0.05 1.1 1.1'><defs><linearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' stop-color='${c0}' /><stop offset='100%25' stop-color='${c1}' /></linearGradient></defs><path d='M 0.2 0 c -0.1 0.125 -0.2 0.25 -0.2 0.5 c 0 0.25 0.1 0.375 0.2 0.5 l 0.6 0 c 0.1 -0.125 0.2 -0.25 0.2 -0.5 c 0 -0.25 -0.1 -0.375 -0.2 -0.5 Z' stroke='url(%23gradient)' stroke-width='0.1' fill='none'/></svg>")`.replaceAll(
			'#',
			'%23'
		);
	});

	const japanese_oracle_border = computed(() => {
		const c0 =
			card_face.value?.colors?.length === 2
				? ArchiveColors[card_face.value.colors[0]]
				: japanese_color.value;
		const c1 =
			card_face.value?.colors?.length === 2
				? ArchiveColors[card_face.value.colors[1]]
				: c0;
		return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' stop-color='${c0}' /><stop offset='100%25' stop-color='${c1}' /></linearGradient></defs><rect x='0' y='0' width='100' height='100' fill='url(%23gradient)' /></svg>")`.replaceAll(
			'#',
			'%23'
		);
	});

	return {
		colors,
		boxes_colors,
		frame_colors,
		archive_frame_colors,
		japanese_color,
		japanese_name_color,
		japanese_type_line_border,
		japanese_oracle_border,
		compute_colors,
	};
}

// Export standalone utility for use outside the composable
export function computeCardColors(face: MTGCard | CardFace, card?: MTGCard): string {
	const contains = (str: string | undefined, search: string | string[]): boolean => {
		if (!str || !search) return false;
		if (Array.isArray(search))
			return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
		return str.toLowerCase().includes(search.toLowerCase());
	};

	if (
		face?.colors === undefined &&
		face?.color_identity === undefined &&
		face?.mana_cost === undefined
	)
		return 'Colourless';

	let colors =
		face?.colors && face?.colors.length > 0
			? face?.colors
			: face?.color_identity
			? face?.color_identity
			: [...(face.mana_cost || '')].filter((c: string) => 'WUBRG'.includes(c));

	if (colors.length === 0 && card?.color_identity?.length > 0)
		colors = card.color_identity;

	const sorted_colors = [...new Set(colors)]
		.sort((l: string, r: string) => {
			return 'WUBRG'.indexOf(l) - 'WUBRG'.indexOf(r);
		})
		.join('');

	return contains(face.type_line, ['Artifact', 'Artefact', 'Artéfact'])
		? 'Artifact'
		: sorted_colors.length === 0
		? 'Colourless'
		: sorted_colors.length > 2
		? 'Gold'
		: sorted_colors;
}
