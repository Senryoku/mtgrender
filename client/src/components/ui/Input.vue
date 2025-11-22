<template>
	<div
		:class="[
			'input-wrapper',
			`input-wrapper--${size}`,
			{
				'input-wrapper--error': error,
				'input-wrapper--success': success,
				'input-wrapper--disabled': disabled,
				'input-wrapper--has-prefix': $slots.prefix,
				'input-wrapper--has-suffix': $slots.suffix || showClear,
			},
		]"
	>
		<div v-if="$slots.prefix" class="input__prefix">
			<slot name="prefix"></slot>
		</div>

		<input
			:type="type"
			:class="['input', `input--${size}`]"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			:autocomplete="autocomplete"
			:maxlength="maxlength"
			@input="handleInput"
			@blur="handleBlur"
			@focus="handleFocus"
			@keydown="$emit('keydown', $event)"
			@keyup="$emit('keyup', $event)"
			ref="inputRef"
		/>

		<div v-if="$slots.suffix || showClear" class="input__suffix">
			<button
				v-if="showClear && modelValue"
				type="button"
				class="input__clear"
				@click="handleClear"
				:aria-label="clearLabel"
			>
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
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
			</button>
			<slot name="suffix"></slot>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	type: {
		type: String,
		default: 'text',
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
	readonly: {
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
	autocomplete: {
		type: String,
		default: 'off',
	},
	maxlength: {
		type: [String, Number],
		default: undefined,
	},
	showClear: {
		type: Boolean,
		default: false,
	},
	clearLabel: {
		type: String,
		default: 'Clear input',
	},
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear', 'keydown', 'keyup']);

const inputRef = ref(null);

const handleInput = (event) => {
	emit('update:modelValue', event.target.value);
};

const handleBlur = (event) => {
	emit('blur', event);
};

const handleFocus = (event) => {
	emit('focus', event);
};

const handleClear = () => {
	emit('update:modelValue', '');
	emit('clear');
	inputRef.value?.focus();
};

const focus = () => {
	inputRef.value?.focus();
};

const blur = () => {
	inputRef.value?.blur();
};

defineExpose({
	focus,
	blur,
	inputRef,
});
</script>

<style scoped>
.input-wrapper {
	position: relative;
	display: inline-flex;
	align-items: center;
	width: 100%;
	background-color: var(--color-background);
	border: var(--input-border-width) solid var(--color-border);
	border-radius: var(--radius-lg);
	transition: var(--transition-colors);
}

.input-wrapper:hover:not(.input-wrapper--disabled) {
	border-color: var(--color-border-hover);
}

.input-wrapper:focus-within:not(.input-wrapper--disabled) {
	border-color: var(--color-primary-500);
	box-shadow: var(--input-focus-ring);
}

/* Error state */
.input-wrapper--error {
	border-color: var(--color-error);
}

.input-wrapper--error:focus-within {
	border-color: var(--color-error);
	box-shadow: 0 0 0 3px var(--color-error-light);
}

/* Success state */
.input-wrapper--success {
	border-color: var(--color-success);
}

.input-wrapper--success:focus-within {
	border-color: var(--color-success);
	box-shadow: 0 0 0 3px var(--color-success-light);
}

/* Disabled state */
.input-wrapper--disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--color-gray-50);
}

/* Sizes */
.input-wrapper--sm {
	height: var(--input-height-sm);
}

.input-wrapper--base {
	height: var(--input-height-base);
}

.input-wrapper--lg {
	height: var(--input-height-lg);
}

/* Input element */
.input {
	flex: 1;
	width: 100%;
	min-width: 0;
	padding: var(--input-padding-y) var(--input-padding-x);
	font-family: var(--font-sans);
	font-size: var(--text-base);
	line-height: var(--leading-normal);
	color: var(--color-text-primary);
	background-color: transparent;
	border: none;
	outline: none;
	appearance: none;
}

.input::placeholder {
	color: var(--color-text-tertiary);
}

.input:disabled {
	cursor: not-allowed;
}

.input--sm {
	padding: calc(var(--input-padding-y) * 0.75) var(--input-padding-x);
	font-size: var(--text-sm);
}

.input--lg {
	padding: calc(var(--input-padding-y) * 1.25) var(--input-padding-x);
	font-size: var(--text-lg);
}

/* Prefix and suffix */
.input__prefix,
.input__suffix {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	flex-shrink: 0;
	color: var(--color-text-tertiary);
}

.input__prefix {
	padding-left: var(--input-padding-x);
}

.input__suffix {
	padding-right: var(--input-padding-x);
}

.input-wrapper--has-prefix .input {
	padding-left: var(--space-2);
}

.input-wrapper--has-suffix .input {
	padding-right: var(--space-2);
}

/* Clear button */
.input__clear {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.25rem;
	height: 1.25rem;
	padding: 0;
	color: var(--color-text-tertiary);
	background-color: transparent;
	border: none;
	border-radius: var(--radius-base);
	cursor: pointer;
	transition: var(--transition-colors);
}

.input__clear:hover {
	color: var(--color-text-secondary);
	background-color: var(--color-gray-100);
}

.input__clear:active {
	color: var(--color-text-primary);
	background-color: var(--color-gray-200);
}
</style>
