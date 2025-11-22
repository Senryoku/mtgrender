<template>
	<div
		class="oracle saga-oracle"
		@dblclick="onEditOracle"
		@mousedown.prevent=""
	>
		<div
			class="saga-reminder"
			v-if="sagaReminder"
			v-html="sagaReminder"
			ref="sagaReminderEl"
		></div>
		<div class="saga-frame"></div>
		<div class="saga-steps" ref="oracleEl">
			<div
				class="saga-step"
				v-for="(step, idx) in sagaSteps"
				:key="idx"
			>
				<div class="saga-step-number">
					<img v-for="s in step.steps" :key="s" :src="s" />
				</div>
				<div v-html="step.html"></div>
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

/**
 * SagaLayout Component
 *
 * Displays the Saga enchantment layout with:
 * - Optional reminder text about how Sagas work
 * - Saga frame decoration
 * - Numbered chapters (I, II, III, IV) with corresponding abilities
 *
 * Used for Saga enchantments like "Elspeth Conquers Death", "The Akroan War", etc.
 */
export default defineComponent({
	name: "SagaLayout",
	props: {
		/**
		 * Saga reminder text (HTML string)
		 */
		sagaReminder: {
			type: String,
			default: "",
		},
		/**
		 * Array of saga steps, each with:
		 * - steps: array of chapter icon URIs (e.g., I, II, III)
		 * - html: parsed oracle text for that chapter
		 */
		sagaSteps: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const oracleEl = ref(null);
		const sagaReminderEl = ref(null);

		const onEditOracle = () => {
			emit("edit-property", "oracle_text");
		};

		return {
			oracleEl,
			sagaReminderEl,
			onEditOracle,
		};
	},
});
</script>



<style>

	/************** Saga *************/

	.saga .inner-background {
		top: 2.5mm;
	}

	.saga .inner-frame {
		top: 3.66mm;
		margin: 0;
		width: 58.5mm;
		margin-left: -1mm;
	}


	.saga .saga-frame {
		position: absolute;
		top: 0;
		left: -2.8mm;
		width: 10mm;
		height: 100%;
		background-size: 58.5mm;
		background-position: 0 -6.3mm;
		background-repeat: no-repeat;
		pointer-events: none;
	}

	.saga .mid-line,
	.saga .top-line {
		top: 4.2mm;
		left: 0.1mm;
	}

	.saga .mid-line {
		top: 75.2mm;
	}

	.saga .illustration {
		width: 27.3mm;
		height: 64.3mm;
		top: 10mm;
		left: 31.8mm;
		outline-offset: 0;
	}

	.saga-oracle {
		position: absolute;
		left: 4.9mm;
		top: 9.95mm;
		width: 26.6mm;
		height: 64.3mm;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.saga-reminder {
		height: 13.3mm;
		font-size: 7.3pt;
		line-height: 7.3pt;
		padding: 0.5mm 0.7mm 2.4mm 0.7mm;
		display: flex;
		align-items: center;
	}

	.saga-steps {
		display: flex;
		align-items: stretch;
		justify-content: stretch;
		flex-direction: column;
		gap: 0.8mm;
		padding-left: 2.15mm;
		height: 47.5mm;
	}

	.saga-step {
		position: relative;
		display: flex;
		justify-content: center;
		flex-direction: column;
		box-shadow: 0 -0.35mm 0.5mm #00000020;
		padding: 1.35mm;
		flex-grow: 1;
		line-height: 1em;
	}

	.saga-step-number {
		position: absolute;
		width: 5mm;
		top: 50%;
		transform: translateY(-50%);
		left: -4.65mm;
		z-index: 4; 
	}

	.saga-step-number img {
		width: 5mm;
	}

	.class-reminder {
		height: 7mm;
		font-size: 6.3pt;
		line-height: 6.3pt;
		padding: 0.5mm 0.7mm 0.5mm 0.7mm;
		display: flex;
		align-items: center;
	}

	.class .top-line {
		top: 4.2mm;
	}
	.class .mid-line {
		top: 74.4mm;
	}

	.class .illustration {
		width: 27.3mm;
		height: 64.3mm;
		top: 10mm;
		left: 4.3mm;
		outline-offset: 0;
	}

	.class-oracle {
		position: absolute;
		left: 31.8mm;
		top: 10.1mm;
		width: 26.4mm;
		height: 63.65mm;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.class-steps {
		display: flex;
		align-items: stretch;
		justify-content: stretch;
		flex-direction: column;
		gap: 0.8mm;
		height: 54.3mm;
	}

	.class-step {
		padding: 0.2mm;
	}

	.level-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		height: 3mm;
		padding-left: 1mm;
		padding-right: 1mm;
		background-image: url("/assets/img/class_level_bg.png");
		background-size: cover;
	}


	</style>

<style scoped>
	.saga-step:deep(.ms) {
    width: 0.8em;
    margin: 0 0.07em;
    vertical-align: baseline;
}
</style>
