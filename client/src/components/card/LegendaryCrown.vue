<template>
	<div class="legendary-crown" v-show="visible"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

/**
 * LegendaryCrown Component
 *
 * Displays the decorative crown at the top of legendary cards.
 * The crown appears as a visual indicator for legendary permanents.
 */
export default defineComponent({
	name: "LegendaryCrown",
	props: {
		/**
		 * Whether to show the legendary crown
		 */
		visible: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style scoped>
/* Legendary crown styles will be inherited from parent MTGCard component */
</style>
