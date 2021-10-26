<template>
	<div
		class="mtg-card"
		:class="{
			legendary: is_legendary,
			planeswalker: is_planeswalker,
			saga: is_saga,
		}"
	>
		<div class="inner-background">
			<div class="inner-frame">
				<div
					class="legendary-crown"
					v-show="is_legendary && !is_planeswalker"
				></div>
				<div class="top-line">
					<span
						class="name"
						@dblclick.prevent="edit_property('name')"
						@mousedown.prevent=""
						>{{ cardFace.name }}</span
					>
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
					<div
						class="type-line"
						@dblclick="edit_property('type_line')"
						@mousedown.prevent=""
						ref="type_line_el"
					>
						{{ cardFace.type_line }}
					</div>
					<span class="set-icon">
						<i
							v-if="card.set"
							class="ss ss-grad"
							:class="`ss-${card.set} ss-${card.rarity}`"
						></i>
					</span>
				</div>
				<template v-if="is_saga">
					<div
						class="saga-oracle"
						ref="oracle_el"
						@dblclick="edit_property('oracle_text')"
						@mousedown.prevent=""
					>
						<div
							class="saga-reminder"
							v-if="saga_reminder"
							v-html="saga_reminder"
						></div>
						<div class="saga-frame"></div>
						<div class="saga-steps">
							<div
								class="saga-step"
								v-for="(step, idx) in saga_steps"
								:key="idx"
							>
								<div class="saga-step-number">
									<img v-for="step in step.steps" :key="step" :src="step" />
								</div>
								<div v-html="step.html"></div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="planeswalker_abilities">
					<div class="planeswalker-oracle" ref="oracle_el">
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
					<div class="oracle" ref="oracle_el">
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
							v-if="cardFace.flavor_text"
							@dblclick="edit_property('flavor_text')"
							@mousedown.prevent=""
						>
							<hr />
							{{ cardFace.flavor_text }}
						</div>
					</div>
				</template>
			</div>
			<div class="pt-box" v-show="cardFace.power || cardFace.toughness">
				<span @dblclick="edit_property('power')" @mousedown.prevent="">{{
					cardFace.power
				}}</span
				>/<span @dblclick="edit_property('toughness')" @mousedown.prevent=""
					>{{ cardFace.toughness }}
				</span>
			</div>
			<div class="loyalty" v-show="cardFace.loyalty">
				{{ cardFace.loyalty }}
			</div>
		</div>
		<div class="footer">
			<div class="footer-left">
				<div
					class="collector-number"
					@dblclick="edit_property('collector_number')"
					@mousedown.prevent=""
				>
					{{ cardFace.collector_number }}
				</div>
				<div>
					<span v-if="card.set" class="set"
						>{{ card.set.toUpperCase() }}&nbsp;</span
					>
					<span v-if="card.set && card.lang" class="set">•&nbsp;</span>
					<span v-if="card.lang" class="language"
						>{{ card.lang.toUpperCase() }}&nbsp;</span
					>
					<span class="artist-icon">a </span>
					<span
						class="artist-name"
						@dblclick="edit_property('artist')"
						@mousedown.prevent=""
						>{{ card.artist }}</span
					>
				</div>
			</div>
			<div class="footer-right">
				<div v-if="cardFace.power || cardFace.toughness || cardFace.loyalty">
					&nbsp;
				</div>
				<div class="copyright">{{ copyright }}</div>
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
		<div v-if="card.card_faces" class="flip-icon" @click="flip">⭯</div>
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

function check_overflow(el) {
	const curOverflow = el.style.overflow;

	if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

	const isOverflowing =
		el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
	el.style.overflow = curOverflow;

	return isOverflowing;
}

