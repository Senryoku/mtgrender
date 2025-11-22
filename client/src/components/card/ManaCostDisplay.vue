<template>
	<span class="mana-cost" v-if="manaCost">
		<template v-for="(symbol, idx) in parsedManaCost" :key="idx">
			<img
				v-if="symbol.type === 'mana'"
				:src="symbol.svg_uri"
				class="ms"
				:alt="symbol.raw"
			/>
			<span v-else>{{ symbol.text }}</span>
		</template>
	</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import mana_symbols from "../../symbols";

/**
 * ManaCostDisplay Component
 *
 * Displays mana cost symbols for MTG cards.
 * Parses mana cost strings (e.g., "{1}{R}{G}") and renders them as SVG icons.
 */
export default defineComponent({
	name: "ManaCostDisplay",
	props: {
		/**
		 * Mana cost string in MTG format (e.g., "{2}{U}{R}")
		 */
		manaCost: {
			type: String,
			default: "",
		},
	},
	computed: {
		parsedManaCost() {
			if (!this.manaCost) return [];

			const mana_regex = /{([^}]+)}/g;
			const result = [];
			let lastIndex = 0;
			let match;

			while ((match = mana_regex.exec(this.manaCost)) !== null) {
				// Add text before the mana symbol if any
				if (match.index > lastIndex) {
					result.push({
						type: "text",
						text: this.manaCost.substring(lastIndex, match.index),
					});
				}

				// Add mana symbol
				const symbol_key = `{${match[1]}}`;
				if (symbol_key in mana_symbols) {
					result.push({
						type: "mana",
						svg_uri: mana_symbols[symbol_key].svg_uri,
						raw: match[1],
					});
				} else {
					// If symbol not found, keep the original text
					result.push({
						type: "text",
						text: match[0],
					});
				}

				lastIndex = match.index + match[0].length;
			}

			// Add remaining text
			if (lastIndex < this.manaCost.length) {
				result.push({
					type: "text",
					text: this.manaCost.substring(lastIndex),
				});
			}

			return result;
		},
	},
});
</script>

<style scoped>
.mana-cost {
	display: inline-flex;
	align-items: center;
	gap: 0.05em;
}

.ms {
	height: 1em;
	width: 1em;
	display: inline-block;
	vertical-align: middle;
}
</style>
