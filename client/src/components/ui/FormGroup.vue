<template>
	<div :class="['form-group', { 'form-group--error': error, 'form-group--required': required }]">
		<label v-if="label || $slots.label" :for="inputId" class="form-group__label">
			<slot name="label">{{ label }}</slot>
			<span v-if="required" class="form-group__required" aria-label="required">*</span>
			<span
				v-if="tooltip"
				class="form-group__tooltip"
				:title="tooltip"
				:aria-label="tooltip"
				role="tooltip"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
					<line x1="12" y1="17" x2="12.01" y2="17"></line>
				</svg>
			</span>
		</label>

		<div v-if="hint && !error" class="form-group__hint">
			{{ hint }}
		</div>

		<div class="form-group__control">
			<slot></slot>
		</div>

		<transition name="form-group-message">
			<div v-if="error && errorMessage" class="form-group__error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
				<span>{{ errorMessage }}</span>
			</div>
		</transition>

		<transition name="form-group-message">
			<div v-if="success && successMessage" class="form-group__success">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<path d="m9 12 2 2 4-4"></path>
				</svg>
				<span>{{ successMessage }}</span>
			</div>
		</transition>
	</div>
</template>

<script setup>
const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	hint: {
		type: String,
		default: '',
	},
	tooltip: {
		type: String,
		default: '',
	},
	inputId: {
		type: String,
		default: undefined,
	},
	required: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
	errorMessage: {
		type: String,
		default: '',
	},
	success: {
		type: Boolean,
		default: false,
	},
	successMessage: {
		type: String,
		default: '',
	},
});
</script>

<style scoped>
.form-group {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	width: 100%;
}

.form-group__label {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	font-family: var(--font-sans);
	font-size: var(--text-sm);
	font-weight: var(--font-medium);
	color: var(--color-text-primary);
	line-height: var(--leading-tight);
	cursor: pointer;
	user-select: none;
}

.form-group__required {
	color: var(--color-error);
	margin-left: var(--space-1);
}

.form-group__tooltip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--color-text-tertiary);
	cursor: help;
	transition: var(--transition-colors);
}

.form-group__tooltip:hover {
	color: var(--color-primary-500);
}

.form-group__hint {
	font-size: var(--text-xs);
	color: var(--color-text-tertiary);
	line-height: var(--leading-normal);
	margin-top: calc(var(--space-2) * -1);
}

.form-group__control {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.form-group__error,
.form-group__success {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	font-size: var(--text-xs);
	line-height: var(--leading-tight);
}

.form-group__error {
	color: var(--color-error);
}

.form-group__success {
	color: var(--color-success);
}

/* Transition animations */
.form-group-message-enter-active,
.form-group-message-leave-active {
	transition: all var(--duration-base) var(--ease-in-out);
}

.form-group-message-enter-from {
	opacity: 0;
	transform: translateY(-4px);
}

.form-group-message-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
