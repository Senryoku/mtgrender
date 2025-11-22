<template>
	<div
		class="oracle class-oracle"
		@dblclick="onEditOracle"
		@mousedown.prevent=""
	>
		<div
			class="class-reminder"
			v-if="classReminder"
			v-html="classReminder"
			ref="classReminderEl"
		></div>
		<hr />
		<div class="class-steps" ref="oracleEl">
			<div
				class="class-step"
				v-for="(step, idx) in classSteps"
				:key="idx"
				:class="step.class"
				v-html="step.html"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * ClassLayout Component
 *
 * Displays the Class enchantment layout with:
 * - Optional reminder text about how Classes work
 * - Level-based abilities (Base, Level 2, Level 3)
 * - Each level has its own cost and abilities
 *
 * Used for Class enchantments from Zendikar Rising like
 * "Cleric Class", "Wizard Class", "Rogue Class", etc.
 */
export default defineComponent({
	name: "ClassLayout",
	props: {
		/**
		 * Class reminder text (HTML string)
		 */
		classReminder: {
			type: String,
			default: "",
		},
		/**
		 * Array of class steps/levels, each with:
		 * - class: CSS class name for styling (e.g., "level-header")
		 * - html: parsed oracle text for that level
		 */
		classSteps: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const oracleEl = ref(null);
		const classReminderEl = ref(null);

		const onEditOracle = () => {
			emit("edit-property", "oracle_text");
		};

		return {
			oracleEl,
			classReminderEl,
			onEditOracle,
		};
	},
});
</script>

<style scoped>
/* Class layout styles will be inherited from parent MTGCard component */
</style>
