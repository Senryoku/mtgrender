<template>
	<div class="footer">
		<div class="footer-left">
			<div
				class="collector-number"
				@dblclick="onEditCollectorNumber"
				@mousedown.prevent=""
			>
				{{ collectorNumber }}
			</div>
			<div>
				<span v-if="card.set" class="set">{{
					card.set.toUpperCase()
				}}</span>
				<span
					v-if="card.set && card.lang"
					style="margin-right: 0.2mm"
					>&nbsp;•&nbsp;</span
				>
				<span v-if="card.lang" class="language"
					>{{ card.lang.toUpperCase() }}&nbsp;</span
				>
				<span class="artist-icon" v-if="card.artist"> a </span>
				<span
					class="artist-name"
					@dblclick="onEditArtist"
					@mousedown.prevent=""
					>{{ card.artist }}</span
				>
			</div>
		</div>
		<div class="footer-right">
			<div
				v-if="
					cardFace.power ||
					cardFace.toughness ||
					cardFace.loyalty ||
					cardFace.art_variant === 'archive'
				"
			>
				&nbsp;
			</div>
			<div class="copyright" @dblclick="onEditCopyright">
				{{ copyright }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

/**
 * CardFooter Component
 *
 * Displays the footer of an MTG card containing:
 * - Collector number
 * - Set code
 * - Language
 * - Artist name
 * - Copyright text
 */
export default defineComponent({
	name: "CardFooter",
	props: {
		/**
		 * Full card object
		 */
		card: {
			type: Object,
			required: true,
		},
		/**
		 * Current card face data
		 */
		cardFace: {
			type: Object,
			required: true,
		},
		/**
		 * Copyright text
		 */
		copyright: {
			type: String,
			default: "",
		},
		/**
		 * Is this an adventure card?
		 */
		isAdventure: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["edit-property"],
	setup(props, { emit }) {
		const collectorNumber = computed(() => {
			return (
				props.isAdventure || !props.cardFace?.collector_number
					? props.card
					: props.cardFace
			).collector_number;
		});

		const onEditCollectorNumber = () => {
			emit("edit-property", "collector_number");
		};

		const onEditArtist = () => {
			emit("edit-property", "artist");
		};

		const onEditCopyright = () => {
			emit("edit-property", "copyright");
		};

		return {
			collectorNumber,
			onEditCollectorNumber,
			onEditArtist,
			onEditCopyright,
		};
	},
});
</script>

<style scoped>

.footer {
    position: absolute;
    top: 82.91mm;
    left: 50%;
    transform: translateX(-50%);

    width: 55mm;
    margin: auto;

    display: flex;
    justify-content: space-between;
    color: white;
    font-family: Relay Wide Medium;
    font-size: 3.9pt;

    z-index: 3;
}

.footer-left>div,
.footer-right>div {
    height: 1.35mm;
}
</style>
