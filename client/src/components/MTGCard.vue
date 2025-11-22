<template>
	<div
		ref="cardEl"
		class="mtg-card"
		:class="cardClasses"
	>
		<div class="inner-background"></div>
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
		<div class="planeswalker-oracle-bg" v-if="is_planeswalker"></div>
		<div class="inner-frame">
			<ArchiveFrame v-if="artVariant === 'archive'" />
		</div>
		<LegendaryCrown :visible="has_legendary_crown" />
		<CardTopLine
			ref="topLineRef"
			:cardFace="card_face"
			:manaCostSymbols="mana_cost"
			@edit-property="edit_property"
		/>
		<CardMidLine
			ref="midLineRef"
			:cardFace="card_face"
			:setIconUri="set_icon_uri"
			:colorIndicatorUri="color_indicator"
			@edit-property="edit_property"
		/>
		<template
			v-if="is_adventure && card.card_faces && card.card_faces.length > 1"
		>
			<AdventureLayout
				ref="oracle_el"
				:mainFace="card.card_faces[0]"
				:adventureFace="card.card_faces[1]"
				:mainOracleLines="oracle_lines"
				:adventureOracleLines="adventure_oracle_lines"
				:adventureManaCostSymbols="adventure_mana_cost"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_saga">
			<SagaLayout
				ref="oracle_el"
				:sagaReminder="saga_reminder"
				:sagaSteps="saga_steps"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_class">
			<ClassLayout
				ref="oracle_el"
				:classReminder="class_reminder"
				:classSteps="class_steps"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="planeswalker_abilities">
			<PlaneswalkerLayout
				ref="oracle_el"
				:planeswalkerAbilities="planeswalker_abilities"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_levelup">
			<LevelupLayout
				ref="oracle_el"
				:levels="levels"
				:cardFace="card_face"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else>
			<NormalOracleLayout
				ref="oracle_el"
				:cardFace="card_face"
				:oracleLines="oracle_lines"
				@edit-property="edit_property"
			/>
		</template>
		<PTBox
			:cardFace="card_face"
			:isLevelup="is_levelup"
			@edit-property="edit_property"
		/>
		<LoyaltyBox
			:cardFace="card_face"
			@edit-property="edit_property"
		/>
		<CardFooter
			:card="card"
			:cardFace="card_face"
			:copyright="copyright"
			:isAdventure="is_adventure"
			@edit-property="edit_property"
		/>
		<MDFCIndicators
			:isMdfc="is_mdfc"
			:hintText="mdfc_hint_text"
			:backManaCostSymbols="mdfc_back_mana_cost"
		/>
		<TransformIndicators
			:isTransform="is_transform"
			:currentFace="currentFace"
			:backFace="back_face"
		/>
		<div v-if="is_dualfaced" class="flip-icon" @click="flip">⭯</div>
		<div
			v-if="isDevelopment && displayDebugValue && debugImageUri"
			class="debug-overlay"
			@mousemove="updateDebugOverlay"
			@mouseleave="updateDebugOverlay"
		>
			<div>
				<img :src="debugImageUri" />
			</div>
		</div>

		<svg class="svg" height="0" width="0">
			<clipPath id="full-art-clip-path" clipPathUnits="objectBoundingBox">
				<path
					d="M0,0 H1 V0.745 C1,0.745,0.993,0.829,0.935,0.884 V0.925 H0.065 V0.884 C0.03,0.842,0.015,0.832,0,0.745 Z"
				></path>
			</clipPath>
			<clipPath
				id="full-art-planeswalker-clip-path"
				clipPathUnits="objectBoundingBox"
			>
				<path
					d="M 0 0 H 1 V 0.745 C 1 0.745 0.993 0.829 0.935 0.884 L 0.912 0.911 H 0.09 L 0.065 0.884 C 0.03 0.842 0.015 0.832 0 0.745 Z"
				></path>
			</clipPath>
		</svg>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUpdated } from 'vue';

// Components imports
import ArchiveFrame from './card/ArchiveFrame.vue';
import LegendaryCrown from './card/LegendaryCrown.vue';
import PTBox from './card/PTBox.vue';
import LoyaltyBox from './card/LoyaltyBox.vue';
import TransformIndicators from './card/TransformIndicators.vue';
import MDFCIndicators from './card/MDFCIndicators.vue';
import CardTopLine from './card/CardTopLine.vue';
import CardMidLine from './card/CardMidLine.vue';
import CardFooter from './card/CardFooter.vue';
import NormalOracleLayout from './card/NormalOracleLayout.vue';
import AdventureLayout from './card/AdventureLayout.vue';
import SagaLayout from './card/SagaLayout.vue';
import ClassLayout from './card/ClassLayout.vue';
import PlaneswalkerLayout from './card/PlaneswalkerLayout.vue';
import LevelupLayout from './card/LevelupLayout.vue';