export default {
	name: "MTGCard",
	props: {
		card: Object,
		scale: Number,
	},
	data() {
		const oracle_el = ref(null);
		const type_line_el = ref(null);
		return {
			oracle_el,
			type_line_el,
			currentFace: 0,
			dragging_illustration: null,
		};
	},
	methods: {
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
			const r = prompt(`Edit Card property '${prop}'`, this.card[prop]);
			if (r) this.$emit("edit", prop, r);
		},
		scale_illustration(event) {
			let s = 1;
			if (this.cardFace.illustration_scale)
				s = this.cardFace.illustration_scale;
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
			if (!this.cardFace.illustration_position)
				this.$emit(
					"edit",
					this.card.card_faces
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					{ x: 0, y: 0 }
				);
			this.dragging_illustration = {
				x: this.cardFace.illustration_position.x,
				y: this.cardFace.illustration_position.y,
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
							this.cardFace.illustration_position.x +
							(this.mmperpixel * event.movementX) / this.scale,
						y:
							this.cardFace.illustration_position.y +
							(this.mmperpixel * event.movementY) / this.scale,
					}
				);
			}
		},
		fit_name() {},
		fit_type_line() {
			if (!this.$refs.type_line_el) return;
			// Make sure type fits in its box
			nextTick(() => {
				let curr_font_size = 8;
				this.$refs.type_line_el.style.fontSize = curr_font_size + "pt";
				while (check_overflow(this.$refs.type_line_el) && curr_font_size > 3) {
					curr_font_size *= 0.9;
					this.$refs.type_line_el.style.fontSize = curr_font_size + "pt";
				}
			});
		},
		fit_oracle_text() {
			if (!this.$refs.oracle_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				let curr_font_size = 8;
				this.$refs.oracle_el.style.fontSize = curr_font_size + "pt";
				while (check_overflow(this.$refs.oracle_el) && curr_font_size > 3) {
					curr_font_size *= 0.9;
					this.$refs.oracle_el.style.fontSize = curr_font_size + "pt";
				}
			});
		},
		flip() {
			this.currentFace = (this.currentFace + 1) % 2;
			this.fit_name();
			this.fit_oracle_text();
			this.fit_type_line();
		},
	},
	computed: {
		mmperpixel() {
			return 63.5 / this.$el.clientWidth;
		},
		cardFace() {
			if (this.card.card_faces) return this.card.card_faces[this.currentFace];
			return this.card;
		},
		is_legendary() {
			return this.cardFace?.type_line?.startsWith("Legendary") ? true : false;
		},
		is_planeswalker() {
			return this.cardFace?.type_line?.toLowerCase().includes("planeswalker");
		},
		is_saga() {
			return (
				this.cardFace?.layout === "saga" ||
				this.cardFace?.type_line?.toLowerCase().includes("saga")
			);
		},
		is_vehicle() {
			if (!this.card?.type_line) return false;
			return (
				this.cardFace.type_line.includes("Vehicle") ||
				this.cardFace.type_line.includes("véhicule")
			);
		},
		mana_cost() {
			if (!this.card?.mana_cost) return [];
			return [...this.card.mana_cost.matchAll(mana_regex)].map(
				(m) => mana_symbols[m[0]].svg_uri
			);
		},
		oracle_lines() {
			if (!this.cardFace?.oracle_text) return [];
			return this.cardFace.oracle_text.split("\n").map(this.parse_oracle);
		},
		saga_reminder() {
			if (!this.cardFace?.oracle_text) return "";
			return this.parse_oracle(this.cardFace.oracle_text.split("\n")[0]);
		},
		saga_steps() {
			return this.cardFace.oracle_text
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
			return this.cardFace.oracle_text
				.split("\n")
				.map(this.parse_oracle)
				.map((line) => {
					const r = { html: line, cost: null };
					const m = line.match(/^[+-−]?(\d+):/);
					console.log(m);
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
			if (
				this.cardFace?.colors === undefined &&
				this.cardFace?.color_identity === undefined &&
				this.cardFace?.mana_cost === undefined
			)
				return "Colourless";
			const colors = this.cardFace?.colors
				? this.cardFace?.colors
				: this.cardFace?.color_identity
				? this.cardFace?.color_identity
				: [...this.cardFace.mana_cost].filter((c) => "WUBRG".includes(c));
			const sorted_colors = [...new Set(colors)]
				.sort((l: string, r: string) => {
					return "WUBRG".indexOf(l) - "WUBRG".indexOf(r);
				})
				.join("");
			// TODO: Correctly handle dual mana cost (bi-colored border)
			return this.cardFace.type_line.includes("Artifact") ||
				this.cardFace.type_line.includes("Artefact")
				? "Artifact"
				: sorted_colors.length === 0
				? "Colourless"
				: sorted_colors.length > 2
				? "Gold"
				: sorted_colors;
		},
		boxes_colors() {
			return this.colors === "Vehicle"
				? "Artifact"
				: this.colors.length > 1 && this.colors.length < 5
				? "Gold"
				: this.colors;
		},
		background() {
			if (this.is_saga) {
				return `url(${
					new URL(
						`../assets/img/saga_bg/${
							this.is_vehicle ? "Vehicle" : this.boxes_colors
						}.png`,
						import.meta.url
					).href
				})`;
			}
			return `url(${
				new URL(
					`../assets/img/bg/${
						this.is_vehicle ? "Vehicle" : this.boxes_colors
					}.png`,
					import.meta.url
				).href
			})`;
		},
		frame() {
			if (this.is_saga) {
				return `url(${
					new URL(
						`../assets/img/saga_frames/${this.colors}.png`,
						import.meta.url
					).href
				})`;
			}
			if (this.is_planeswalker) {
				return `url(${
					new URL(
						`../assets/img/planeswalker_frames/${this.colors}.png`,
						import.meta.url
					).href
				})`;
			}
			return `url(${
				new URL(`../assets/img/frames/${this.colors}.png`, import.meta.url).href
			})`;
		},
		boxes() {
			if (this.is_planeswalker) {
				return `url(${
					new URL(
						`../assets/img/planeswalker_boxes/${this.boxes_colors}.png`,
						import.meta.url
					).href
				})`;
			}
			return `url(${
				new URL(`../assets/img/boxes/${this.boxes_colors}.png`, import.meta.url)
					.href
			})`;
		},
		legendary_crown() {
			return `url(${
				new URL(
					`../assets/img/legendary_crowns/${this.colors}.png`,
					import.meta.url
				).href
			})`;
		},
		pt_box() {
			return `url(${
				new URL(
					`../assets/img/pt_boxes/${
						this.is_vehicle ? "Vehicle" : this.boxes_colors
					}.png`,
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
		pt_box_color() {
			return this.is_vehicle ? "white" : "black";
		},
		illustration() {
			return `url(${this.cardFace?.image_uris?.art_crop})`;
		},
		illustration_scale() {
			return this.cardFace?.illustration_scale ?? 1;
		},
		illustration_position() {
			return this.cardFace?.illustration_position
				? {
						x: this.cardFace?.illustration_position.x + "mm",
						y: this.cardFace?.illustration_position.y + "mm",
				  }
				: { x: 0, y: 0 };
		},
	},
	watch: {
		"card.oracle_text": function () {
			this.fit_oracle_text();
		},
		"card.type_line": function () {
			this.fit_type_line();
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
	position: relative;
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

.planeswalker .inner-background {
	/* FIXME: This is workaround, the background are not fit for the planeswalker frame,
	          it hides the obvious problems, but we should use custom backgrounds instead.  */
	background-size: 100% 102%;
	border-bottom-left-radius: 7mm 7mm;
}

.legendary .inner-background {
	background-position: 0 -1.1mm;
	margin-top: 1.1mm;
	padding-top: 0;
}

.inner-frame {
	margin: auto;
	width: calc(58mm * 0.97482);
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

.legendary .inner-frame {
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black);
}

.saga .inner-frame {
	margin: 0;
	width: 100%;
	margin-left: -0.5mm;
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

.legendary-crown {
	position: absolute;
	left: -2mm;
	top: -7.5px;
	width: 60.2mm;
	height: 100%;
	background-image: v-bind(legendary_crown);
	background-size: 100%;
	background-repeat: no-repeat;
	z-index: -1;
}

.top-line,
.mid-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 5.1mm;
	margin: 0 0.5mm;
	padding: 0 1mm 0 1.5mm;
	background-image: v-bind(boxes);
	background-size: 100%;

	pointer-events: initial;
	user-select: initial;
}

.saga .top-line,
.saga .mid-line {
	width: 53mm;
	margin-left: 2mm;
}

.planeswalker .mid-line {
	margin-top: 1.3mm;
}

.name {
	font-size: 9.454pt;
}

.mana-cost {
	font-size: 6.5pt;
	display: flex;
	gap: 0.3mm;
}

.mana-cost .ms {
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
}

.planeswalker .illustration {
	position: absolute;
	left: 5mm;
	top: 10mm;
	width: 53.2mm;
	height: 39mm;
	border-radius: 2mm/50%;
}

.planeswalker .illustration.behind-textbox {
	background-color: white;
	height: 70.5mm;
	border-radius: 2mm / calc(39mm / 2);
	border-bottom-left-radius: 2mm/2mm;
	border-bottom-right-radius: 0;
}

.saga .illustration {
	width: 26.5mm;
	height: 64mm;
	top: 10mm;
	left: 32.2mm;
}

.mid-line {
	position: absolute;
	top: 45.8mm;
	left: 0mm;
	right: 0;
	background-position: 0 bottom;
}

.planeswalker .mid-line {
	position: absolute;
	top: 45.1mm;
	left: 0mm;
	right: 0;
}

.saga .mid-line {
	position: absolute;
	top: 71mm;
	left: 0mm;
	right: 0;
}

.type-line {
	font-size: 8pt;
	height: 5mm;
	line-height: 5mm;
}

.set-icon {
	font-size: 4mm;
}

.set-icon i {
	margin-top: -0.6mm;
	margin-right: 0.6mm;
}

.oracle {
	position: absolute;
	top: 51mm;
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
	margin-top: 0.8mm;

	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

.saga-oracle {
	height: 63.8mm;
	position: absolute;
	left: 2.8mm;
	top: 6.35mm;
	width: 27mm;
	background-size: 100%;
	background-image: v-bind(saga_text_box);

	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

.planeswalker-oracle-bg {
	position: absolute;
	left: 4.4mm;
	top: 52mm;
	width: 50.7mm;
	height: 25.45mm;
	background-color: #ffffff80;
	border-radius: 1.1mm;
	border-bottom-left-radius: 8mm 2.1mm;
	border-bottom-right-radius: 8mm 2.1mm;
	box-shadow: inset -0.2mm -0.2mm 0.2mm #00000080,
		inset 0.2mm 0.2mm 0.2mm #00000080;
}

.planeswalker-oracle {
	position: absolute;
	left: 0;
	top: 52mm;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;

	width: 49mm;
	height: 24mm;

	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	padding: 0.5mm;
	padding-left: 5.5mm;
	padding-bottom: 1mm;

	pointer-events: initial;
	user-select: initial;
}

.saga-reminder {
	height: 12mm;
	font-size: 7.3pt;
	line-height: 7.3pt;
	padding: 2mm 1mm;
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

.oracle:deep(.ms),
.saga-oracle:deep(.ms) {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: middle;
}

.planeswalker-ability {
	position: relative;
}

.planeswalker-ability-with-cost {
	margin-left: 2.5mm;
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
	line-height: 5.2mm;
}

.planeswalker-ability-cost-zero {
	background-image: url("../assets/img/planeswalker/LoyaltyZero.png");
	height: 4.2mm;
	line-height: 4.2mm;
}

.planeswalker-ability-cost-minus {
	background-image: url("../assets/img/planeswalker/LoyaltyMinus.png");
	height: 4.7mm;
	line-height: 3.9mm;
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
	top: 1mm;
}

.planeswalker-ability-cost-zero::after {
	top: 1.7mm;
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
	right: 0;
	bottom: -2.5mm;
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
}

.loyalty {
	position: absolute;
	right: 0;
	bottom: -2.8mm;
	width: 10mm;
	height: 7mm;
	background-image: url("../assets/img/planeswalker/Loyalty.png");
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 7mm;
	font-size: 9.6pt;
	color: white;

	pointer-events: initial;
	user-select: initial;
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
	transform: translateX(-50%);
	font-size: 10mm;
}
</style>
