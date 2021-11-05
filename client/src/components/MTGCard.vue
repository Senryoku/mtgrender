<template>
	<div
		class="mtg-card"
		:class="{
			mdfc: is_mdfc,
			transform: is_transform,
			back: currentFace === 1,
			legendary: is_legendary,
			'has-legendary-crown': has_legendary_crown,
			planeswalker: is_planeswalker,
			'planeswalker-large': is_large_planeswalker,
			saga: is_saga,
			adventure: is_adventure,
			'extended-art': card_face.art_variant === 'extended',
			'full-art': card_face.art_variant === 'full',
			compasslanddfc: this.card.frame_effects?.includes('compasslanddfc'),
		}"
	>
		<div class="inner-background"></div>
		<div class="inner-frame">
			<div class="legendary-crown" v-show="has_legendary_crown"></div>
			<div class="top-line">
				<span
					class="name"
					@dblclick.prevent="edit_property('name')"
					@mousedown.prevent=""
					ref="name_el"
				>
					{{ card_face.name }}
				</span>
				<div
					class="mana-cost"
					@dblclick.prevent="edit_property('mana_cost')"
					@mousedown.prevent=""
				>
					<img
						v-for="(uri, idx) in mana_cost"
						class="ms ms-shadow"
						:key="idx"
						:src="uri"
					/>
				</div>
			</div>
			<div class="planeswalker-oracle-bg" v-if="is_planeswalker"></div>
			<div class="mid-line">
				<img
					class="color-indicator"
					v-if="card_face.color_indicator"
					:src="color_indicator"
				/>
				<div
					class="type-line"
					@dblclick="edit_property('type_line')"
					@mousedown.prevent=""
					ref="type_line_el"
				>
					{{ card_face.type_line }}
				</div>
				<div class="set-icon-container" v-if="set_icon_uri">
					<img class="set-icon" :src="set_icon_uri" />
				</div>
			</div>
			<template v-if="is_adventure">
				<div class="adventure-part">
					<div class="adventure-top-line">
						<span
							class="adventure-name"
							@dblclick.prevent="edit_property(['card_faces', 1, 'name'])"
							@mousedown.prevent=""
							>{{ card.card_faces[1].name }}</span
						>
						<div
							class="adventure-mana-cost"
							@dblclick.prevent="edit_property(['card_faces', 1, 'mana_cost'])"
							@mousedown.prevent=""
						>
							<img
								v-for="(uri, idx) in adventure_mana_cost"
								class="ms ms-shadow"
								:key="idx"
								:src="uri"
							/>
						</div>
					</div>
					<div class="adventure-type">{{ card.card_faces[1].type_line }}</div>
					<div class="oracle adventure-oracle" ref="adventure_oracle_el">
						<div
							class="oracle-inner"
							v-for="(line, idx) in adventure_oracle_lines"
							:key="idx"
							v-html="line"
							@dblclick="edit_property(['card_faces', 1, 'oracle_text'])"
							@mousedown.prevent=""
						></div>
						<div
							class="oracle-flavor"
							v-if="card.card_faces[1].flavor_text"
							@dblclick="edit_property(['card_faces', 1, 'flavor_text'])"
							@mousedown.prevent=""
						>
							<hr />
							{{ card.card_faces[1].flavor_text }}
						</div>
					</div>
				</div>
				<div class="oracle adventure-main-oracle" ref="oracle_el">
					<div
						class="oracle-inner"
						v-for="(line, idx) in oracle_lines"
						:key="idx"
						v-html="line"
						@dblclick="edit_property(['card_faces', 0, 'oracle_text'])"
						@mousedown.prevent=""
					></div>
					<div
						class="oracle-flavor"
						v-if="card.card_faces[0].flavor_text"
						@dblclick="edit_property(['card_faces', 0, 'flavor_text'])"
						@mousedown.prevent=""
					>
						<hr />
						{{ card.card_faces[0].flavor_text }}
					</div>
				</div>
			</template>
			<template v-else-if="is_saga">
				<div
					class="oracle saga-oracle"
					@dblclick="edit_property('oracle_text')"
					@mousedown.prevent=""
				>
					<div
						class="saga-reminder"
						v-if="saga_reminder"
						v-html="saga_reminder"
					></div>
					<div class="saga-frame"></div>
					<div class="saga-steps" ref="oracle_el">
						<div class="saga-step" v-for="(step, idx) in saga_steps" :key="idx">
							<div class="saga-step-number">
								<img v-for="step in step.steps" :key="step" :src="step" />
							</div>
							<div v-html="step.html"></div>
						</div>
					</div>
				</div>
			</template>
			<template v-else-if="planeswalker_abilities">
				<div
					class="oracle planeswalker-oracle"
					ref="oracle_el"
					@dblclick="edit_property('oracle_text')"
				>
					<div
						class="planeswalker-ability"
						v-for="(ability, idx) in planeswalker_abilities"
						:key="idx"
						:class="{
							'planeswalker-ability-with-cost': ability.cost !== null,
						}"
					>
						<div
							class="planeswalker-ability-cost"
							v-if="ability.cost !== null"
							:class="{
								'planeswalker-ability-cost-minus': ability.cost < 0,
								'planeswalker-ability-cost-zero': ability.cost === 0,
								'planeswalker-ability-cost-plus': ability.cost > 0,
							}"
						>
							{{ ability.cost > 0 ? "+" : "" }}{{ ability.cost }}
						</div>
						<div v-html="ability.html"></div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="oracle normal-oracle" ref="oracle_el">
					<div
						class="oracle-inner"
						v-for="(line, idx) in oracle_lines"
						:key="idx"
						v-html="line"
						@dblclick="edit_property('oracle_text')"
						@mousedown.prevent=""
					></div>
					<div
						class="oracle-flavor"
						v-if="card_face.flavor_text"
						@dblclick="edit_property('flavor_text')"
						@mousedown.prevent=""
					>
						<hr />
						{{ card_face.flavor_text }}
					</div>
				</div>
			</template>
		</div>
		<div class="pt-box" v-show="card_face.power || card_face.toughness">
			<span @dblclick="edit_property('power')" @mousedown.prevent="">{{
				card_face.power
			}}</span
			>/<span @dblclick="edit_property('toughness')" @mousedown.prevent=""
				>{{ card_face.toughness }}
			</span>
		</div>
		<div
			class="loyalty"
			v-show="card_face.loyalty"
			@dblclick="edit_property('loyalty')"
		>
			{{ card_face.loyalty }}
		</div>
		<div class="footer">
			<div class="footer-left">
				<div
					class="collector-number"
					@dblclick="edit_property('collector_number')"
					@mousedown.prevent=""
				>
					{{ (is_adventure ? card : card_face).collector_number }}
				</div>
				<div>
					<span v-if="card.set" class="set"
						>{{ card.set.toUpperCase() }}&nbsp;</span
					>
					<span v-if="card.set && card.lang" class="set">•&nbsp;</span>
					<span v-if="card.lang" class="language"
						>{{ card.lang.toUpperCase() }}&nbsp;</span
					>
					<span class="artist-icon" v-if="card.artist">a </span>
					<span
						class="artist-name"
						@dblclick="edit_property('artist')"
						@mousedown.prevent=""
						>{{ card.artist }}</span
					>
				</div>
			</div>
			<div class="footer-right">
				<div v-if="card_face.power || card_face.toughness || card_face.loyalty">
					&nbsp;
				</div>
				<div class="copyright" @dblclick="edit_property('copyright')">
					{{ copyright }}
				</div>
			</div>
		</div>
		<div
			class="illustration"
			:class="{
				'behind-textbox':
					card.illustration_textbox ||
					(is_planeswalker && card.illustration_textbox !== false),
			}"
			@wheel.prevent="scale_illustration"
			@mousedown.prevent="start_drag_illustration"
			@mouseup.prevent="end_drag_illustration"
			@mousemove="drag_illustration"
			@mouseleave="cancel_drag_illustration"
		></div>
		<div v-if="is_mdfc" class="mdfc-icon"></div>
		<div v-if="is_mdfc" class="mdfc-hint">
			<span>{{ mdfc_hint_text }}</span>
			<div class="mana-cost mdfc-hint-mana-cost">
				<img
					v-for="(uri, idx) in mdfc_back_mana_cost"
					class="ms ms-shadow"
					:key="idx"
					:src="uri"
				/>
			</div>
		</div>
		<div v-if="is_transform" class="transform-icon"></div>
		<div
			v-if="is_transform && currentFace === 0 && back_face.power"
			class="transform-hint"
		>
			{{ back_face.power }}/{{ back_face.toughness }}
		</div>
		<div v-if="is_dualfaced" class="flip-icon" @click="flip">⭯</div>
		<div
			v-if="
				debug &&
				display_debug &&
				(card?.image_uris?.png || card_face?.image_uris?.png)
			"
			class="debug-overlay"
			@mousemove="update_debug_overlay"
			@mouseleave="update_debug_overlay"
		>
			<div>
				<img :src="card?.image_uris?.png || card_face?.image_uris?.png" />
			</div>
		</div>
		<div class="debug-controls" v-if="debug">
			<input type="number" step="0.1" v-model="debug_opacity" />
			<input type="checkbox" v-model="display_debug" />
		</div>
	</div>
