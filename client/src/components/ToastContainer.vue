<template>
	<div class="toast-container">
		<Toast
			v-for="(t, idx) in toasts"
			:key="idx"
			:toast="t"
			@close="remove(t)"
		/>
	</div>
</template>

<script lang="ts">
import Toast from "./Toast.vue";
export default {
	components: { Toast },
	data() {
		return {
			toasts: [],
		};
	},
	methods: {
		push(text) {
			this.toasts.push(text);
		},
		remove(val) {
			this.toasts.splice(
				this.toasts.findIndex((t) => t === val),
				1
			);
		},
	},
};
</script>

<style>
.toast-container {
	position: fixed;
	right: 2em;
	bottom: 2em;
	display: flex;
	flex-direction: column;
	gap: 1em;
}
</style>