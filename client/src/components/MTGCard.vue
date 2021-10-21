<template>
	<div class="mtg-card" :class="{ legendary: is_legendary }">
		<div class="inner-background">
			<div class="inner-frame">
				<div class="legendary-crown" v-show="is_legendary"></div>
				<div class="top-line">
					<span class="name">{{ card.name }}</span>
					<div class="mana-cost">
						<img
							v-for="(uri, idx) in mana_cost"
							class="ms ms-shadow"
							:key="idx"
							:src="uri"
						/>
					</div>
				</div>
				<div class="illustration"></div>
				<div class="mid-line">
					<span class="type-line">{{ card.type_line }}</span>
					<span class="set-icon"></span>
				</div>
				<div class="oracle" ref="oracle_el">
					<div
						class="oracle-inner"
						v-for="(line, idx) in oracle_lines"
						:key="idx"
						v-html="line"
					></div>
					<div class="oracle-flavor" v-if="card.flavor_text">
						{{ card.flavor_text }}
					</div>
				</div>
			</div>
			<div class="pt-box" v-show="card.power || card.toughness">
				{{ card.power }}/{{ card.toughness }}
			</div>
		</div>
		<div class="footer">
			<div class="footer-left">
				<div class="collector-number">{{ card.collector_number }}/???</div>
				<div>
					<span class="artist-icon">a </span
					><span class="artist-name">{{ card.artist }}</span>
				</div>
			</div>
			<div class="copyright">
				<div>&nbsp;</div>
				<div>Custom Proxy</div>
			</div>
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

function check_overflow(el) {
	var curOverflow = el.style.overflow;

	if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

	var isOverflowing =
		el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

	el.style.overflow = curOverflow;

	return isOverflowing;
}

export default {
	name: "MTGCard",
	props: {
		card: Object,
	},
	data() {
		const oracle_el = ref(null);
		return { oracle_el };
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
	},
	computed: {
		is_legendary() {
			return this.card?.type_line?.startsWith("Legendary") ? true : false;
		},
		mana_cost() {
			if (!this.card?.mana_cost) return [];
			return [...this.card.mana_cost.matchAll(mana_regex)].map(
				(m) => mana_symbols[m[0]].svg_uri
			);
		},
		oracle_lines() {
			if (!this.card?.oracle_text) return [];
			return this.card.oracle_text.split("\n").map(this.parse_oracle);
		},
		colors() {
			if (!this.card?.colors) return "B";
			const colors = this.card.colors
				.sort((l: string, r: string) => {
					return "WUBRG".indexOf(l) - "WUBRG".indexOf(r);
				})
				.join("");
			// TODO: Correctly handle dual mana cost (bi-colored border)
			return this.card.type_line.includes("Artifact")
				? "Artifact"
				: this.card.type_line.includes("Vehicule")
				? "Vehicule"
				: colors.length === 0
				? "Colorless"
				: colors.length > 2
				? "Gold"
				: colors;
		},
		boxes_colors() {
			return this.colors.length > 1 ? "Gold" : this.colors;
		},
		background() {
			return `url(${
				new URL(`../assets/img/bg/${this.colors}.png`, import.meta.url).href
			})`;
		},
		frame() {
			return `url(${
				new URL(`../assets/img/frames/${this.colors}.png`, import.meta.url).href
			})`;
		},
		boxes() {
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
					`../assets/img/pt_boxes/${this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		illustration() {
			return `url(${this.card?.image_uris?.art_crop})`;
		},
	},
	watch: {
		"card.oracle_text": function (newVal, oldVal) {
			if (!this.$refs.oracle_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				let curr_font_size = 8;
				while (check_overflow(this.$refs.oracle_el) && curr_font_size > 3) {
					curr_font_size *= 0.9;
					this.$refs.oracle_el.style.fontSize = curr_font_size + "pt";
				}
			});
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
	src: url("../assets/fonts/mplantin.ttf") format("truetype");
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
	box-sizing: border-box;
}

.inner-background {
	width: 58mm;
	height: 78mm;
	margin: auto;
	border-radius: 0.75mm 0.75mm 4mm 4mm;
	overflow-y: visible;
	background-image: v-bind(background);
	background-size: 100%;
	padding-top: 1.1mm;
	background-repeat: no-repeat;
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
}

.legendary .inner-frame {
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black);
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
	width: 53.5mm;
	height: 39mm;
	margin: auto;
	margin-top: 0.51mm;
	margin-bottom: 0.55mm;
	background-image: v-bind(illustration);
	background-color: yellow;
	background-size: 100%;
}

.mid-line {
	background-position: 0 bottom;
}

.type-line {
	font-size: 8pt;
}

.oracle {
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
}

.oracle ::v-deep .ms {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: middle;
}

.oracle-inner,
.oracle-flavor,
.oracle-reminder {
	margin: 0 0.44mm;
}

.oracle-flavor,
::v-deep .oracle-reminder {
	font-family: MPlantin-Italic;
}

.pt-box {
	position: absolute;
	right: 3mm;
	bottom: 5.5mm;
	width: 11.58mm;
	height: 6.176mm;
	background-image: v-bind(pt_box);
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	/*align-items: center;*/
	line-height: 5.5mm;
	font-size: 9.6pt;
}

.footer {
	width: 55mm;
	margin: auto;
	margin-top: 0;

	display: flex;
	justify-content: space-between;
	color: white;
	font-size: 1.5mm;
}

.collector-number {
	font-family: Relay Medium;
	letter-spacing: 0.2mm;
}

.copyright {
	font-family: MPlantin;
}

.copyright div {
}

.artist-icon {
	font-family: NDPMTG;
}

.artist-name {
	font-family: Beleren Small Caps;
}
</style>
