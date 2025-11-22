<template>
	<div :class="['accordion', { 'accordion--bordered': bordered }]">
		<slot></slot>
	</div>
</template>

<script setup>
import { provide, ref } from 'vue';

const props = defineProps({
	modelValue: {
		type: [String, Array],
		default: () => [],
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	bordered: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue']);

const openItems = ref(
	Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
);

const toggle = (id) => {
	if (props.multiple) {
		// Multiple items can be open
		if (openItems.value.includes(id)) {
			openItems.value = openItems.value.filter((item) => item !== id);
		} else {
			openItems.value = [...openItems.value, id];
		}
		emit('update:modelValue', openItems.value);
	} else {
		// Only one item can be open
		if (openItems.value.includes(id)) {
			openItems.value = [];
			emit('update:modelValue', '');
		} else {
			openItems.value = [id];
			emit('update:modelValue', id);
		}
	}
};

const isOpen = (id) => {
	return openItems.value.includes(id);
};

// Provide methods to child items
provide('accordion', {
	toggle,
	isOpen,
});
</script>

<style scoped>
.accordion {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.accordion--bordered {
	border: var(--accordion-border-width) solid var(--color-border);
	border-radius: var(--radius-lg);
	overflow: hidden;
}

.accordion--bordered > :deep(.accordion-item:not(:last-child)) {
	border-bottom: var(--accordion-border-width) solid var(--color-border);
}
</style>
