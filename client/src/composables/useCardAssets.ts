import { computed, type ComputedRef, type Ref } from 'vue';

export interface CardAssetsResult {
	background: ComputedRef<string>;
	frame: ComputedRef<string>;
	boxes: ComputedRef<string>;
	mid_boxes: ComputedRef<string>;
	legendary_crown: ComputedRef<string>;
	pt_box: ComputedRef<string>;
	saga_text_box: ComputedRef<string>;
	mdfc_icon: ComputedRef<string>;
	mdfc_hint: ComputedRef<string>;
	transform_icon: ComputedRef<string>;
	set_icon_uri: ComputedRef<string | null>;
	illustration: ComputedRef<string>;
	illustration_scale: ComputedRef<number>;
	illustration_position: ComputedRef<{ x: string; y: string }>;
	extended_art: ComputedRef<boolean>;
	top_line_color: ComputedRef<string>;
	mid_line_color: ComputedRef<string>;
	pt_box_color: ComputedRef<string>;
	mdfc_hint_color: ComputedRef<string>;
}

export function useCardAssets(
	card: ComputedRef<any>,
	card_face: ComputedRef<any>,
	back_face: ComputedRef<any>,
	currentFace: Ref<number>,
	colors: ComputedRef<string>,
	boxes_colors: ComputedRef<string>,
	is_adventure: ComputedRef<boolean>,
	is_planeswalker: ComputedRef<boolean>,
	is_large_planeswalker: ComputedRef<boolean>,
	is_saga: ComputedRef<boolean>,
	is_class: ComputedRef<boolean>,
	is_vehicle: ComputedRef<boolean>,
	is_mdfc: ComputedRef<boolean>,
	is_transform: ComputedRef<boolean>,
	compute_colors: (face: any) => string
): CardAssetsResult {
	const extended_art = computed(() => {
		return ['extended', 'full', 'full-footer'].includes(
			(is_adventure.value ? card.value : card_face.value)?.art_variant
		);
	});

	const background = computed(() => {
		const folder = is_planeswalker.value
			? is_large_planeswalker.value
				? 'planeswalker_large_bg'
				: 'planeswalker_bg'
			: is_saga.value
			? 'saga_bg'
			: is_class.value
			? 'saga_bg'
			: card.value?.frame_effects?.includes('compasslanddfc') &&
			  currentFace.value === 1
			? 'ixalan_bg'
			: 'bg';
		return `url(${
				`/assets/img/${folder}/${
					is_vehicle.value ? 'Vehicle' : boxes_colors.value
				}.webp`
		})`;
	});

	const frame = computed(() => {
		let folder = is_adventure.value
			? 'adventure_frames'
			: is_saga.value
			? 'saga_frames'
			: is_class.value
			? 'class_frames'
			: is_planeswalker.value
			? is_large_planeswalker.value
				? 'planeswalker_large_frames'
				: 'planeswalker_frames'
			: is_mdfc.value
			? 'mdfc_frames'
			: is_transform.value
			? currentFace.value === 0
				? 'transform_frames'
				: 'transform_back_frames'
			: 'frames';
		if (extended_art.value && !is_saga.value && !is_class.value)
			folder = 'extended_' + folder;
		const frameColors =
			colors.value === 'Artifact' && card_face.value?.colors?.length === 1
				? card_face.value.colors[0]
				: colors.value;
		return `url(/assets/img/${folder}/${frameColors}.webp)`;
	});

	const boxes = computed(() => {
		const folder = is_planeswalker.value
			? 'planeswalker_boxes'
			: is_mdfc.value || is_transform.value
			? currentFace.value === 0
				? 'mdfc_boxes'
				: 'mdfc_back_boxes'
			: extended_art.value && !is_class.value
			? 'extended_boxes'
			: 'boxes';
		return `url(/assets/img/${folder}/${boxes_colors.value}.webp)`;
	});

	const mid_boxes = computed(() => {
		return extended_art.value && !is_planeswalker.value && !is_class.value
			? `url(/assets/img/extended_boxes/${boxes_colors.value}.webp)`
			: boxes.value;
	});

	const legendary_crown = computed(() => {
		const crownColors =
			colors.value === 'Artifact' && card_face.value?.colors?.length === 1
				? card_face.value.colors[0]
				: colors.value;
		const folder = extended_art.value
			? 'extended_legendary_crowns'
			: 'legendary_crowns';
		return `url(/assets/img/${folder}/${crownColors}.webp)`;
	});

	const pt_box = computed(() => {
		return `url(${
				`/assets/img/${
					(is_mdfc.value || is_transform.value) && currentFace.value === 1
						? 'transform_back_pt_boxes'
						: 'pt_boxes'
				}/${is_vehicle.value ? 'Vehicle' : boxes_colors.value}.webp`
		})`;
	});

	const saga_text_box = computed(() => {
		return `url(/assets/img/saga_textboxes/${boxes_colors.value}.webp)`;
	});

	const mdfc_icon = computed(() => {
		return `url(/assets/img/mdfc${currentFace.value === 0 ? '' : '_back'}_icons/${
			boxes_colors.value === 'Land' ? colors.value : boxes_colors.value
		}.webp)`;
	});

	const mdfc_hint = computed(() => {
		let hintColors = compute_colors(back_face.value);
		if (hintColors.length > 1 && hintColors.length < 5) hintColors = 'Gold';
		return `url(/assets/img/mdfc${
			currentFace.value === 0 ? '' : '_back'
		}_hints/${hintColors}.webp)`;
	});

	const transform_icon = computed(() => {
		return `url(/assets/img/transform${
			currentFace.value === 0 ? '' : '_back'
		}_icons/${card.value?.frame_effects?.[0] ?? 'sunmoondfc'}.webp)`;
	});

	const set_icon_uri = computed(() => {
		if (!card.value?.set) return null;
		let class_names = `ss ss-border ss-${card.value.set} ss-`;
		switch (card.value.rarity) {
			case 'mythic':
				class_names += 'mythic';
				break;
			case 'special':
				class_names += 'timeshifted';
				break;
			case 'rare':
				class_names += 'rare';
				break;
			case 'uncommon':
				class_names += 'uncommon';
				break;
			case 'common':
			default:
				class_names += 'common';
				break;
		}
		return class_names;
	});

	const illustration = computed(() => {
		return `url(${
			(is_adventure.value ? card.value : card_face.value)?.image_uris
				?.art_crop
		})`;
	});

	const illustration_scale = computed(() => {
		return (
			(is_adventure.value ? card.value : card_face.value)
				?.illustration_scale ?? 1
		);
	});

	const illustration_position = computed(() => {
		const cardData = is_adventure.value ? card.value : card_face.value;
		return cardData?.illustration_position
			? {
					x: cardData?.illustration_position.x + 'mm',
					y: cardData?.illustration_position.y + 'mm',
			  }
			: { x: '0mm', y: '0mm' };
	});

	const top_line_color = computed(() => {
		return is_mdfc.value
			? currentFace.value === 0
				? 'black'
				: 'white'
			: is_transform.value &&
			  currentFace.value === 1 &&
			  !is_planeswalker.value
			? 'white'
			: 'black';
	});

	const mid_line_color = computed(() => {
		return (extended_art.value &&
			!is_class.value &&
			!is_planeswalker.value &&
			(!is_transform.value || currentFace.value === 0)) ||
			((is_transform.value || is_mdfc.value) &&
				currentFace.value === 1 &&
				!is_planeswalker.value)
			? 'white'
			: 'black';
	});

	const pt_box_color = computed(() => {
		return is_vehicle.value ||
			(is_transform.value && currentFace.value === 1)
			? 'white'
			: 'black';
	});

	const mdfc_hint_color = computed(() => {
		return currentFace.value === 0 ? 'white' : 'black';
	});

	return {
		background,
		frame,
		boxes,
		mid_boxes,
		legendary_crown,
		pt_box,
		saga_text_box,
		mdfc_icon,
		mdfc_hint,
		transform_icon,
		set_icon_uri,
		illustration,
		illustration_scale,
		illustration_position,
		extended_art,
		top_line_color,
		mid_line_color,
		pt_box_color,
		mdfc_hint_color,
	};
}
