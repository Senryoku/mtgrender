<template>
	<div
		class="subsection"
		v-if="modelValue.image_uris"
		@mouseenter="outlineElement($event, 'illustration')"
		@focus.capture="outlineElement($event, 'illustration')"
	>
		<h3>
			Illustration ({{ illustrationDimensions[0] }}x{{
				illustrationDimensions[1]
			}})
		</h3>
		<div v-if="modelValue.image_uris">
			<label for="card-illustration">Source</label>
			<input
				id="card-illustration"
				v-model="modelValue.image_uris.art_crop"
				type="text"
			/>
		</div>
		<div class="help">
			You can can drag the illustration and use your mouse wheel to adjust its
			position and scale.
		</div>
		<div>
			<label for="card-art-variant">Art Variant</label>
			<select id="card-art-variant" v-model="modelValue.art_variant">
				<option :value="undefined"></option>
				<option value="normal">Normal</option>
				<option value="extended">Extended</option>
				<option value="full-footer">Full with footer</option>
				<option value="full">Full</option>
				<option value="archive">Mystical Archive</option>
				<option value="japanese-archive">Japanese Archive</option>
			</select>
		</div>
		<div v-if="modelValue.image_uris">
			<label for="card-illustration-scale">Scale</label>
			<input
				id="card-illustration-scale"
				v-model="modelValue.illustration_scale"
				type="number"
			/>
			<a @click="modelValue.illustration_scale = 1.0">↺</a>
		</div>
		<div v-if="modelValue.illustration_position">
			<label for="card-illustration-position">Position</label>
			<input
				id="card-illustration-position"
				v-model="modelValue.illustration_position.x"
				type="number"
			/>
			<input
				id="card-illustration-position"
				v-model="modelValue.illustration_position.y"
				type="number"
			/>
			<a @click="modelValue.illustration_position = { x: 0, y: 0 }">↺</a>
		</div>
		<div v-if="modelValue.illustration_textbox">
			<label for="card-illustration-bleedthrough">Bleedtrough Textbox</label>
			<input
				type="checkbox"
				id="card-illustration-bleedthrough"
				v-model="modelValue.illustration_textbox"
			/>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	props: {
		modelValue: { type: Object, required: true },
	},
	methods: {
		outlineElement(ev, el) {
			this.$emit("outline", ev, el);
		},
	},
	computed: {
		illustrationDimensions() {
			if (!this.modelValue?.image_uris?.art_crop) return [0, 0];
			const img = new Image();
			img.src = this.modelValue.image_uris.art_crop;
			return [img.width, img.height];
		},
	},
};
</script>

<style scoped>
</style>