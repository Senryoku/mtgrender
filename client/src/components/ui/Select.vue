<template>
	<div
		:class="[
			'select-wrapper',
			`select-wrapper--${size}`,
			{
				'select-wrapper--error': error,
				'select-wrapper--success': success,
				'select-wrapper--disabled': disabled,
			},
		]"
	>
		<select
			:class="['select', `select--${size}`]"
			:value="modelValue"
			:disabled="disabled"
			:required="required"
			@change="handleChange"
			@blur="$emit('blur', $event)"
			@focus="$emit('focus', $event)"
			ref="selectRef"
		>
			<option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
				:disabled="option.disabled"
			>
				{{ option.label }}
			</option>
		</select>
		<div class="select__icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	modelValue: {
		type: [String, Number, Boolean],
		default: '',
	},
	options: {
		type: Array,
		required: true,
		validator: (options) => {
			return options.every((opt) => opt.hasOwnProperty('value') && opt.hasOwnProperty('label'));
		},
	},
	placeholder: {
		type: String,
		default: '',
	},
	size: {
		type: String,
		default: 'base',
		validator: (value) => ['sm', 'base', 'lg'].includes(value),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	required: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
	success: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus']);

const selectRef = ref(null);

const handleChange = (event) => {
	const value = event.target.value;
	emit('update:modelValue', value);
	emit('change', value);
};

const focus = () => {
	selectRef.value?.focus();
};

const blur = () => {
	selectRef.value?.blur();
};

defineExpose({
	focus,
	blur,
	selectRef,
});
</script>

<style scoped>
.select-wrapper {
	position: relative;
	display: inline-flex;
	align-items: center;
	width: 100%;
	background-color: var(--color-background);
	border: var(--input-border-width) solid var(--color-border);
	border-radius: var(--radius-lg);
	transition: var(--transition-colors);
}

.select-wrapper:hover:not(.select-wrapper--disabled) {
	border-color: var(--color-border-hover);
}

.select-wrapper:focus-within:not(.select-wrapper--disabled) {
	border-color: var(--color-primary-500);
	box-shadow: var(--input-focus-ring);
}

/* Error state */
.select-wrapper--error {
	border-color: var(--color-error);
}

.select-wrapper--error:focus-within {
	border-color: var(--color-error);
	box-shadow: 0 0 0 3px var(--color-error-light);
}

/* Success state */
.select-wrapper--success {
	border-color: var(--color-success);
}

.select-wrapper--success:focus-within {
	border-color: var(--color-success);
	box-shadow: 0 0 0 3px var(--color-success-light);
}

/* Disabled state */
.select-wrapper--disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--color-gray-50);
}

/* Sizes */
.select-wrapper--sm {
	height: var(--input-height-sm);
}

.select-wrapper--base {
	height: var(--input-height-base);
}

.select-wrapper--lg {
	height: var(--input-height-lg);
}

/* Select element */
.select {
	flex: 1;
	width: 100%;
	min-width: 0;
	padding: var(--input-padding-y) var(--input-padding-x);
	padding-right: calc(var(--input-padding-x) + 2rem);
	font-family: var(--font-sans);
	font-size: var(--text-base);
	line-height: var(--leading-normal);
	color: var(--color-text-primary);
	background-color: transparent;
	border: none;
	outline: none;
	appearance: none;
	cursor: pointer;
}

.select:disabled {
	cursor: not-allowed;
}

.select--sm {
	padding: calc(var(--input-padding-y) * 0.75) var(--input-padding-x);
	padding-right: calc(var(--input-padding-x) + 2rem);
	font-size: var(--text-sm);
}

.select--lg {
	padding: calc(var(--input-padding-y) * 1.25) var(--input-padding-x);
	padding-right: calc(var(--input-padding-x) + 2rem);
	font-size: var(--text-lg);
}

/* Chevron icon */
.select__icon {
	position: absolute;
	right: var(--input-padding-x);
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	color: var(--color-text-tertiary);
}

.select-wrapper--disabled .select__icon {
	color: var(--color-text-tertiary);
}

/* Option styling (limited browser support) */
.select option {
	padding: var(--space-2);
	background-color: var(--color-background);
	color: var(--color-text-primary);
}

.select option:disabled {
	color: var(--color-text-tertiary);
}
</style>
