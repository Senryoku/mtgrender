<template>
	<div v-if="isMdfc">
		<div class="mdfc-icon"></div>
		<div class="mdfc-hint">
			<span>{{ hintText }}</span>
			<div class="mana-cost mdfc-hint-mana-cost">
				<img
					v-for="(uri, idx) in backManaCostSymbols"
					class="ms ms-shadow"
					:key="idx"
					:src="uri"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

/**
 * MDFCIndicators Component
 *
 * Displays the Modal Double-Faced Card (MDFC) indicators:
 * - MDFC icon (triangle with arrows)
 * - Hint panel showing the back face type/subtype and mana cost
 *
 * Used for MDFC cards from Zendikar Rising, Kaldheim, etc.
 * like "Valki, God of Lies // Tibalt, Cosmic Impostor"
 */
export default defineComponent({
	name: "MDFCIndicators",
	props: {
		/**
		 * Whether this is an MDFC card
		 */
		isMdfc: {
			type: Boolean,
			default: false,
		},
		/**
		 * Hint text for the back face (usually type line or subtype)
		 */
		hintText: {
			type: String,
			default: "",
		},
		/**
		 * Array of back face mana cost symbol URIs
		 */
		backManaCostSymbols: {
			type: Array,
			default: () => [],
		},
	},
});
</script>

<style scoped>
/* MDFC indicator styles will be inherited from parent MTGCard component */
</style>
