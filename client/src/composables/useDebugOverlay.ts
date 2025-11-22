import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { MTGCard, CardFace } from '../types/card';

/**
 * Composable for debug overlay functionality
 *
 * Provides debug tools for development mode including visual overlay
 * and controls for comparing rendered card with original image.
 *
 * @param card - The MTG card ref
 * @param card_face - The current card face ref
 * @param scale - The scale factor ref
 * @returns Debug overlay state and handlers
 *
 * @example
 * ```ts
 * const { isDevelopment, displayDebug, debugOpacity, updateDebugOverlay, debugImageUri } =
 *   useDebugOverlay(card, card_face, scale);
 * ```
 */
export function useDebugOverlay(
	card: Ref<MTGCard>,
	card_face: Ref<CardFace>,
	scale: Ref<number>
) {
	const isDevelopment = import.meta.env.MODE === 'development';
	const displayDebug = ref(false);
	const debugOpacity = ref(0);

	const debugImageUri = computed(() => {
		return card.value?.image_uris?.png || card_face.value?.image_uris?.png;
	});

	const updateDebugOverlay = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const firstChild = target.firstElementChild as HTMLElement;
		const parent = target.parentElement;

		if (event.type === 'mousemove' && parent && firstChild) {
			const rect = parent.getBoundingClientRect();
			firstChild.style.width = `${(event.clientX - rect.x) / scale.value}px`;
		} else if (firstChild) {
			firstChild.style.width = '';
		}
	};

	return {
		isDevelopment,
		displayDebug,
		debugOpacity,
		debugImageUri,
		updateDebugOverlay,
	};
}
