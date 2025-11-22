<template>
	<div
		class="pt-box"
		v-show="shouldShow"
	>
		<span @dblclick="onEditPower" @mousedown.prevent="">{{
			cardFace.power
		}}</span
		>/<span @dblclick="onEditToughness" @mousedown.prevent=""
			>{{ cardFace.toughness }}
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

/**
 * PTBox Component
 *
 * Displays the Power/Toughness box for creature cards.
 * Shows as "X/Y" format where X is power and Y is toughness.
 */
export default defineComponent({
	name: "PTBox",
	props: {
		/**
		 * Card face data containing power and toughness
		 */
		cardFace: {
			type: Object,
			required: true,
		},
		/**
		 * Hide P/T box for level-up cards
		 */
		isLevelup: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const shouldShow = computed(() => {
			return (
				(props.cardFace.power || props.cardFace.toughness) &&
				!props.isLevelup
			);
		});

		const onEditPower = () => {
			emit("edit-property", "power");
		};

		const onEditToughness = () => {
			emit("edit-property", "toughness");
		};

		return {
			shouldShow,
			onEditPower,
			onEditToughness,
		};
	},
});
</script>

<style scoped>
/* P/T box styles will be inherited from parent MTGCard component */
</style>