// Composables imports
import { useOracleParser } from '../composables/useOracleParser';
import { useCardColors, computeCardColors } from '../composables/useCardColors';
import { useCardTransform } from '../composables/useCardTransform';
import { useCardTypes } from '../composables/useCardTypes';
import { useCardTypeSpecifics } from '../composables/useCardTypeSpecifics';
import { useCardAssets } from '../composables/useCardAssets';
import { useIllustration } from '../composables/useIllustration';
import { useTextFitting } from '../composables/useTextFitting';

// Props
const props = defineProps<{
	card: any;
	scale: number;
	renderMargin: number;
	displayDebug?: boolean;
	debugOpacity?: number;
}>();

// Emits
const emit = defineEmits<{
	edit: [key: string | string[], value: any];
}>();

// Refs
const cardEl = ref<HTMLElement | null>(null);
const topLineRef = ref<any>(null);
const midLineRef = ref<any>(null);
const oracle_el = ref<any>(null);
const currentFace = ref(0);

// Computed refs for composables
const card_computed = computed(() => props.card);
const scale_computed = computed(() => props.scale);

// Oracle parser
const { parse_oracle } = useOracleParser();

// Card transform (needs parse_oracle for oracle_lines)
const is_adventure_temp = computed(() => card_computed.value?.layout === 'adventure');
const {
	card_face,
	back_face,
	mana_cost,
	adventure_mana_cost,
	mdfc_back_mana_cost,
	mdfc_hint_text,
	oracle_lines,
	adventure_oracle_lines,
	copyright,
	color_indicator,
} = useCardTransform(card_computed, currentFace, is_adventure_temp, parse_oracle);

// Card types
const {
	is_land,
	is_legendary,
	has_legendary_crown,
	is_adventure,
	is_planeswalker,
	is_saga,
	is_class,
	is_vehicle,
	is_dualfaced,
	is_mdfc,
	is_transform,
	is_levelup,
} = useCardTypes(card_computed, card_face);

// Card colors (needs card types)
const {
	colors,
	boxes_colors,
	frame_colors,
	archive_frame_colors,
	japanese_color,
	japanese_name_color,
	japanese_type_line_border,
	japanese_oracle_border,
} = useCardColors(card_computed, card_face, is_land);

// Card type specifics (needs parse_oracle and other deps)
const {
	planeswalker_abilities,
	is_large_planeswalker,
	saga_reminder,
	saga_steps,
	class_reminder,
	class_steps,
	levels,
} = useCardTypeSpecifics(
	card_face,
	is_planeswalker,
	is_levelup,
	colors,
	frame_colors,
	parse_oracle
);

// Card assets
const {
	background,
	frame,
	boxes,
	mid_boxes,
	legendary_crown,
	pt_box,
	saga_text_box,
	mdfc_icon,
	mdfc_hint,
	transform_icon,
	set_icon_uri,
	illustration,
	illustration_scale,
	illustration_position,
	extended_art,
	top_line_color,
	mid_line_color,
	pt_box_color,
	mdfc_hint_color,
} = useCardAssets(
	card_computed,
	card_face,
	back_face,
	currentFace,
	colors,
	boxes_colors,
	is_adventure,
	is_planeswalker,
	is_large_planeswalker,
	is_saga,
	is_class,
	is_vehicle,
	is_mdfc,
	is_transform,
	computeCardColors
);

// Illustration
const {
	scale_illustration,
	start_drag_illustration,
	end_drag_illustration,
	cancel_drag_illustration,
	drag_illustration,
} = useIllustration(
	card_computed,
	card_face,
	currentFace,
	is_adventure,
	scale_computed,
	cardEl,
	emit
);

// Text fitting
const { fit, fit_name, fit_type_line, fit_oracle_text } = useTextFitting(
	topLineRef,
	midLineRef,
	oracle_el
);

// Debug overlay
const isDevelopment = import.meta.env.MODE === 'development';
const displayDebugValue = computed(() => props.displayDebug ?? false);
const debugOpacityValue = computed(() => props.debugOpacity ?? 0.5);

const debugImageUri = computed(() => {
	return card_computed.value?.image_uris?.png || card_face.value?.image_uris?.png;
});

