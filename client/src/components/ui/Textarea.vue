<template>
	<div
		:class="[
			'textarea-wrapper',
			{
				'textarea-wrapper--error': error,
				'textarea-wrapper--success': success,
				'textarea-wrapper--disabled': disabled,
				'textarea-wrapper--auto-resize': autoResize,
			},
		]"
	>
		<textarea
			:class="['textarea', { 'textarea--auto-resize': autoResize }]"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			:rows="rows"
			:maxlength="maxlength"
			@input="handleInput"
			@blur="$emit('blur', $event)"
			@focus="$emit('focus', $event)"
			ref="textareaRef"
		></textarea>
		<div v-if="showCounter && maxlength" class="textarea__counter">
			{{ characterCount }}/{{ maxlength }}
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	rows: {
		type: Number,
		default: 3,
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
	maxlength: {
		type: [String, Number],
		default: undefined,
	},
	autoResize: {
		type: Boolean,
		default: false,
	},
	showCounter: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const textareaRef = ref(null);

const characterCount = computed(() => {
	return props.modelValue ? props.modelValue.length : 0;
});

const handleInput = (event) => {
	emit('update:modelValue', event.target.value);
	if (props.autoResize) {
		nextTick(() => {
			resizeTextarea();
		});
	}
};

const resizeTextarea = () => {
	if (!textareaRef.value || !props.autoResize) return;

	// Reset height to recalculate
	textareaRef.value.style.height = 'auto';

	// Set new height based on scrollHeight
	const newHeight = Math.max(textareaRef.value.scrollHeight, textareaRef.value.offsetHeight);
	textareaRef.value.style.height = `${newHeight}px`;
};

const focus = () => {
	textareaRef.value?.focus();
};

const blur = () => {
	textareaRef.value?.blur();
};

// Auto-resize on mount and value changes
onMounted(() => {
	if (props.autoResize) {
		nextTick(() => {
			resizeTextarea();
		});
	}
});

watch(
	() => props.modelValue,
	() => {
		if (props.autoResize) {
			nextTick(() => {
				resizeTextarea();
			});
		}
	}
);

defineExpose({
	focus,
	blur,
	textareaRef,
});
</script>

<style scoped>
.textarea-wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: var(--color-background);
	border: var(--input-border-width) solid var(--color-border);
	border-radius: var(--radius-lg);
	transition: var(--transition-colors);
}

.textarea-wrapper:hover:not(.textarea-wrapper--disabled) {
	border-color: var(--color-border-hover);
}

.textarea-wrapper:focus-within:not(.textarea-wrapper--disabled) {
	border-color: var(--color-primary-500);
	box-shadow: var(--input-focus-ring);
}

/* Error state */
.textarea-wrapper--error {
	border-color: var(--color-error);
}

.textarea-wrapper--error:focus-within {
	border-color: var(--color-error);
	box-shadow: 0 0 0 3px var(--color-error-light);
}

/* Success state */
.textarea-wrapper--success {
	border-color: var(--color-success);
}

.textarea-wrapper--success:focus-within {
	border-color: var(--color-success);
	box-shadow: 0 0 0 3px var(--color-success-light);
}

/* Disabled state */
.textarea-wrapper--disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--color-gray-50);
}

/* Textarea element */
.textarea {
	width: 100%;
	min-height: 4rem;
	padding: var(--input-padding-y) var(--input-padding-x);
	font-family: var(--font-sans);
	font-size: var(--text-base);
	line-height: var(--leading-normal);
	color: var(--color-text-primary);
	background-color: transparent;
	border: none;
	outline: none;
	resize: vertical;
	transition: height var(--duration-fast) var(--ease-out);
}

.textarea::placeholder {
	color: var(--color-text-tertiary);
}

.textarea:disabled {
	cursor: not-allowed;
	resize: none;
}

.textarea--auto-resize {
	resize: none;
	overflow-y: hidden;
}

/* Counter */
.textarea__counter {
	display: flex;
	justify-content: flex-end;
	padding: var(--space-1) var(--input-padding-x);
	padding-top: 0;
	font-size: var(--text-xs);
	color: var(--color-text-tertiary);
}

.textarea-wrapper--error .textarea__counter {
	color: var(--color-error);
}
</style>
