<template>
	<div class="oracle normal-oracle levelup-oracle" ref="oracle_el">
		<div
			class="oracle-levelup-inner"
			v-for="(level, idx) in levels"
			:key="idx"
			:style="'background-color: ' + level.color + ';'"
			@dblclick="emit('edit-property', 'oracle_text')"
			@mousedown.prevent=""
		>
			<div class="level-box" v-if="level.level">
				<LevelBoxBackground :box-color="level.box_color" />
				<div>{{ level.level_text }}</div>
				<div>{{ level.level }}</div>
			</div>
			<div
				class="oracle-text"
				:class="{
					'has-level': level.level,
					'has-pt': level.power,
				}"
			>
				<div
					class="oracle-inner"
					v-for="line in level.oracle_lines"
					v-html="line"
				></div>
			</div>
			<div v-if="level.power" class="pt-box">
				{{ level.power }}/{{ level.toughness }}
			</div>
		</div>
		<div
			class="oracle-flavor"
			v-if="cardFace?.flavor_text"
			@dblclick="emit('edit-property', 'flavor_text')"
			@mousedown.prevent=""
		>
			<hr />
			{{ cardFace.flavor_text }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LevelBoxBackground from './LevelBoxBackground.vue';

interface Level {
	color: string;
	box_color?: string;
	level_text?: string;
	level?: string | number;
	oracle_lines: string[];
	power?: string;
	toughness?: string;
}

defineProps<{
	levels: Level[];
	cardFace: any;
}>();

const emit = defineEmits<{
	'edit-property': [property: string];
}>();

const oracle_el = ref<HTMLElement | null>(null);

defineExpose({
	oracle_el,
});
</script>
