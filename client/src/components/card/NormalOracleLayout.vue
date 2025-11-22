<template>
	<div class="oracle normal-oracle" ref="oracleEl">
		<div
			class="oracle-inner"
			v-for="(line, idx) in oracleLines"
			:key="idx"
			v-html="line"
			@dblclick="onEditOracle"
			@mousedown.prevent=""
		></div>
		<div
			class="oracle-flavor"
			v-if="cardFace.flavor_text"
			@dblclick="onEditFlavor"
			@mousedown.prevent=""
		>
			<hr />
			{{ cardFace.flavor_text }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * NormalOracleLayout Component
 *
 * Displays the standard oracle text layout for regular MTG cards.
 * Shows oracle text lines (with mana symbols parsed as HTML) and
 * optional flavor text separated by a horizontal line.
 */
export default defineComponent({
	name: "NormalOracleLayout",
	props: {
		/**
		 * Card face data containing oracle_text and flavor_text
		 */
		cardFace: {
			type: Object,
			required: true,
		},
		/**
		 * Parsed oracle text lines (array of HTML strings)
		 */
		oracleLines: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const oracleEl = ref(null);

		const onEditOracle = () => {
			emit("edit-property", "oracle_text");
		};

		const onEditFlavor = () => {
			emit("edit-property", "flavor_text");
		};

		return {
			oracleEl,
			onEditOracle,
			onEditFlavor,
		};
	},
});
</script>

<style scoped>
/* Oracle text styles will be inherited from parent MTGCard component */
</style>
