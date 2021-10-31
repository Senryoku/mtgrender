<template>
	<div>
		<label for="illustration-upscaling"> Upscale Illustration </label>
		<input
			type="checkbox"
			id="illustration-upscaling"
			v-model="modelValue.upscale"
		/>
	</div>
	<div>
		<label for="render-margin">Margin (mm)</label>
		<input id="render-margin" type="number" v-model="modelValue.margin" />
	</div>
</template>

<script lang="ts">
export default {
	props: {
		modelValue: { type: Object, required: true },
	},
};
</script>

<style scoped>
</style>