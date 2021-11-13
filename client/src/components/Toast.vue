<template>
	<div class="toast" :class="toast.type">{{ toast.text }}</div>
</template>

<script lang="ts">
export default {
	props: { toast: Object },
	mounted() {
		this.mounted = true;
		setTimeout(() => {
			this.close();
		}, 3000);
	},
	methods: {
		close() {
			if (this.mounted) {
				this.$el.style.opacity = 0;
				window.setTimeout(() => {
					this.$emit("close");
				}, 500);
			}
		},
	},
};
</script>

<style>
.toast {
	background: white;
	padding: 0.5em 1em;
	border-radius: 0.5em;
	transition: opacity 0.5s;
	opacity: 1;
	animation: pulse 1s 1;
}

.error {
	background: #f44336;
	color: white;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
	}
	70% {
		box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
	}
}
</style>