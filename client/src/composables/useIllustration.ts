import { ref, computed, type ComputedRef, type Ref } from 'vue';

export interface IllustrationResult {
	dragging_illustration: Ref<{ x: number; y: number } | null>;
	mmperpixel: ComputedRef<number>;
	scale_illustration: (event: WheelEvent) => void;
	start_drag_illustration: (event: MouseEvent) => void;
	end_drag_illustration: (event?: MouseEvent) => void;
	cancel_drag_illustration: (event: MouseEvent) => void;
	drag_illustration: (event: MouseEvent) => void;
}

export function useIllustration(
	card: ComputedRef<any>,
	card_face: ComputedRef<any>,
	currentFace: Ref<number>,
	is_adventure: ComputedRef<boolean>,
	scale: ComputedRef<number>,
	cardEl: Ref<HTMLElement | null>,
	emit: (event: 'edit', ...args: any[]) => void
): IllustrationResult {
	const dragging_illustration = ref<{ x: number; y: number } | null>(null);

	const mmperpixel = computed(() => {
		return 63.5 / (cardEl.value?.clientWidth ?? 1);
	});

	const scale_illustration = (event: WheelEvent) => {
		let s = 1;
		const cardData = is_adventure.value ? card.value : card_face.value;
		if (cardData.illustration_scale) s = cardData.illustration_scale;
		s += event.deltaY > 0 ? -0.1 : 0.1;
		s = Math.min(Math.max(1, s), 50);
		emit(
			'edit',
			card.value.card_faces && !is_adventure.value
				? ['card_faces', currentFace.value, 'illustration_scale']
				: 'illustration_scale',
			s
		);
	};

	const start_drag_illustration = (event: MouseEvent) => {
		const cardData = is_adventure.value ? card.value : card_face.value;
		if (!cardData.illustration_position)
			emit(
				'edit',
				card.value.card_faces && !is_adventure.value
					? ['card_faces', currentFace.value, 'illustration_position']
					: 'illustration_position',
				{ x: 0, y: 0 }
			);
		dragging_illustration.value = {
			x: cardData.illustration_position?.x ?? 0,
			y: cardData.illustration_position?.y ?? 0,
		};
	};

	const cancel_drag_illustration = (event: MouseEvent) => {
		if (dragging_illustration.value) {
			emit(
				'edit',
				card.value.card_faces && !is_adventure.value
					? ['card_faces', currentFace.value, 'illustration_position']
					: 'illustration_position',
				dragging_illustration.value
			);
			end_drag_illustration();
		}
	};

	const end_drag_illustration = (event?: MouseEvent) => {
		dragging_illustration.value = null;
	};

	const drag_illustration = (event: MouseEvent) => {
		const cardData = is_adventure.value ? card.value : card_face.value;
		if (dragging_illustration.value) {
			emit(
				'edit',
				card.value.card_faces && !is_adventure.value
					? ['card_faces', currentFace.value, 'illustration_position']
					: 'illustration_position',
				{
					x:
						cardData.illustration_position.x +
						(mmperpixel.value * event.movementX) / scale.value,
					y:
						cardData.illustration_position.y +
						(mmperpixel.value * event.movementY) / scale.value,
				}
			);
		}
	};

	return {
		dragging_illustration,
		mmperpixel,
		scale_illustration,
		start_drag_illustration,
		end_drag_illustration,
		cancel_drag_illustration,
		drag_illustration,
	};
}