</template>

<script lang="ts">
import { ref, nextTick } from "vue";

const keywords = {
	Flash: "You may cast this spell any time you could cast an instant.",
};
const mana_regex = /{([^}]+)}/g;

const mana_symbols = {};
import mana_symbols_list from "../assets/data/symbology.json";
for (let symbol of mana_symbols_list) mana_symbols[symbol.symbol] = symbol;
import sets_with_icons from "../assets/data/sets_with_icons.json";

function check_overflow(el) {
	const curOverflow = el.style.overflow;

	if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

	const isOverflowing =
		el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
	el.style.overflow = curOverflow;

	return isOverflowing;
}

function contains(str, search) {
	if (!str || !search) return false;
	if (Array.isArray(search))
		return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
	return str.toLowerCase().includes(search.toLowerCase());
}

export default {
	name: "MTGCard",
	props: {
		card: Object,
		scale: Number,
		renderMargin: Number,
	},
	data() {
		const name_el = ref(null);
		const oracle_el = ref(null);
		const adventure_oracle_el = ref(null);
		const type_line_el = ref(null);
		return {
			name_el,
			oracle_el,
			adventure_oracle_el,
			type_line_el,
			currentFace: 0,
			dragging_illustration: null,
			debug: import.meta.env.MODE === "development",
			display_debug: true,
			debug_opacity: 0,
		};
	},
	updated() {
		this.fit();
	},
	methods: {
		set_face(idx) {
			this.currentFace = idx;
		},
		gen_mana_symbol(str, classes = []) {
			if ("{" + str + "}" in mana_symbols) {
				let el = new Image();
				el.src = mana_symbols["{" + str + "}"].svg_uri;
				el.className = "ms";
				return el;
			}
		},
		parse_oracle(str) {
			if (str in keywords) {
				return `${str} <span class="oracle-reminder">(${keywords[str]})</span>`;
			}
			str = str.replace(
				mana_regex,
				(match, group) => this.gen_mana_symbol(group).outerHTML // FIXME: This is horrible
			);
			// Included reminder text
			str = str.replace(
				/\([^)]+\)/g,
				(match) => `<span class="oracle-reminder">${match}</span>`
			);
			return str;
		},
		edit_property(prop) {
			// TODO
			const r = prompt(`Edit Card property '${prop}'`, this.card_face[prop]);
			if (r)
				this.$emit(
					"edit",
					this.d ? ["card_faces", this.currentFace, prop] : prop,
					r
				);
		},
		scale_illustration(event) {
			let s = 1;
			if (this.card_face.illustration_scale)
				s = this.card_face.illustration_scale;
			s += event.deltaY > 0 ? -0.1 : 0.1;
			s = Math.min(Math.max(1, s), 50);
			this.$emit(
				"edit",
				this.card.card_faces
					? ["card_faces", this.currentFace, "illustration_scale"]
					: "illustration_scale",
				s
			);
		},
		start_drag_illustration(event) {
			if (!this.card_face.illustration_position)
				this.$emit(
					"edit",
					this.card.card_faces
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					{ x: 0, y: 0 }
				);
			this.dragging_illustration = {
				x: this.card_face.illustration_position.x,
				y: this.card_face.illustration_position.y,
			};
		},
		cancel_drag_illustration(event) {
			if (this.dragging_illustration) {
				this.$emit(
					"edit",
					this.card.card_faces
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					this.dragging_illustration
				);
				this.end_drag_illustration();
			}
		},
		end_drag_illustration(event) {
			this.dragging_illustration = null;
		},
		drag_illustration(event) {
			if (this.dragging_illustration) {
				this.$emit(
					"edit",
					this.card.card_faces
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					{
						x:
							this.card_face.illustration_position.x +
							(this.mmperpixel * event.movementX) / this.scale,
						y:
							this.card_face.illustration_position.y +
							(this.mmperpixel * event.movementY) / this.scale,
					}
				);
			}
		},
		fit_font_size(el, initial_size = 8) {
			let curr_font_size = initial_size;
			el.style.fontSize = curr_font_size + "pt";
			while (check_overflow(el) && curr_font_size > 3) {
				curr_font_size *= 0.9;
				el.style.fontSize = curr_font_size + "pt";
			}
		},
		fit() {
			this.fit_name();
			this.fit_type_line();
			this.fit_oracle_text();
		},
		fit_name() {
			if (!this.$refs.name_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				this.fit_font_size(this.$refs.name_el, 9.5);
			});
		},
		fit_type_line() {
			if (!this.$refs.type_line_el) return;
			// Make sure type fits in its box
			nextTick(() => {
				this.fit_font_size(this.$refs.type_line_el);
			});
		},
		fit_oracle_text() {
			if (!this.$refs.oracle_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				this.fit_font_size(this.$refs.oracle_el);
				if (this.$refs.adventure_oracle_el)
					this.fit_font_size(this.$refs.adventure_oracle_el);
			});
		},
		flip() {
			this.currentFace = (this.currentFace + 1) % 2;
			this.fit_name();
			this.fit_oracle_text();
			this.fit_type_line();
		},
		compute_colors(face) {
			if (
				face?.colors === undefined &&
				face?.color_identity === undefined &&
				face?.mana_cost === undefined
			)
				return "Colourless";
			let colors =
				face?.colors && face?.colors.length > 0
					? face?.colors
					: face?.color_identity
					? face?.color_identity
					: [...face.mana_cost].filter((c) => "WUBRG".includes(c));
			if (colors.length === 0 && this.card.color_identity.length > 0)
				colors = this.card.color_identity;
			const sorted_colors = [...new Set(colors)]
				.sort((l: string, r: string) => {
					return "WUBRG".indexOf(l) - "WUBRG".indexOf(r);
				})
				.join("");
			// TODO: Correctly handle dual mana cost (bi-colored border)
			return contains(face.type_line, ["Artifact", "Artefact", "Artéfact"])
				? "Artifact"
				: sorted_colors.length === 0
				? "Colourless"
				: sorted_colors.length > 2
				? "Gold"
				: sorted_colors;
		},
		update_debug_overlay(event) {
			if (event.type === "mousemove") {
				event.target.firstElementChild.style.width =
					(event.clientX - event.target.parentNode.getBoundingClientRect().x) /
						this.scale +
					"px";
			} else {
				event.target.firstElementChild.style.width = "";
			}
		},
	},
	computed: {
		mmperpixel() {
			return 63.5 / this.$el.clientWidth;
		},
		card_face() {
			if (this.card.card_faces) return this.card.card_faces[this.currentFace];
			return this.card;
		},
		back_face() {
			if (this.card.card_faces)
				return this.card.card_faces[(this.currentFace + 1) % 2];
			return this.card;
		},
		is_land() {
			return this.card_face?.type_line?.startsWith("Land") ||
				this.card_face?.type_line?.startsWith("Terrain")
				? true
				: false;
		},
		is_legendary() {
			return this.card.frame_effects?.includes("legendary") ||
				this.card_face?.type_line?.startsWith("Legendary") ||
				this.card_face?.type_line?.includes("légendaire")
				? true
				: false;
		},
		has_legendary_crown() {
			return (
				this.is_legendary &&
				!this.is_planeswalker &&
				!this.card.frame_effects?.includes("compasslanddfc")
			);
		},
		is_adventure() {
			return this.card.layout === "adventure";
		},
		is_planeswalker() {
			return this.card_face?.type_line?.toLowerCase().includes("planeswalker");
		},
		is_large_planeswalker() {
			return this.is_planeswalker && this.planeswalker_abilities.length > 3;
		},
		is_saga() {
			return (
				this.card_face?.layout === "saga" ||
				contains(this.card_face?.type_line, "Saga")
			);
		},
		is_vehicle() {
			if (!this.card?.type_line) return false;
			return contains(this.card_face.type_line, ["Vehicle", "Véhicule"]);
		},
		is_dualfaced() {
			return this.card.card_faces && !this.is_adventure;
		},
		is_mdfc() {
			return this.card.layout === "modal_dfc";
		},
		is_transform() {
			return this.card.layout === "transform";
		},
		mana_cost() {
			if (!this.card_face?.mana_cost) return [];
			return [...this.card_face.mana_cost.matchAll(mana_regex)].map(
				(m) => mana_symbols[m[0]].svg_uri
			);
		},
		adventure_mana_cost() {
			if (!this.card?.card_faces?.[1]?.mana_cost) return [];
			return [...this.card.card_faces[1].mana_cost.matchAll(mana_regex)].map(
				(m) => mana_symbols[m[0]].svg_uri
			);
		},
		mdfc_back_mana_cost() {
			if (!this.card?.card_faces?.[(this.currentFace + 1) % 2]?.mana_cost)
				return [];
			return [
				...this.card.card_faces[(this.currentFace + 1) % 2].mana_cost.matchAll(
					mana_regex
				),
			].map((m) => mana_symbols[m[0]].svg_uri);
		},
		mdfc_hint_text() {
			return (
				this.card_face.mdfc_hint ??
				this.back_face?.type_line
					?.substr(this.back_face.type_line.indexOf("—") + 1)
					.trim()
			);
		},
		extended_art() {
			return ["extended", "full"].includes(this.card_face.art_variant);
		},
		oracle_lines() {
			if (!this.card_face?.oracle_text) return [];
			return this.card_face.oracle_text.split("\n").map(this.parse_oracle);
		},
		adventure_oracle_lines() {
			if (!this.card.card_faces?.[1]?.oracle_text) return [];
			return this.card.card_faces[1].oracle_text
				.split("\n")
				.map(this.parse_oracle);
		},
		saga_reminder() {
			if (!this.card_face?.oracle_text) return "";
			return this.parse_oracle(this.card_face.oracle_text.split("\n")[0]);
		},
		saga_steps() {
			return this.card_face.oracle_text
				.split("\n")
				.filter((s) => s.match(/^(.+) — /))
				.map(this.parse_oracle)
				.map((str) => {
					const m = str.match(/(.+) — (.+)/);
					return {
						steps: m[1]
							.split(",")
							.map(
								(s) =>
									new URL(`../assets/img/saga/${s.trim()}.png`, import.meta.url)
										.href
							),
						html: m[2],
					};
				});
		},
		planeswalker_abilities() {
			if (!this.is_planeswalker) return null;
			return this.card_face.oracle_text
				.split("\n")
				.map(this.parse_oracle)
				.map((line) => {
					const r = { html: line, cost: null };
					const m = line.match(/^[+-−]?(\d+):/);
					if (m) {
						if (line[0] === "0") {
							r.cost = 0;
						} else if (line[0] === "+") {
							r.cost = parseInt(m[1]);
						} else r.cost = -parseInt(m[1]);
						r.html = line.substr(m[0].length + 1);
					}
					return r;
				});
		},
		copyright() {
			return (
				this.card?.copyright ??
				`™ & © ${new Date().getFullYear()} Wizards of the Coast`
			);
		},
		colors() {
			return this.compute_colors(this.card_face);
		},
		boxes_colors() {
			return this.colors === "Vehicle"
				? "Artifact"
				: this.is_land // FIXME: Fixes colors for cards like 'Agadeem, the Undercrypt', but may cause problem elsewhere?
				? "Land"
				: this.colors.length > 1 && this.colors.length < 5
				? "Gold"
				: this.colors;
		},
		background() {
			const folder = this.is_planeswalker
				? this.is_large_planeswalker
					? "planeswalker_large_bg"
					: "planeswalker_bg"
				: this.is_saga
				? "saga_bg"
				: this.card.frame_effects?.includes("compasslanddfc") &&
				  this.currentFace === 1
				? "ixalan_bg"
				: "bg";
			return `url(${
				new URL(
					`../assets/img/${folder}/${
						this.is_vehicle ? "Vehicle" : this.boxes_colors
					}.png`,
					import.meta.url
				).href
			})`;
		},
		frame() {
			let folder = this.is_adventure
				? "adventure_frames"
				: this.is_saga
				? "saga_frames"
				: this.is_planeswalker
				? this.is_large_planeswalker
					? "planeswalker_large_frames"
					: "planeswalker_frames"
				: this.is_mdfc
				? "mdfc_frames"
				: this.is_transform
				? this.currentFace === 0
					? "transform_frames"
					: "transform_back_frames"
				: "frames";
			if (this.extended_art && !this.is_saga) folder = "extended_" + folder;
			return `url(${
				new URL(`../assets/img/${folder}/${this.colors}.png`, import.meta.url)
					.href
			})`;
		},
		boxes() {
			const folder = this.is_planeswalker
				? "planeswalker_boxes"
				: this.is_mdfc || this.is_transform
				? this.currentFace === 0
					? "mdfc_boxes"
					: "mdfc_back_boxes"
				: this.extended_art
				? "extended_boxes"
				: "boxes";
			return `url(${
				new URL(
					`../assets/img/${folder}/${this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		legendary_crown() {
			const folder = this.extended_art
				? "extended_legendary_crowns"
				: "legendary_crowns";
			return `url(${
				new URL(`../assets/img/${folder}/${this.colors}.png`, import.meta.url)
					.href
			})`;
		},
		pt_box() {
			return `url(${
				new URL(
					`../assets/img/${
						(this.is_mdfc || this.is_transform) && this.currentFace === 1
							? "transform_back_pt_boxes"
							: "pt_boxes"
					}/${this.is_vehicle ? "Vehicle" : this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		saga_text_box() {
			return `url(${
				new URL(
					`../assets/img/saga_textboxes/${this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_icon() {
			return `url(${
				new URL(
					`../assets/img/mdfc${this.currentFace === 0 ? "" : "_back"}_icons/${
						this.boxes_colors === "Land" ? this.colors : this.boxes_colors
					}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_hint() {
			let colors = this.compute_colors(this.back_face);
			if (colors.length > 1 && colors.length < 5) colors = "Gold";
			return `url(${
				new URL(
					`../assets/img/mdfc${
						this.currentFace === 0 ? "" : "_back"
					}_hints/${colors}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_text_color() {
			return this.currentFace === 0 ? "black" : "white";
		},
		mdfc_hint_color() {
			return this.currentFace === 0 ? "white" : "black";
		},
		transform_icon() {
			return `url(${
				new URL(
					`../assets/img/transform${
						this.currentFace === 0 ? "" : "_back"
					}_icons/${
						this.card.frame_effects?.[0] ?? "sunmoondfc"
					}.png` /* FIXME: Pretty sure this will break at some point */,
					import.meta.url
				).href
			})`;
		},
		pt_box_color() {
			return this.is_vehicle || (this.is_transform && this.currentFace === 1)
				? "white"
				: "black";
		},
		top_line_color() {
			return this.is_transform &&
				this.currentFace === 1 &&
				!this.is_planeswalker
				? "white"
				: "black";
		},
		mid_line_color() {
			return (this.extended_art &&
				!this.is_planeswalker &&
				!this.is_transform) ||
				(this.is_transform && this.currentFace === 1 && !this.is_planeswalker)
				? "white"
				: "black";
		},
		color_indicator() {
			return new URL(
				`../assets/img/color_indicators/${[...this.card_face.color_indicator]
					.sort((lhs, rhs) => "WUBRG".indexOf(lhs) - "WUBRG".indexOf(rhs))
					.join("")}.png`,
				import.meta.url
			).href;
		},
		illustration() {
			return `url(${
				(this.is_adventure ? this.card : this.card_face)?.image_uris?.art_crop
			})`;
		},
		illustration_scale() {
			return this.card_face?.illustration_scale ?? 1;
		},
		illustration_position() {
			return this.card_face?.illustration_position
				? {
						x: this.card_face?.illustration_position.x + "mm",
						y: this.card_face?.illustration_position.y + "mm",
				  }
				: { x: "0mm", y: "0mm" };
		},
		set_icon_uri() {
			if (this.card.set_icon) return this.card.set_icon;
			if (sets_with_icons.includes(this.card?.set))
				return new URL(
					`../assets/img/set_icons/${this.card?.set}_${
						this.card?.rarity ?? "common"
					}.png`,
					import.meta.url
				).href;
			return null;
		},
	},
	watch: {
		"card.oracle_text": function () {
			this.fit_oracle_text();
		},
		"card.type_line": function () {
			this.fit_type_line();
		},
		"card.card_faces": function () {
			this.fit();
		},
	},
};
</script>

<style scoped>
@font-face {
	font-family: "Beleren";
	src: url("../assets/fonts/beleren-bold_P1.01.ttf") format("truetype");
}

@font-face {
	font-family: "Beleren Small Caps";
	src: url("../assets/fonts/belerensmallcaps-bold.ttf") format("truetype");
}

@font-face {
	font-family: "MPlantin";
	src: url("../assets/fonts/mplantin.eot") format("eot"),
		url("../assets/fonts/mplantin.woff") format("woff"),
		url("../assets/fonts/mplantin.ttf") format("truetype");
}

@font-face {
	font-family: "MPlantin-Italic";
	src: url("../assets/fonts/MPlantin-Italic.ttf") format("truetype");
	font-style: italic;
}

@font-face {
	font-family: "Relay Medium";
	src: url("../assets/fonts/relay-medium.ttf") format("truetype");
}

.mtg-card {
	position: relative;
	width: 63.5mm;
	height: 88.9mm;
	border-radius: 3mm;
	padding: 2.25mm;
	background-color: black;

	font-family: Beleren;
	font-size: 3mm;
	text-rendering: geometricPrecision;

	box-sizing: border-box;
}

.inner-background {
	position: absolute;
	left: calc((63.5mm - 58mm) / 2);
	width: 58mm;
	height: 78mm;
	margin: auto;
	border-radius: 0.75mm 0.75mm 4mm 4mm;
	overflow-y: visible;
	background-image: v-bind(background);
	background-size: 100%;
	padding-top: 1.1mm;
	background-repeat: no-repeat;

	pointer-events: none;
	user-select: none;
}

.inner-frame {
	position: absolute;
	margin: auto;
	width: calc(58mm * 0.97482);
	top: 3.5mm;
	left: calc((63.5mm - 58mm * 0.97482) / 2);
	height: 78mm;
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black)
		drop-shadow(0.1mm -0.2mm 0.1mm #ffffffa0);
	background-image: v-bind(frame);
	background-size: 100%;
	background-repeat: no-repeat;
	padding-top: 0.508mm;

	pointer-events: none;
	user-select: none;
}

.has-legendary-crown .inner-background {
	padding-top: 0;
}

.has-legendary-crown .inner-background {
	background-position: 0 -1.1mm;
	margin-top: 1.1mm;
}

.has-legendary-crown .inner-frame {
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black);
}

.legendary-crown {
	position: absolute;
	left: -1.92mm;
	top: -2mm;
	width: 60.06mm;
	height: 100%;
	background-image: v-bind(legendary_crown);
	background-size: 100%;
	background-repeat: no-repeat;
	z-index: -1;
}

.extended-art .legendary-crown,
.full-art .legendary-crown {
	top: -2.3mm;
}

.top-line,
.mid-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 5.1mm;
	width: 53mm;
	margin: auto;
	padding: 0 1mm 0 1.5mm;
	background-image: v-bind(boxes);
	background-size: 100%;

	pointer-events: initial;
	user-select: initial;
}

.top-line {
	color: v-bind(top_line_color);
}

.mid-line {
	color: v-bind(mid_line_color);
}

.name {
	font-size: 9.454pt;
	white-space: nowrap;
	/*margin-top: -0.4mm; //???*/
}

.mana-cost {
	font-size: 6.5pt;
	display: flex;
	gap: 0.3mm;
	margin-top: -0.4mm;
}

.mana-cost .ms,
.adventure-mana-cost .ms {
	width: 1.35em;
	border-radius: 50%;
	box-shadow: -0.2mm 0.2mm 0 rgba(0, 0, 0, 0.85);
}

.illustration {
	position: absolute;
	z-index: -1;
	top: 9.5mm;
	left: 5mm;
	width: 53.5mm;
	height: 39mm;
	margin: auto;
	background-image: v-bind(illustration);
	background-color: yellow;
	background-size: calc(v-bind(illustration_scale) * 100%);
	background-position: v-bind(illustration_position.x)
		v-bind(illustration_position.y);
	background-repeat: no-repeat;
	cursor: grab;
}

.extended-art .illustration {
	z-index: 1;
	left: 0;
	top: 7mm;
	width: 100%;
	height: 48mm;
	background-color: black;
	mask-image: linear-gradient(
		rgba(0, 0, 0, 0) 0,
		rgba(0, 0, 0, 1) 6%,
		rgba(0, 0, 0, 1) 94%,
		rgba(0, 0, 0, 0) 100%
	);
}

.extended-art .inner-frame,
.full-art .inner-frame {
	z-index: 2;
}

.mid-line {
	position: absolute;
	top: 45.6mm;
	left: 0mm;
	right: 0;
	background-position: 0 bottom;
	gap: 0.6mm;
}

.color-indicator {
	width: 2.8mm;
	margin-left: -0.5mm;
}

.type-line {
	font-size: 8pt;
	height: 5mm;
	line-height: 5mm;
	flex-grow: 1;
	white-space: nowrap;
}

.set-icon-container {
	height: 3.6mm;
	width: 7mm;
	margin-right: 0.2mm;
	display: flex;
	justify-content: right;
	align-items: center;
}

.set-icon {
	max-height: 100%;
	max-width: 100%;
}

.oracle {
	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

.oracle:deep(.ms) {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: baseline;
}

.normal-oracle {
	position: absolute;
	top: 51.8mm;
	left: 0mm;
	right: 0;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;

	width: 53mm;
	height: 25mm;
	margin: auto;
}

/* Workaround the fact that adventure frames have a sligthly larger ratio */
.adventure .inner-frame {
	width: calc(58mm * 0.98);
	margin-left: -0.1mm;
}

.adventure .top-line,
.adventure .mid-line {
	margin-left: 0.84mm;
}

.adventure-main-oracle {
	position: absolute;
	top: 51.4mm;
	left: 29.8mm;
	width: 25.5mm;
	height: 25mm;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;
}

.adventure-part {
	position: absolute;
	top: 51.4mm;
	left: 2mm;
	width: 26mm;
	height: 25.2mm;

	display: flex;
	align-items: stretch;
	flex-direction: column;
}

.adventure-top-line,
.adventure-type {
	color: white;
	height: 4.2mm;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 7pt;
	line-height: 7pt;
	flex-shrink: 0;
	margin-left: 0.6mm;
}

.adventure-mana-cost {
	display: flex;
	font-size: 5pt;
	gap: 0.3mm;
	margin-top: -0.4mm;
	margin-right: 0.5mm;
}

.adventure-oracle {
	flex-grow: 1;
	margin: 0.8mm 0 0.2mm 0;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;

	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

/************** Saga *************/

.saga .inner-frame {
	top: 3.66mm;
	margin: 0;
	width: 57.7mm;
	margin-left: -1mm;
}

.saga .saga-frame {
	position: absolute;
	top: 0;
	left: -2.8mm;
	width: 10mm;
	height: 100%;
	background-image: v-bind(frame);
	background-size: 58mm;
	background-position: 0 -6.3mm;
	background-repeat: no-repeat;
	pointer-events: none;
}

.saga .top-line,
.saga .mid-line {
	margin-left: 1.6mm;
}

.saga .mid-line {
	position: absolute;
	top: 70.6mm;
	left: 0mm;
	right: 0;
}

.saga .illustration {
	width: 26.8mm;
	height: 63.6mm;
	top: 10mm;
	left: 31.8mm;
	outline-offset: 0;
}

.saga-oracle {
	position: absolute;
	left: 2.8mm;
	top: 6.35mm;
	width: 26.3mm;
	height: 63.3mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.saga-reminder {
	height: 12mm;
	font-size: 7.3pt;
	line-height: 7.3pt;
	padding: 2mm 0.7mm 2mm 0.7mm;
}

.saga-steps {
	display: flex;
	align-items: stretch;
	justify-content: stretch;
	flex-direction: column;
	gap: 0.8mm;
	padding-left: 2.5mm;
	height: 47.5mm;
}

.saga-step {
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	box-shadow: 0 -0.35mm 0.5mm #00000020;
	padding: 1mm;
	flex-grow: 1;
}

.saga-step-number {
	position: absolute;
	width: 5mm;
	top: 50%;
	transform: translateY(-50%);
	left: -5mm;
	z-index: 4;
}

.saga-step-number img {
	width: 5mm;
}

/* Planeswalkers */

.planeswalker .inner-frame {
	top: 2.36mm;
	left: 3mm;
	width: calc(58mm - 2px);
	height: 80mm;
}

.planeswalker .mid-line {
	margin-top: 1.3mm;
}

.planeswalker-large .mid-line {
	margin-top: -4.6mm;
}

.planeswalker .illustration {
	position: absolute;
	left: 4mm;
	top: 8.2mm;
	width: 55mm;
	height: 39mm;
	/*border-radius: 2mm/50%;*/
}

.planeswalker .illustration.behind-textbox {
	background-color: white;
	height: 73mm;
}

.planeswalker.extended-art .illustration.behind-textbox {
	mask-image: linear-gradient(
		rgba(0, 0, 0, 0) 0,
		rgba(0, 0, 0, 1) 3%,
		rgba(0, 0, 0, 1) 97%,
		rgba(0, 0, 0, 0) 100%
	);
}

.planeswalker:not(.full-art):not(.extended-art) .illustration.behind-textbox {
	border-radius: 2mm / calc(39mm / 2);
	border-bottom-left-radius: 4mm 3mm;
	border-bottom-right-radius: 2mm;
}

.planeswalker.full-art .illustration,
.full-art .illustration {
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: initial;
	z-index: 1;
}

.planeswalker .top-line,
.planeswalker .mid-line {
	width: 53.75mm;
}

.planeswalker .mid-line {
	position: absolute;
	top: 45.8mm;
	left: 0;
	right: 0;
}

.planeswalker-oracle-bg {
	position: absolute;
	left: 4.75mm;
	top: 53.2mm;
	width: 50.85mm;
	height: 25.35mm;
	background-color: #ffffff80;
	border-radius: 0.9mm;
	border-bottom-left-radius: 8mm 2.1mm;
	border-bottom-right-radius: 8mm 2.1mm;
	box-shadow: inset -0.2mm -0.2mm 0.2mm #00000080,
		inset 0.2mm 0.2mm 0.2mm #00000080;
}

.planeswalker-large .planeswalker-oracle-bg {
	top: 47mm;
	height: 31.45mm;
}

.planeswalker-oracle {
	position: absolute;
	left: 0;
	top: 53mm;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.4mm;

	width: 49.5mm;
	height: 24mm;

	padding: 0.5mm;
	padding-left: 5.5mm;
	padding-bottom: 1mm;
}

.planeswalker-large .planeswalker-oracle {
	top: 46.6mm;
	height: 31.04mm;
}

.planeswalker-ability {
	position: relative;
	flex-shrink: 0;
	padding: 0.4mm 0.4em;
}

.planeswalker-ability:nth-child(2n + 1):before {
	content: "";
	position: absolute;
	left: -0.6mm;
	right: -0.6mm;
	top: -1.2mm;
	bottom: -1.2mm;
	background-color: #fff4;
	mask-image: linear-gradient(
			transparent,
			transparent 1.2mm,
			black 1.2mm,
			black calc(100% - 1.2mm),
			transparent calc(100% - 1.2mm),
			transparent
		),
		url("../assets/img/planeswalker_ability_top.png"),
		url("../assets/img/planeswalker_ability_bottom.png");
	mask-size: 100%, 100%, 100%;
	mask-position: 0 0, 0 0, 0 100%;
	mask-repeat: repeat-x;
	mask-composite: add;
	z-index: -1;
}

.planeswalker-ability-with-cost:nth-child(2n + 1):before {
	left: -3.1mm;
	right: -0.6mm;
}

.planeswalker-ability:nth-child(1):before {
	border-top-left-radius: 1mm;
	border-top-right-radius: 1mm;
	mask-image: linear-gradient(
			black calc(100% - 1.2mm),
			transparent calc(100% - 1.2mm),
			transparent
		),
		url("../assets/img/planeswalker_ability_bottom.png");
	mask-size: 100%, 100%;
	mask-position: 0 0, 0 100%;
	mask-composite: add;
	top: -0.1mm;
}

.planeswalker:not(.planeswalker-large)
	.planeswalker-ability:nth-child(3):before {
	mask-image: linear-gradient(transparent, transparent 1.2mm, black 1.2mm),
		url("../assets/img/planeswalker_ability_top.png");
	mask-size: 100%, 100%;
	mask-position: 0 0, 0 0;
	bottom: -1mm;
	border-bottom-left-radius: 10mm 2mm;
}

.planeswalker-ability-with-cost {
	margin-left: 2.5mm;
	min-height: 4.8mm;
	flex-grow: 1;
	display: flex;
	align-items: center;
	padding: 0.4mm 0;
}

.planeswalker-ability-cost {
	position: absolute;
	left: -8.5mm;
	top: 50%;
	transform: translateY(-50%);
	background-size: 100%;
	background-repeat: no-repeat;
	width: 7mm;
	color: white;
	font-size: 7pt;
	text-align: center;
	font-family: Beleren;
}

.planeswalker-ability-cost-plus {
	background-image: url("../assets/img/planeswalker/LoyaltyPlus.png");
	height: 4.7mm;
	line-height: 5mm;
}

.planeswalker-ability-cost-zero {
	background-image: url("../assets/img/planeswalker/LoyaltyZero.png");
	height: 4.2mm;
	line-height: 3.8mm;
}

.planeswalker-ability-cost-minus {
	background-image: url("../assets/img/planeswalker/LoyaltyMinus.png");
	height: 4.7mm;
	line-height: 3.8mm;
}

.planeswalker-ability-cost::after {
	content: ":";
	position: absolute;
	right: -0.7mm;
	top: 50%;
	transform: translateY(-50%);
	color: black;
	font-family: MPlantin;
	font-size: 8pt;
}

.planeswalker-ability-cost-minus::after {
	top: 1.7mm;
}

.planeswalker-ability-cost-zero::after {
	top: 1.7mm;
}

.planeswalker .footer {
	top: 82.2mm;
}

.oracle-inner,
.oracle-flavor,
.oracle-reminder {
	margin: 0 0.44mm;
}

.oracle-flavor hr {
	border: 0;
	height: 0.25mm;
	background-image: linear-gradient(
		to right,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0.2) 20%,
		rgba(0, 0, 0, 0.2) 80%,
		rgba(0, 0, 0, 0)
	);
	margin-top: 0.2mm;
	margin-bottom: 0.8mm;
}

.oracle-flavor,
:deep(.oracle-reminder) {
	font-family: MPlantin-Italic;
	font-style: italic;
}

.pt-box {
	position: absolute;
	right: 3mm;
	bottom: 5.2mm;
	width: 11.58mm;
	height: 6.176mm;
	background-image: v-bind(pt_box);
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 5.5mm;
	font-size: 9.6pt;
	color: v-bind(pt_box_color);

	pointer-events: initial;
	user-select: initial;

	z-index: 3;
}

.loyalty {
	position: absolute;
	right: 3mm;
	bottom: 5mm;
	width: 9.8mm;
	height: 5.8mm;
	background-image: url("../assets/img/planeswalker/Loyalty.png");
	background-size: 100% 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 6.6mm;
	font-size: 9.5pt;
	color: white;

	pointer-events: initial;
	user-select: initial;
	z-index: 3;
}

.footer {
	position: absolute;
	top: 81.5mm;
	left: 50%;
	transform: translateX(-50%);

	width: 55mm;
	margin: auto;

	display: flex;
	justify-content: space-between;
	color: white;
	font-family: Relay Medium;
	font-size: 1.5mm;
	font-size: 4.5pt;

	z-index: 3;
}

.footer-left > div,
.footer-right > div {
	height: 1.8mm;
}

.collector-number {
	letter-spacing: 0.2mm;
}

.copyright {
	font-family: MPlantin;
	margin-top: 0.3mm; /* FIXME: Workaround a weird upshift using this font */
}

.copyright div {
	min-height: 2mm;
}

.set,
.language {
	letter-spacing: 0.15mm;
}

.artist-icon {
	font-family: NDPMTG;
}

.artist-name {
	font-family: Beleren Small Caps;
}

.flip-icon {
	position: absolute;
	bottom: -12mm;
	left: 50%;
	font-size: 10mm;
	user-select: none;
	cursor: pointer;
	transform: translateX(-50%) rotateX(60deg);
}

.mdfc:not(.planeswalker) .inner-frame {
	width: 57.8mm;
	left: 2.2mm;
}

.mdfc:not(.planeswalker) .legendary-crown {
	left: -0.6mm;
}

.mdfc:not(.planeswalker) .top-line,
.mdfc:not(.planeswalker) .mid-line {
	/* FIXME: This should apply to planeswalker, but MDFC-PL frames and boxes aren't done yet */
	margin-left: 1.8mm;
	color: v-bind(mdfc_text_color);
}

.mdfc .top-line .name {
	padding-left: 5mm;
}

.mdfc.legendary:not(.planeswalker) .inner-frame {
	/* Workdaround to hide frame behind the legendary crown */
	border-top-left-radius: 10mm;
}

.mdfc .normal-oracle {
	height: 22mm;
	left: 1mm;
}

.mdfc .planeswalker-oracle {
	height: 22mm;
}

.mdfc.planeswalker-large .planeswalker-oracle {
	height: 29mm;
}

.mdfc-icon {
	position: absolute;
	top: 4mm;
	left: 3mm;
	width: 6mm;
	aspect-ratio: calc(294 / 238);
	background-image: v-bind(mdfc_icon);
	background-size: 100%;
	z-index: 3;
}

.planeswalker .mdfc-icon {
	top: 3mm;
}

.mdfc-hint {
	position: absolute;
	bottom: 7.5mm;
	left: 2.2mm;
	width: 28mm;
	height: 3.8mm;

	display: flex;
	justify-content: space-between;
	align-content: stretch;
	align-items: center;

	font-size: 5pt;
	color: v-bind(mdfc_hint_color);
	background-image: v-bind(mdfc_hint);
	background-size: 100%;

	padding: 0 2.6mm;
	padding-top: 0.1mm; /* FIXME: Shouldn't be needed? */

	box-sizing: border-box;
	z-index: 3;
}

.planeswalker .mdfc-hint {
	bottom: 6mm;
}

.mdfc-hint span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex-shrink: 1;
	max-width: 20mm;
}

.mdfc-hint .mana-cost {
	font-size: 4pt;
}

/* Transform */

.transform:not(.back):not(.planeswalker) .inner-frame {
	left: 3.34mm;
	width: 57.66mm;
}

.transform.back:not(.planeswalker) .inner-frame {
	left: 3.32mm;
	width: 56.7mm;
}

.transform .legendary-crown {
	left: -1.74mm;
}

.transform .top-line .name {
	padding-left: 5.2mm;
}

.transform:not(.back):not(.planeswalker) .top-line {
	margin-left: 0.6mm;
}

.transform:not(.back):not(.planeswalker) .mid-line {
	left: -0.7mm;
}

.transform.back:not(.planeswalker) .top-line {
	margin-left: 0.7mm;
}

.transform.back:not(.planeswalker) .mid-line {
	left: 0.3mm;
}

.transform-icon {
	position: absolute;
	top: 3.9mm;
	left: 3.7mm;
	width: 5.2mm;
	aspect-ratio: 1;
	border-radius: 50%;
	border: 0.02mm black solid; /* Fixme: Border is too thick on renders */
	box-sizing: border-box;
	background-color: white;
	background-image: v-bind(transform_icon);
	background-size: 4.6mm;
	background-position: center center;
	background-repeat: no-repeat;
	z-index: 3;
}

.planeswalker .transform-icon {
	top: 3mm;
}

.transform-hint {
	position: absolute;
	bottom: 12.5mm;
	right: 5.2mm;
	z-index: 3;
	font-family: Beleren;
	font-size: 6.5pt;
	color: #666;
}

/* Ixalan maps */

.compasslanddfc.back .legendary-crown {
	display: none;
}

.compasslanddfc.back .inner-frame {
	background-image: none;
	filter: none;
}

.compasslanddfc.back .name {
	font-family: Beleren Small Caps;
	padding: 0;
	margin: 0;
}

.compasslanddfc.back .illustration {
	top: 9.2mm;
	left: 3mm;
	right: 3mm;
	width: auto;
	height: 40mm;
}

.compasslanddfc.back .top-line,
.compasslanddfc.back .mid-line {
	background-image: none;
	justify-content: center;
	margin: 0;
	padding: 0;
	color: black;
	left: 0;
	right: 0;
	width: 100%;
}

.compasslanddfc.back .type-line {
	text-align: center;
}

.compasslanddfc.back .oracle {
	top: 52.4mm;
	left: 4.2mm;
	right: 4.2mm;
	bottom: 3mm;
	width: auto;
	height: auto;
}

.compasslanddfc.back .set-icon-container {
	position: absolute;
	top: -40.8mm;
	left: 50%;
	transform: translate(-50%);
	justify-content: center;
}

.compasslanddfc.back .transform-icon {
	display: none; /* Embeded in the background */
}

/* Extend art as much as possible when adding a bordering while rendering */

.rendering.extended-art .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) *
			(100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(
			v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		)
		calc(v-bind(illustration_position.y));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

.rendering.full-art .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	height: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) *
			(100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(
			v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		)
		calc(
			v-bind(illustration_position.y) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		);
	top: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	bottom: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

.debug-overlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	width: 63.5mm;
	height: 100%;
	opacity: v-bind(debug_opacity);
}

.debug-overlay:hover {
	opacity: 1;
}

.debug-overlay > div {
	overflow: hidden;
	position: relative;
	pointer-events: none;
}

.debug-overlay > div:after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	width: 0.5px;
	height: 100%;
	background-color: #0008;
}

.debug-overlay > div > img {
	width: 63.5mm;
}

.debug-controls {
	position: absolute;
	bottom: -4em;
}
</style>
