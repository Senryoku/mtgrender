<template>
	<div
		class="illustration"
		:class="{
			'behind-textbox': behindTextbox,
		}"
		:style="illustrationStyle"
		@wheel.prevent="onScaleIllustration"
		@mousedown.prevent="onStartDrag"
		@mouseup.prevent="onEndDrag"
		@mousemove="onDrag"
		@mouseleave="onCancelDrag"
	></div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

/**
 * CardIllustration Component
 *
 * Displays and manages the artwork/illustration of an MTG card.
 * Features:
 * - Drag to reposition the artwork
 * - Mouse wheel to zoom in/out
 * - Dynamic positioning and scaling
 */
export default defineComponent({
	name: "CardIllustration",
	props: {
		/**
		 * URL or data URI of the illustration
		 */
		illustrationUri: {
			type: String,
			default: "",
		},
		/**
		 * Scale factor for the illustration (1 to 50)
		 */
		illustrationScale: {
			type: Number,
			default: 1,
		},
		/**
		 * Position offset {x, y} in millimeters
		 */
		illustrationPosition: {
			type: Object,
			default: () => ({ x: 0, y: 0 }),
		},
		/**
		 * Whether illustration should be behind the textbox (for planeswalkers)
		 */
		behindTextbox: {
			type: Boolean,
			default: false,
		},
		/**
		 * Scale for rendering (used for extended art calculations)
		 */
		scale: {
			type: Number,
			default: 1,
		},
		/**
		 * Render margin (used for extended art calculations)
		 */
		renderMargin: {
			type: Number,
			default: 0,
		},
		/**
		 * Millimeters per pixel ratio
		 */
		mmperpixel: {
			type: Number,
			default: 1,
		},
	},
	emits: ["update:illustrationScale", "update:illustrationPosition"],
	data() {
		return {
			dragging: null as { x: number; y: number } | null,
		};
	},
	computed: {
		illustrationStyle() {
			return {
				backgroundImage: this.illustrationUri
					? `url(${this.illustrationUri})`
					: undefined,
				backgroundSize: `calc(${this.illustrationScale} * 100%)`,
				backgroundPosition: `${this.illustrationPosition.x}mm ${this.illustrationPosition.y}mm`,
			};
		},
	},
	methods: {
		onScaleIllustration(event: WheelEvent) {
			let newScale = this.illustrationScale;
			newScale += event.deltaY > 0 ? -0.1 : 0.1;
			newScale = Math.min(Math.max(1, newScale), 50);
			this.$emit("update:illustrationScale", newScale);
		},

		onStartDrag(event: MouseEvent) {
			// Initialize position if not set
			if (!this.illustrationPosition) {
				this.$emit("update:illustrationPosition", { x: 0, y: 0 });
			}
			this.dragging = {
				x: this.illustrationPosition?.x ?? 0,
				y: this.illustrationPosition?.y ?? 0,
			};
		},

		onEndDrag(event: MouseEvent) {
			this.dragging = null;
		},

		onCancelDrag(event: MouseEvent) {
			if (this.dragging) {
				this.$emit("update:illustrationPosition", this.dragging);
				this.onEndDrag(event);
			}
		},

		onDrag(event: MouseEvent) {
			if (this.dragging) {
				const newPosition = {
					x:
						this.illustrationPosition.x +
						(this.mmperpixel * event.movementX) / this.scale,
					y:
						this.illustrationPosition.y +
						(this.mmperpixel * event.movementY) / this.scale,
				};
				this.$emit("update:illustrationPosition", newPosition);
			}
		},
	},
});
</script>

<style scoped>
.illustration {
	background-color: yellow;
	background-repeat: no-repeat;
	cursor: grab;
}

.illustration:active {
	cursor: grabbing;
}

/* Additional positioning and sizing will be inherited from parent */
</style>
