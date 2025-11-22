<template>
	<div>
		<div class="tabs">
			<div
				v-for="(tabName, idx) in tabs"
				:key="idx"
				@click="$emit('update:currentTab', idx)"
				class="tab"
				:class="{ 'selected-tab': currentTab === idx }"
			>
				{{ tabName }}
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	tabs: string[];
	currentTab: number;
}>();

defineEmits<{
	'update:currentTab': [index: number];
}>();
</script>
