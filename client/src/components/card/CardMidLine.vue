<template>
	<div class="mid-line">
		<img
			class="color-indicator"
			v-if="colorIndicatorUri"
			:src="colorIndicatorUri"
		/>
		<div
			class="type-line"
			@dblclick="onEditTypeLine"
			@mousedown.prevent=""
			ref="typeLineEl"
		>
			{{ cardFace.type_line }}
		</div>
		<div class="set-icon-container" v-if="setIconUri">
			<i :class="setIconUri"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * CardMidLine Component
 *
 * Displays the middle line of an MTG card containing:
 * - Color indicator (for cards without mana cost)
 * - Type line (card type and subtypes)
 * - Set icon
 */
export default defineComponent({
	name: "CardMidLine",
	props: {
		/**
		 * Card face data object containing type_line and color_indicator
		 */
		cardFace: {
			type: Object,
			required: true,
		},
		/**
		 * URI for the set icon SVG
		 */
		setIconUri: {
			type: String,
			default: "",
		},
		/**
		 * URI for the color indicator image
		 */
		colorIndicatorUri: {
			type: String,
			default: "",
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const typeLineEl = ref(null);

		const onEditTypeLine = () => {
			emit("edit-property", "type_line");
		};

		return {
			typeLineEl,
			onEditTypeLine,
		};
	},
});
</script>

<style scoped>
/* Mid line styles will be inherited from parent MTGCard component */
</style>
