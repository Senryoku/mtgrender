<template>
	<div id="modal" @click="outside_click">
		<div class="modal-content" @click="$event.stopPropagation()">
			<slot><div ref="defaultSlot"></div></slot>
			<div class="controls">
				<button v-show="is_disposable" @click="close">Ok</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, render } from "vue";

export default defineComponent({
	props: {
		disposable: { type: Boolean, default: true },
	},
	setup(inst) {
		const defaultSlot = ref(null);
		return {
			defaultSlot,
			is_disposable: ref(inst.disposable ?? true),
			closing: false,
		};
	},
	mounted() {
		this.container = this.$el.parentNode;
		this.mounted = true;
	},
	methods: {
		close() {
			if (this.mounted) {
				this.closing = true;
				this.$el.style.opacity = 0;
				window.setTimeout(() => {
					render(null, this.container);
					this.$el.remove();
					this.container = null;
					this.mounted = false;
				}, 250);
			}
		},
		outside_click() {
			if (this.is_disposable) this.close();
		},
		set_disposable(val) {
			this.is_disposable = val;
		},
	},
});
</script>


<style scoped>
#modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #00000080;

	display: flex;
	justify-items: center;
	justify-content: center;
	align-content: center;
	align-items: center;

	transition: opacity 0.25s;
	opacity: 1;
}

.modal-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;

	padding: 2em;
	border-radius: 2em;
	background-color: white;
	box-shadow: 4px 4px 6px #000a;

	max-width: 90vw;
	max-height: 90vh;
	overflow: auto;
}

button {
	padding: 0.5em 2em;
}
</style>