const updateDebugOverlay = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	const firstChild = target.firstElementChild as HTMLElement;
	const parent = target.parentElement;

	if (event.type === 'mousemove' && parent && firstChild) {
		const rect = parent.getBoundingClientRect();
		firstChild.style.width = `${(event.clientX - rect.x) / scale_computed.value}px`;
	} else if (firstChild) {
		firstChild.style.width = '';
	}
};

// Computed styles for CSS (fixes v-bind() in calc() errors)
const illustrationBgSize = computed(() => `${illustration_scale.value * 100}%`);
const illustrationBgPosX = computed(() => illustration_position.value?.x || '50%');
const illustrationBgPosY = computed(() => illustration_position.value?.y || '50%');

// Extended art computed styles
const extendedArtMargin = computed(() => `${2 * props.renderMargin * props.scale}mm`);
const extendedArtOffset = computed(() => `${1 * props.renderMargin * props.scale}mm`);
const extendedArtNegativeOffset = computed(() => `${-1 * props.renderMargin * props.scale}mm`);

const extendedArtWidth = computed(() => `calc(100% + ${extendedArtMargin.value})`);
const extendedArtBgSize = computed(() =>
	`calc(${illustration_scale.value} * (100% - ${extendedArtMargin.value}))`
);
const extendedArtBgPosX = computed(() =>
	`calc(${illustrationBgPosX.value} + ${extendedArtOffset.value})`
);
const extendedArtBgPosY = computed(() =>
	`calc(${illustrationBgPosY.value})`
);

// Full art computed styles (same width/height/offset as extended art)
const fullArtBgPosX = computed(() =>
	`calc(${illustrationBgPosX.value} + ${extendedArtOffset.value})`
);
const fullArtBgPosY = computed(() =>
	`calc(${illustrationBgPosY.value} + ${extendedArtOffset.value})`
);

// Frame colors (fixes CSS parser issues with dot notation in v-bind)
const frameColorLeft = computed(() => frame_colors.value.left);
const frameColorRight = computed(() => frame_colors.value.right);

// Computed for class bindings
const activeCardForArt = computed(() =>
	is_adventure.value ? props.card : card_face.value
);

const artVariant = computed(() => activeCardForArt.value?.art_variant);

const cardClasses = computed(() => ({
	mdfc: is_mdfc.value,
	transform: is_transform.value,
	back: currentFace.value === 1,
	legendary: is_legendary.value,
	'has-legendary-crown': has_legendary_crown.value,
	planeswalker: is_planeswalker.value,
	'planeswalker-large': is_large_planeswalker.value,
	saga: is_saga.value,
	class: is_class.value,
	adventure: is_adventure.value,
	'extended-art': artVariant.value === 'extended',
	'full-art': ['full', 'full-footer', 'archive', 'japanese-archive'].includes(
		artVariant.value || ''
	),
	'full-footer': ['full-footer', 'japanese-archive'].includes(
		artVariant.value || ''
	),
	archive: artVariant.value === 'archive',
	'japanese-archive': artVariant.value === 'japanese-archive',
	compasslanddfc: props.card.frame_effects?.includes('compasslanddfc'),
}));

// Methods
const set_face = (idx: number) => {
	currentFace.value = idx;
};

const edit_property = (prop: string) => {
	const r = prompt(`Edit Card property '${prop}'`, card_face.value?.[prop]);
	if (r)
		emit(
			'edit',
			props.card.card_faces && !is_adventure.value
				? ['card_faces', String(currentFace.value), prop]
				: prop,
			r
		);
};

const flip = () => {
	currentFace.value = (currentFace.value + 1) % 2;
	fit_name();
	fit_oracle_text();
	fit_type_line();
};

// Lifecycle
onUpdated(() => {
	fit();
});

// Watchers - consolidated for better performance
watch(
	() => props.card,
	(newCard, oldCard) => {
		if (newCard?.oracle_text !== oldCard?.oracle_text) {
			fit_oracle_text();
		}
		if (newCard?.type_line !== oldCard?.type_line) {
			fit_type_line();
		}
		if (newCard?.card_faces !== oldCard?.card_faces) {
			fit();
		}
	},
	{ deep: false }
);

// Define expose for external usage if needed
defineExpose({
	set_face,
});
</script>

<style type="text/css">
@import url("../card.css");

