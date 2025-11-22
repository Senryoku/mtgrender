<template>
	<div
		class="oracle planeswalker-oracle"
		ref="oracleEl"
		@dblclick="onEditOracle"
	>
		<div
			class="planeswalker-ability"
			v-for="(ability, idx) in planeswalkerAbilities"
			:key="idx"
			:class="{
				'planeswalker-ability-with-cost': ability.cost !== null,
			}"
		>
			<div
				class="planeswalker-ability-cost"
				v-if="ability.cost !== null"
				:class="{
					'planeswalker-ability-cost-minus': ability.cost < 0,
					'planeswalker-ability-cost-zero': ability.cost === 0,
					'planeswalker-ability-cost-plus': ability.cost > 0,
				}"
			>
				{{ ability.cost > 0 ? "+" : "" }}{{ ability.cost }}
			</div>
			<div
				class="planeswalker-ability-text"
				v-html="ability.html"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * PlaneswalkerLayout Component
 *
 * Displays the Planeswalker oracle text layout with loyalty abilities.
 * Each ability shows:
 * - Loyalty cost badge (+X, 0, or -X)
 * - Ability text with mana symbols parsed
 *
 * Used for Planeswalker cards with loyalty abilities like:
 * "Jace, the Mind Sculptor", "Liliana of the Veil", etc.
 */
export default defineComponent({
	name: "PlaneswalkerLayout",
	props: {
		/**
		 * Array of planeswalker abilities, each with:
		 * - cost: loyalty cost (positive, zero, or negative number, or null for passive)
		 * - html: parsed ability text
		 */
		planeswalkerAbilities: {
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

		return {
			oracleEl,
			onEditOracle,
		};
	},
});
</script>

<style scoped>
/* Planeswalker layout styles will be inherited from parent MTGCard component */
</style>
