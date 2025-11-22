<template>
	<div v-if="isTransform">
		<div class="transform-icon"></div>
		<div
			v-if="showPowerToughness"
			class="transform-hint"
		>
			{{ backFace.power }}/{{ backFace.toughness }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

/**
 * TransformIndicators Component
 *
 * Displays the Transform Double-Faced Card indicators:
 * - Transform icon (moon/sun symbol)
 * - Hint showing back face Power/Toughness (on front face only)
 *
 * Used for Transform cards from Innistrad sets like:
 * "Delver of Secrets // Insectile Aberration"
 * "Huntmaster of the Fells // Ravager of the Fells"
 */
export default defineComponent({
	name: "TransformIndicators",
	props: {
		/**
		 * Whether this is a transform card
		 */
		isTransform: {
			type: Boolean,
			default: false,
		},
		/**
		 * Current face index (0 for front, 1 for back)
		 */
		currentFace: {
			type: Number,
			default: 0,
		},
		/**
		 * Back face data object (contains power/toughness)
		 */
		backFace: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const showPowerToughness = computed(() => {
			return (
				props.currentFace === 0 &&
				props.backFace?.power !== undefined
			);
		});

		return {
			showPowerToughness,
		};
	},
});
</script>

<style scoped>
/* Transform indicator styles will be inherited from parent MTGCard component */
</style>