/* CSS Custom Properties for maintainability */
.mtg-card {
	/* Card dimensions */
	--card-width: 63.5mm;
	--card-inner-width: 58.5mm;
	--card-inner-height: 78mm;

	/* Illustration */
	--illustration-top: 9.55mm;
	--illustration-left: 4.4mm;
	--illustration-width: 54.7mm;
	--illustration-height: 39.9mm;

	/* Spacing */
	--spacing-xs: 0.4mm;
	--spacing-sm: 0.6mm;
	--spacing-md: 1mm;
	--spacing-lg: 2mm;
	--spacing-xl: 3mm;

	/* Border radius */
	--radius-sm: 0.75mm;
	--radius-md: 1mm;
	--radius-lg: 1.5mm;
	--radius-xl: 4mm;

	/* Positions */
	--top-line-top: 4mm;
	--mid-line-top: 49.9mm;
	--pt-box-bottom: 3.8mm;
	--pt-box-right: 3mm;

	/* Common sizes */
	--border-thin: 0.22mm;
	--border-thick: 0.6mm;
	--mana-symbol-width: 4.2mm;

	/* Colors */
	--color-white: #fff;
	--color-white-alpha: #ffffffa0;
	--color-shadow: #0005;
	--color-bg-primary: #ecdfbf;
}

.original-name-left {
	stop-color: v-bind(frameColorLeft);
}

.original-name-right {
	stop-color: v-bind(frameColorRight);
}

.illustration {
	position: absolute;
	top: var(--illustration-top);
	left: var(--illustration-left);
	width: var(--illustration-width);
	height: var(--illustration-height);
	margin: auto;
	background-image: v-bind(illustration);
	background-color: yellow;
	background-size: v-bind(illustrationBgSize);
	background-position: v-bind(illustrationBgPosX) v-bind(illustrationBgPosY);
	background-repeat: no-repeat;
	cursor: grab;
}

.rendering.extended-art .illustration {
	width: v-bind(extendedArtWidth);
	background-size: v-bind(extendedArtBgSize);
	background-position: v-bind(extendedArtBgPosX) v-bind(extendedArtBgPosY);
	left: v-bind(extendedArtNegativeOffset);
	right: v-bind(extendedArtNegativeOffset);
}

.rendering.full-art:not(.full-footer):not(.japanese-archive) .illustration {
	width: v-bind(extendedArtWidth);
	height: v-bind(extendedArtWidth);
	background-size: v-bind(extendedArtBgSize);
	background-position: v-bind(fullArtBgPosX) v-bind(fullArtBgPosY);
	top: v-bind(extendedArtNegativeOffset);
	bottom: v-bind(extendedArtNegativeOffset);
	left: v-bind(extendedArtNegativeOffset);
	right: v-bind(extendedArtNegativeOffset);
}

.japanese-archive .name {
	background-color: v-bind(japanese_color);
	background-image: v-bind(japanese_name_color);
	color: var(--color-white);
	padding: var(--spacing-md) var(--spacing-lg);
	border-radius: var(--radius-lg);
	outline-style: solid;
	outline-color: v-bind(japanese_color);
	outline-width: var(--border-thick);
	outline-offset: var(--spacing-xs);
}

.japanese-archive .top-line .mana-cost .ms {
	width: var(--mana-symbol-width);
}

.japanese-archive .type-line,
.japanese-archive .oracle {
	background-color: var(--color-white-alpha);
	border: var(--border-thin) solid v-bind(japanese_color);
}

.japanese-archive .oracle {
	outline: var(--color-shadow);
	outline-width: 0.1mm;
	outline-offset: calc(-1 * var(--border-thick));
	outline-style: solid;
	padding: var(--spacing-xs) 0.8mm;
	box-sizing: border-box;

	border-image-source: v-bind(japanese_oracle_border);
	border-image-slice: 10%;
	border-image-width: var(--border-thin);
	border-image-repeat: round;
}

.japanese-archive .type-line {
	border-radius: var(--spacing-md) / 50%;
	position: absolute;
	left: var(--spacing-xs);
	padding: 0 var(--spacing-xl);
	height: var(--top-line-top);
	line-height: var(--top-line-top);
	max-width: 40mm;

	border-image-source: v-bind(japanese_type_line_border);
	border-image-slice: 50% 50%;
	border-image-width: 50% var(--radius-lg);
}

