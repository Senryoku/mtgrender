<template>
	<button
		:class="[
			'btn',
			`btn--${variant}`,
			`btn--${size}`,
			{
				'btn--loading': loading,
				'btn--disabled': disabled,
				'btn--icon-only': iconOnly,
			},
		]"
		:disabled="disabled || loading"
		:type="type"
		@click="$emit('click', $event)"
	>
		<span v-if="loading" class="btn__spinner">
			<svg
				class="btn__spinner-icon"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="btn__spinner-track"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="btn__spinner-path"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</span>
		<span v-if="!loading" class="btn__content">
			<slot></slot>
		</span>
	</button>
</template>

<script setup>
defineProps({
	variant: {
		type: String,
		default: 'primary',
		validator: (value) => ['primary', 'secondary', 'ghost', 'danger', 'success'].includes(value),
	},
	size: {
		type: String,
		default: 'base',
		validator: (value) => ['sm', 'base', 'lg'].includes(value),
	},
	loading: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		default: 'button',
		validator: (value) => ['button', 'submit', 'reset'].includes(value),
	},
	iconOnly: {
		type: Boolean,
		default: false,
	},
});

defineEmits(['click']);
</script>

<style scoped>
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
	font-family: var(--font-sans);
	font-weight: var(--font-medium);
	line-height: var(--leading-tight);
	text-align: center;
	border: var(--border-1) solid transparent;
	border-radius: var(--radius-lg);
	cursor: pointer;
	transition: var(--transition-colors), var(--transition-transform);
	user-select: none;
	white-space: nowrap;
	outline: none;
}

.btn:focus-visible {
	box-shadow: var(--shadow-focus);
}

.btn:active:not(.btn--disabled):not(.btn--loading) {
	transform: scale(0.98);
}

/* Sizes */
.btn--sm {
	height: var(--button-height-sm);
	padding: 0 var(--button-padding-x-sm);
	font-size: var(--text-sm);
}

.btn--base {
	height: var(--button-height-base);
	padding: 0 var(--button-padding-x-base);
	font-size: var(--text-base);
}

.btn--lg {
	height: var(--button-height-lg);
	padding: 0 var(--button-padding-x-lg);
	font-size: var(--text-lg);
}

.btn--icon-only {
	aspect-ratio: 1;
	padding: 0;
}

/* Variants */

/* Primary */
.btn--primary {
	background-color: var(--color-primary-500);
	border-color: var(--color-primary-500);
	color: var(--color-text-inverse);
}

.btn--primary:hover:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-primary-600);
	border-color: var(--color-primary-600);
}

.btn--primary:active:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-primary-700);
	border-color: var(--color-primary-700);
}

/* Secondary */
.btn--secondary {
	background-color: var(--color-gray-100);
	border-color: var(--color-border);
	color: var(--color-text-primary);
}

.btn--secondary:hover:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-gray-200);
	border-color: var(--color-border-hover);
}

.btn--secondary:active:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-gray-300);
}

/* Ghost */
.btn--ghost {
	background-color: transparent;
	border-color: transparent;
	color: var(--color-text-secondary);
}

.btn--ghost:hover:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-gray-100);
	color: var(--color-text-primary);
}

.btn--ghost:active:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-gray-200);
}

/* Danger */
.btn--danger {
	background-color: var(--color-error);
	border-color: var(--color-error);
	color: var(--color-text-inverse);
}

.btn--danger:hover:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-error-dark);
	border-color: var(--color-error-dark);
}

.btn--danger:active:not(.btn--disabled):not(.btn--loading) {
	background-color: #b91c1c;
}

/* Success */
.btn--success {
	background-color: var(--color-success);
	border-color: var(--color-success);
	color: var(--color-text-inverse);
}

.btn--success:hover:not(.btn--disabled):not(.btn--loading) {
	background-color: var(--color-success-dark);
	border-color: var(--color-success-dark);
}

.btn--success:active:not(.btn--disabled):not(.btn--loading) {
	background-color: #15803d;
}

/* States */
.btn--disabled,
.btn--loading {
	opacity: 0.6;
	cursor: not-allowed;
	pointer-events: none;
}

/* Spinner */
.btn__spinner {
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn__spinner-icon {
	width: 1em;
	height: 1em;
	animation: spin 1s linear infinite;
}

.btn__spinner-track {
	opacity: 0.25;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.btn__content {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-2);
}
</style>
