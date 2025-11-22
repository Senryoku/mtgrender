<template>
	<div
		class="subsection"
		v-if="localValue.image_uris"
		@mouseenter="outlineElement($event, 'illustration')"
		@focus.capture="outlineElement($event, 'illustration')"
	>
		<h3>
			Illustration ({{ illustrationDimensions[0] }}x{{
				illustrationDimensions[1]
			}})
		</h3>
		<div v-if="localValue.image_uris">
			<label for="card-illustration">Source</label>
			<input
				id="card-illustration"
				v-model="localValue.image_uris.art_crop"
				type="text"
			/>
		</div>
		<div class="help">
			You can can drag the illustration and use your mouse wheel to adjust its
			position and scale.
		</div>
		<div>
			<label for="card-art-variant">Art Variant</label>
			<select id="card-art-variant" v-model="localValue.art_variant">
				<option :value="undefined"></option>
				<option value="normal">Normal</option>
				<option value="extended">Extended</option>
				<option value="full-footer">Full with footer</option>
				<option value="full">Full</option>
				<option value="archive">Mystical Archive</option>
				<option value="japanese-archive">Japanese Archive</option>
			</select>
		</div>
		<div v-if="localValue.image_uris">
			<label for="card-illustration-scale">Scale</label>
			<input
				id="card-illustration-scale"
				v-model="localValue.illustration_scale"
				type="number"
			/>
			<a @click="localValue.illustration_scale = 1.0">↺</a>
		</div>
		<div v-if="localValue.illustration_position">
			<label for="card-illustration-position">Position</label>
			<input
				id="card-illustration-position"
				v-model="localValue.illustration_position.x"
				type="number"
			/>
			<input
				id="card-illustration-position"
				v-model="localValue.illustration_position.y"
				type="number"
			/>
			<a @click="localValue.illustration_position = { x: 0, y: 0 }">↺</a>
		</div>
		<div v-if="localValue.illustration_textbox">
			<label for="card-illustration-bleedthrough">Bleedtrough Textbox</label>
			<input
				type="checkbox"
				id="card-illustration-bleedthrough"
				v-model="localValue.illustration_textbox"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { computed } from 'vue';
export default {
	props: {
		modelValue: { type: Object, required: true },
	},
	emits: ['update:modelValue', 'outline'],
	setup(props, { emit }) {
		const localValue = computed({
			get: () => props.modelValue,
			set: (value) => emit('update:modelValue', value)
		});

		return { localValue };
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