.full-footer .illustration,
.japanese-archive .illustration {
	background-color: #ffffff;
	clip-path: url(#full-art-clip-path);
}

.full-footer.planeswalker .illustration {
	clip-path: url(#full-art-planeswalker-clip-path);
}

.inner-background {
	position: absolute;
	left: calc((var(--card-width) - var(--card-inner-width)) / 2);
	width: var(--card-inner-width);
	height: var(--card-inner-height);
	margin: auto;
	border-radius: var(--radius-sm) var(--radius-sm) var(--radius-xl) var(--radius-xl);
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
	width: calc(var(--card-inner-width) * 0.98);
	top: 3.5mm;
	left: calc((var(--card-width) - var(--card-inner-width) * 0.98) / 2);
	height: 79mm;
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black)
		drop-shadow(0.1mm -0.2mm 0.1mm var(--color-white-alpha));
	background-image: v-bind(frame);
	background-size: 100%;
	background-repeat: no-repeat;

	pointer-events: none;
	user-select: none;
}

.legendary-crown {
	position: absolute;
	left: var(--spacing-md);
	top: var(--radius-lg);
	width: 61.1mm;
	height: 14mm;
	background-image: v-bind(legendary_crown);
	background-size: 100%;
	background-repeat: no-repeat;
}

.top-line,
.mid-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 5.1mm;
	width: 53.8mm;
	margin: auto;
	padding: 0 1mm 0 1.5mm;
	background-image: v-bind(boxes);
	background-size: 100%;

	pointer-events: initial;
	user-select: initial;
}

.top-line {
	position: absolute;
	top: 4mm;
	left: 0;
	right: 0;
	color: v-bind(top_line_color);
	gap: 1.5mm;
}

.original-name-bg-path {
	stroke: #000000;
	stroke-width: 0.01;
	fill: url(#gradient);
}

.mid-line {
	position: absolute;
	top: 49.9mm;
	left: 0;
	right: 0;
	background-position: 0 bottom;
	gap: 0.6mm;
	color: v-bind(mid_line_color);
	background-image: v-bind(mid_boxes);
}

.saga .saga-frame {
	position: absolute;
	top: 0;
	left: -2.8mm;
	width: 10mm;
	height: 100%;
	background-image: v-bind(frame);
	background-size: 58.5mm;
	background-position: 0 -6.3mm;
	background-repeat: no-repeat;
	pointer-events: none;
}

.saga-oracle {
	position: absolute;
	left: 4.9mm;
	top: 9.95mm;
	width: 26.6mm;
	height: 64.3mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.class-oracle {
	position: absolute;
	left: 31.8mm;
	top: 10.1mm;
	width: 26.4mm;
	height: 63.65mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.pt-box {
	position: absolute;
	right: 3mm;
	bottom: 3.8mm;
	width: 11.58mm;
	height: 6.2mm;
	background-image: v-bind(pt_box);
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 5.5mm;
	font-family: Beleren;
	font-size: 9.6pt;
	color: v-bind(pt_box_color);

	pointer-events: initial;
	user-select: initial;

	z-index: 3;
}

.mdfc-icon {
	position: absolute;
	top: 4.1mm;
	left: 2.5mm;
	width: 5.8mm;
	aspect-ratio: calc(294 / 238);
	background-image: v-bind(mdfc_icon);
	background-size: 100%;
	z-index: 3;
}

.mdfc-hint {
	position: absolute;
	bottom: 6.2mm;
	left: 1.6mm;
	width: 28mm;
	height: 3.9mm;

	display: flex;
	justify-content: space-between;
	align-content: stretch;
	align-items: center;

	font-size: 5pt;
	color: v-bind(mdfc_hint_color);
	background-image: v-bind(mdfc_hint);
	background-size: 100%;

	padding: 0 2.6mm;
	padding-top: 0.1mm;

	box-sizing: border-box;
	z-index: 3;
}

.transform-icon {
	position: absolute;
	top: 4mm;
	left: 3.5mm;
	width: 5.4mm;
	aspect-ratio: 1;
	border-radius: 50%;
	border: 0.02mm black solid;
	box-sizing: border-box;
	background-color: white;
	background-image: v-bind(transform_icon);
	background-size: 4.7mm;
	background-position: center center;
	background-repeat: no-repeat;
	z-index: 3;
}

.archive .inner-frame {
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	filter: none;
	background: none;

	--primary: v-bind(archive_frame_colors.primary);
	--lighter: v-bind(archive_frame_colors.lighter);
	--darker: v-bind(archive_frame_colors.darker);
	--left-primary: v-bind(archive_frame_colors.left.primary);
	--left-lighter: v-bind(archive_frame_colors.left.lighter);
	--left-darker: v-bind(archive_frame_colors.left.darker);
	--right-primary: v-bind(archive_frame_colors.right.primary);
	--right-lighter: v-bind(archive_frame_colors.right.lighter);
	--right-darker: v-bind(archive_frame_colors.right.darker);
}

/* Debug Overlay */
.debug-overlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	width: var(--card-width);
	height: 100%;
	opacity: v-bind(debugOpacityValue);
	pointer-events: none;
}

.debug-overlay img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.background-color {
	fill: var(--color-bg-primary);
	filter: url(#noise);
}
</style>

<style scoped>
.oracle:deep(.ms) {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: baseline;
}
</style>
