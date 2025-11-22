<template>
	<div :class="['accordion-item', { 'accordion-item--open': isItemOpen }]">
		<button
			type="button"
			class="accordion-item__header"
			:aria-expanded="isItemOpen"
			@click="handleToggle"
		>
			<div class="accordion-item__title">
				<slot name="title">{{ title }}</slot>
			</div>
			<div class="accordion-item__icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					:style="{ transform: isItemOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</button>
		<transition
			name="accordion-content"
			@before-enter="beforeEnter"
			@enter="enter"
			@after-enter="afterEnter"
			@before-leave="beforeLeave"
			@leave="leave"
			@after-leave="afterLeave"
		>
			<div v-show="isItemOpen" class="accordion-item__content-wrapper">
				<div class="accordion-item__content">
					<slot></slot>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { inject, computed, onMounted } from 'vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: '',
	},
	defaultOpen: {
		type: Boolean,
		default: false,
	},
});

const accordion = inject('accordion');

const isItemOpen = computed(() => {
	return accordion ? accordion.isOpen(props.id) : false;
});

const handleToggle = () => {
	if (accordion) {
		accordion.toggle(props.id);
	}
};

// Auto-open if defaultOpen is true
onMounted(() => {
	if (props.defaultOpen && accordion && !isItemOpen.value) {
		accordion.toggle(props.id);
	}
});

// Transition hooks for smooth height animation
const beforeEnter = (el) => {
	el.style.height = '0';
};

const enter = (el) => {
	el.style.height = `${el.scrollHeight}px`;
};

const afterEnter = (el) => {
	el.style.height = 'auto';
};

const beforeLeave = (el) => {
	el.style.height = `${el.scrollHeight}px`;
};

const leave = (el) => {
	// Force reflow
	el.offsetHeight;
	el.style.height = '0';
};

const afterLeave = (el) => {
	el.style.height = 'auto';
};
</script>

<style scoped>
.accordion-item {
	background-color: var(--color-background);
}

.accordion-item__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: var(--accordion-padding);
	font-family: var(--font-sans);
	font-size: var(--text-base);
	font-weight: var(--font-medium);
	color: var(--color-text-primary);
	background-color: transparent;
	border: none;
	cursor: pointer;
	text-align: left;
	transition: var(--transition-colors);
}

.accordion-item__header:hover {
	background-color: var(--color-gray-50);
}

.accordion-item__header:focus-visible {
	outline: 2px solid var(--color-primary-500);
	outline-offset: -2px;
}

.accordion-item__title {
	flex: 1;
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.accordion-item__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: var(--space-2);
	color: var(--color-text-tertiary);
	transition: transform var(--duration-base) var(--ease-in-out);
}

.accordion-item--open .accordion-item__header {
	background-color: var(--color-gray-50);
}

.accordion-item__content-wrapper {
	overflow: hidden;
	transition: height var(--duration-base) var(--ease-in-out);
}

.accordion-item__content {
	padding: 0 var(--accordion-padding) var(--accordion-padding);
}

/* Transition classes */
.accordion-content-enter-active,
.accordion-content-leave-active {
	transition: height var(--duration-base) var(--ease-in-out);
}

.accordion-content-enter-from,
.accordion-content-leave-to {
	height: 0;
}
</style>
