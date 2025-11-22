<template>
	<div
		class="loyalty"
		v-show="cardFace.loyalty"
		@dblclick="onEditLoyalty"
	>
		{{ cardFace.loyalty }}
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

/**
 * LoyaltyBox Component
 *
 * Displays the starting loyalty counter for planeswalker cards.
 */
export default defineComponent({
	name: "LoyaltyBox",
	props: {
		/**
		 * Card face data containing loyalty value
		 */
		cardFace: {
			type: Object,
			required: true,
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const onEditLoyalty = () => {
			emit("edit-property", "loyalty");
		};

		return {
			onEditLoyalty,
		};
	},
});
</script>

<style scoped>
/* Loyalty box styles will be inherited from parent MTGCard component */
</style>
