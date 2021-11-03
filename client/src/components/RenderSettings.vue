<template>
	<div>
		<label for="illustration-upscaling">Upscale Illustration</label>
		<input
			type="checkbox"
			id="illustration-upscaling"
			v-model="modelValue.upscale"
		/>
	</div>
	<div>
		<label for="illustration-upscale-model">Upscaler Model</label>
		<select id="illustration-upscale-model" v-model="modelValue.upscalerModel">
			<option v-for="name in upscalerModels" :key="name" :value="name">
				{{ name }}
			</option>
		</select>
	</div>
	<div>
		<label for="optimize">Optimize output PNG (Slow)</label>
		<input type="checkbox" id="optimize" v-model="modelValue.optimize" />
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
	data() {
		return {
			upscalerModels: [
				"div2k/rdn-C3-D10-G64-G064-x2",
				"div2k/rdn-C3-D10-G64-G064-x3",
				"div2k/rdn-C3-D10-G64-G064-x4",
				"idealo/psnr-small",
				"idealo/gans",
			],
		};
	},
};
</script>

<style scoped>
label {
	display: inline-block;
	width: 15em;
}
</style>