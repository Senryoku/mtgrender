<template>
	<div class="adventure-layout">
		<!-- Adventure part (spell) -->
		<div class="adventure-part">
			<div class="adventure-top-line">
				<span
					class="adventure-name"
					@dblclick.prevent="onEditAdventureName"
					@mousedown.prevent=""
					>{{ adventureFace.name }}</span
				>
				<div
					class="adventure-mana-cost"
					@dblclick.prevent="onEditAdventureManaCost"
					@mousedown.prevent=""
				>
					<img
						v-for="(uri, idx) in adventureManaCostSymbols"
						class="ms ms-shadow"
						:key="idx"
						:src="uri"
					/>
				</div>
			</div>
			<div class="adventure-type">
				{{ adventureFace.type_line }}
			</div>
			<div class="oracle adventure-oracle" ref="adventureOracleEl">
				<div
					class="oracle-inner"
					v-for="(line, idx) in adventureOracleLines"
					:key="idx"
					v-html="line"
					@dblclick="onEditAdventureOracle"
					@mousedown.prevent=""
				></div>
				<div
					class="oracle-flavor"
					v-if="adventureFace.flavor_text"
					@dblclick="onEditAdventureFlavor"
					@mousedown.prevent=""
				>
					<hr />
					{{ adventureFace.flavor_text }}
				</div>
			</div>
		</div>

		<!-- Main part (creature) -->
		<div class="oracle adventure-main-oracle" ref="oracleEl">
			<div
				class="oracle-inner"
				v-for="(line, idx) in mainOracleLines"
				:key="idx"
				v-html="line"
				@dblclick="onEditMainOracle"
				@mousedown.prevent=""
			></div>
			<div
				class="oracle-flavor"
				v-if="mainFace.flavor_text"
				@dblclick="onEditMainFlavor"
				@mousedown.prevent=""
			>
				<hr />
				{{ mainFace.flavor_text }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * AdventureLayout Component
 *
 * Displays the Adventure card layout with two oracle text sections:
 * - Adventure part (spell) on the left with its own name, mana cost, type, and oracle text
 * - Main part (creature) oracle text below
 *
 * Used for Adventure cards like Brazen Borrower, Bonecrusher Giant, etc.
 */
export default defineComponent({
	name: "AdventureLayout",
	props: {
		/**
		 * Main card face (creature part)
		 */
		mainFace: {
			type: Object,
			required: true,
		},
		/**
		 * Adventure card face (spell part)
		 */
		adventureFace: {
			type: Object,
			required: true,
		},
		/**
		 * Parsed oracle text lines for main part
		 */
		mainOracleLines: {
			type: Array,
			default: () => [],
		},
		/**
		 * Parsed oracle text lines for adventure part
		 */
		adventureOracleLines: {
			type: Array,
			default: () => [],
		},
		/**
		 * Adventure mana cost symbols (array of URIs)
		 */
		adventureManaCostSymbols: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const oracleEl = ref(null);
		const adventureOracleEl = ref(null);

		const onEditAdventureName = () => {
			emit("edit-property", ["card_faces", 1, "name"]);
		};

		const onEditAdventureManaCost = () => {
			emit("edit-property", ["card_faces", 1, "mana_cost"]);
		};

		const onEditAdventureOracle = () => {
			emit("edit-property", ["card_faces", 1, "oracle_text"]);
		};

		const onEditAdventureFlavor = () => {
			emit("edit-property", ["card_faces", 1, "flavor_text"]);
		};

		const onEditMainOracle = () => {
			emit("edit-property", ["card_faces", 0, "oracle_text"]);
		};

		const onEditMainFlavor = () => {
			emit("edit-property", ["card_faces", 0, "flavor_text"]);
		};

		return {
			oracleEl,
			adventureOracleEl,
			onEditAdventureName,
			onEditAdventureManaCost,
			onEditAdventureOracle,
			onEditAdventureFlavor,
			onEditMainOracle,
			onEditMainFlavor,
		};
	},
});
</script>

<style scoped>
/* Adventure layout styles will be inherited from parent MTGCard component */
</style>
