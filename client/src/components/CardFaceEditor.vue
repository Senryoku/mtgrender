<template>
	<div>
		<div
			@mouseenter="outlineElement($event, 'name')"
			@focus.capture="outlineElement($event, 'name')"
		>
			<label for="card-name">Name</label>
			<input id="card-name" v-model="modelValue.name" type="text" />
		</div>
		<div
			@mouseenter="outlineElement($event, 'mana-cost')"
			@focus.capture="outlineElement($event, 'mana-cost')"
		>
			<label for="card-mana-cost">Mana Cost</label>
			<input id="card-mana-cost" v-model="modelValue.mana_cost" type="text" />
		</div>
		<div
			@mouseenter="outlineElement($event, 'type-line')"
			@focus.capture="outlineElement($event, 'type-line')"
		>
			<label for="card-type-line">Type Line</label>
			<input id="card-type-line" v-model="modelValue.type_line" type="text" />
		</div>
		<div
			@mouseenter="outlineElement($event, 'oracle')"
			@focus.capture="outlineElement($event, 'oracle')"
		>
			<label for="card-oracle">Oracle</label><br />
			<textarea
				id="card-oracle"
				v-model="modelValue.oracle_text"
				cols="40"
				rows="6"
			/>
		</div>
		<div
			@mouseenter="outlineElement($event, 'pt-box')"
			@focus.capture="outlineElement($event, 'pt-box')"
		>
			<label for="card-power">P / T</label>
			<input
				id="card-power"
				class="small-input"
				v-model="modelValue.power"
				type="text"
			/>
			/
			<input
				id="card-toughness"
				class="small-input"
				v-model="modelValue.toughness"
				type="text"
			/>
			<a @click="modelValue.power = modelValue.toughness = undefined">↺</a>
		</div>
		<div
			@mouseenter="outlineElement($event, 'loyalty')"
			@focus.capture="outlineElement($event, 'loyalty-box')"
		>
			<label for="card-loyalty">Loyalty</label>
			<input
				id="card-loyalty"
				class="small-input"
				v-model="modelValue.loyalty"
				type="text"
			/>
			<a @click="modelValue.loyalty = undefined">↺</a>
		</div>
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
		<div class="subsection">
			<h3>Footer</h3>
			<div
				@mouseenter="outlineElement($event, 'artist-name')"
				@focus.capture="outlineElement($event, 'artist-name')"
			>
				<label for="card-artist">Artist</label>
				<input id="card-artist" v-model="modelValue.artist" type="text" />
			</div>
			<div
				@mouseenter="outlineElement($event, 'collector-number')"
				@focus.capture="outlineElement($event, 'collector-number')"
			>
				<label for="card-number">Number</label>
				<input
					id="card-number"
					v-model="modelValue.collector_number"
					type="text"
				/>
			</div>
			<div
				@mouseenter="outlineElement($event, 'copyright')"
				@focus.capture="outlineElement($event, 'copyright')"
			>
				<label for="copyright">Copyright</label>
				<input id="copyright" v-model="modelValue.copyright" type="text" />
				<a @click="modelValue.copyright = undefined">↺</a>
			</div>
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