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
			@mouseenter="outlineElement($event, 'flavor')"
			@focus.capture="outlineElement($event, 'flavor')"
		>
			<label for="card-flavor">Flavor Text</label><br />
			<textarea
				id="card-flavor"
				v-model="modelValue.flavor_text"
				cols="40"
				rows="2"
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
		<IllustrationEditor v-model="modelValue" v-if="illustrationEditor" />
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
import IllustrationEditor from "./IllustrationEditor.vue";
export default {
	components: { IllustrationEditor },
	props: {
		modelValue: { type: Object, required: true },
		illustrationEditor: { type: Boolean, default: true },
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