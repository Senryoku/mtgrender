<template>
	<div class="mana" :class="{ archive: archive }">
		<img
			v-for="(uri, idx) in symbols"
			class="ms ms-shadow"
			:key="idx"
			:src="uri"
		/>
	</div>
</template>

<script lang="ts">
const mana_symbols = {};
import mana_symbols_list from "../assets/data/symbology.json";
for (let symbol of mana_symbols_list.data) mana_symbols[symbol.symbol] = symbol;

const mana_regex = /{([^}]+)}/g;

export default {
	props: {
		cost: String,
		archive: Boolean,
	},
	computed: {
		symbols() {
			if (!this.cost) return [];
			return [...this.cost.matchAll(mana_regex)].map((m) =>
				this.archive
					? new URL(
							`../assets/img/archives_symbols/${m[1]}.svg`,
							import.meta.url
					  ).href
					: mana_symbols[m[0]].svg_uri
			);
		},
	},
};
</script>

<style scoped>
.mana {
	display: flex;
	gap: 0.1em;
	justify-content: center;
}

.mana .ms {
	width: 1em;
	border-radius: 50%;
	box-shadow: -0.2mm 0.2mm 0 rgba(0, 0, 0, 0.85);
}

.archive .ms-shadow {
	box-shadow: initial;
}
</style>