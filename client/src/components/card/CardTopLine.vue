<template>
	<div class="top-line">
		<span
			class="name"
			@dblclick.prevent="onEditName"
			@mousedown.prevent=""
			ref="nameEl"
		>
			{{ displayName }}
		</span>
		<div
			class="mana-cost"
			@dblclick.prevent="onEditManaCost"
			@mousedown.prevent=""
		>
			<img
				v-for="(uri, idx) in manaCostSymbols"
				class="ms ms-shadow"
				:key="idx"
				:src="uri"
			/>
		</div>
		<!-- Original name badge for alternate language cards -->
		<div
			v-if="showOriginalName"
			class="original-name-container"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="none"
				width="54mm"
				viewBox="0.28 0.93 8.43 1.5"
				class="original-name-bg"
			>
				<defs>
					<linearGradient id="gradient">
						<stop
							offset="42%"
							stop-color="#F60"
							class="original-name-left"
						/>
						<stop
							offset="58%"
							stop-color="#FF6"
							class="original-name-right"
						/>
					</linearGradient>
				</defs>
				<path
					d="M 0.2 0.02 C -0.03 0.3 -0.03 0.7 0.2 0.98 H 0.451 C 0.794 1.069 0.856 1.294 0.892 1.44 H 8.138 C 8.195 1.123 8.412 1.035 8.551 0.981 H 8.83 C 9.07 0.7 9.07 0.3 8.83 0.02 Z M 8.326 0.992 C 8.17 1.1 8.101 1.194 8.063 1.344 H 0.971 C 0.936 1.24 0.905 1.128 0.717 0.992 Z"
					class="original-name-bg-path"
				/>
				<path
					d="M 8.326 0.992 C 8.17 1.1 8.101 1.194 8.063 1.344 H 0.971 C 0.936 1.24 0.905 1.128 0.717 0.992 Z"
					fill="#0004"
				/>
			</svg>
			<div class="original-name">{{ cardFace.name }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

/**
 * CardTopLine Component
 *
 * Displays the top line of an MTG card containing:
 * - Card name (printed name or original name)
 * - Mana cost symbols
 * - Original name badge (for alternate language cards)
 */
export default defineComponent({
	name: "CardTopLine",
	props: {
		/**
		 * Card face data object containing name, printed_name, and mana_cost
		 */
		cardFace: {
			type: Object,
			required: true,
		},
		/**
		 * Array of mana symbol SVG URIs
		 */
		manaCostSymbols: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const nameEl = ref(null);

		const displayName = computed(() => {
			return props.cardFace?.printed_name ?? props.cardFace?.name ?? "";
		});

		const showOriginalName = computed(() => {
			return (
				props.cardFace?.printed_name &&
				props.cardFace.printed_name !== props.cardFace.name
			);
		});

		const onEditName = () => {
			emit("edit-property", "name");
		};

		const onEditManaCost = () => {
			emit("edit-property", "mana_cost");
		};

		return {
			nameEl,
			displayName,
			showOriginalName,
			onEditName,
			onEditManaCost,
		};
	},
});
</script>

<style scoped>
/* Top line styles will be inherited from parent MTGCard component */
/* Keeping minimal scoped styles here */
</style>
