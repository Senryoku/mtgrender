<template>
	<div
		:class="[
			'combobox-wrapper',
			`combobox-wrapper--${size}`,
			{
				'combobox-wrapper--error': error,
				'combobox-wrapper--success': success,
				'combobox-wrapper--disabled': disabled,
				'combobox-wrapper--open': isOpen,
			},
		]"
		ref="comboboxRef"
	>
		<div class="combobox-input-wrapper">
			<input
				:class="['combobox-input', `combobox-input--${size}`]"
				type="text"
				:value="modelValue"
				:placeholder="placeholder"
				:disabled="disabled"
				:readonly="readonly"
				@input="handleInput"
				@focus="handleFocus"
				@blur="handleBlur"
				@keydown="handleKeydown"
				ref="inputRef"
				role="combobox"
				:aria-expanded="isOpen"
				:aria-controls="dropdownId"
				:aria-activedescendant="activeOptionId"
			/>
			<div class="combobox-icon">
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
					:style="{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</div>

		<transition name="combobox-dropdown">
			<div
				v-show="isOpen && filteredOptions.length > 0"
				:class="['combobox-dropdown', `combobox-dropdown--${dropdownPosition}`]"
				:id="dropdownId"
				role="listbox"
				ref="dropdownRef"
			>
				<div
					v-for="(option, index) in filteredOptions"
					:key="option.value"
					:class="[
						'combobox-option',
						{
							'combobox-option--active': index === activeIndex,
							'combobox-option--selected': option.value === modelValue,
						},
					]"
					:id="`${dropdownId}-option-${index}`"
					role="option"
					:aria-selected="option.value === modelValue"
					@click="selectOption(option)"
					@mouseenter="activeIndex = index"
				>
					<div class="combobox-option-label">
						{{ option.label }}
					</div>
					<svg
						v-if="option.value === modelValue"
						class="combobox-option-check"
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
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	options: {
		type: Array,
		required: true,
		validator: (options) => {
			return options.every((opt) => {
				if (typeof opt === 'string') return true;
				return opt.hasOwnProperty('value') && opt.hasOwnProperty('label');
			});
		},
	},
	placeholder: {
		type: String,
		default: 'Rechercher...',
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
	error: {
		type: Boolean,
		default: false,
	},
	success: {
		type: Boolean,
		default: false,
	},
	filterMode: {
		type: String,
		default: 'contains',
		validator: (value) => ['contains', 'startsWith', 'exact'].includes(value),
	},
	caseSensitive: {
		type: Boolean,
		default: false,
	},
	dropdownPosition: {
		type: String,
		default: 'bottom',
		validator: (value) => ['bottom', 'top'].includes(value),
	},
	allowCustomValue: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus', 'select']);

const comboboxRef = ref(null);
const inputRef = ref(null);
const dropdownRef = ref(null);
const isOpen = ref(false);
const activeIndex = ref(-1);

// Normalize options to {value, label} format
const normalizedOptions = computed(() => {
	return props.options.map((opt) => {
		if (typeof opt === 'string') {
			return { value: opt, label: opt };
		}
		return opt;
	});
});

// Filter options based on input value
const filteredOptions = computed(() => {
	const inputValue = props.modelValue?.toString() || '';

	if (!inputValue && isOpen.value) {
		return normalizedOptions.value;
	}

	const filterValue = props.caseSensitive ? inputValue : inputValue.toLowerCase();

	return normalizedOptions.value.filter((option) => {
		const optionLabel = props.caseSensitive ? option.label : option.label.toLowerCase();

		switch (props.filterMode) {
			case 'startsWith':
				return optionLabel.startsWith(filterValue);
			case 'exact':
				return optionLabel === filterValue;
			case 'contains':
			default:
				return optionLabel.includes(filterValue);
		}
	});
});

const dropdownId = computed(() => `combobox-dropdown-${Math.random().toString(36).substr(2, 9)}`);

const activeOptionId = computed(() => {
	if (activeIndex.value >= 0) {
		return `${dropdownId.value}-option-${activeIndex.value}`;
	}
	return undefined;
});

const handleInput = (event) => {
	const value = event.target.value;
	emit('update:modelValue', value);
	isOpen.value = true;
	activeIndex.value = -1;
};

const handleFocus = (event) => {
	if (!props.readonly && !props.disabled) {
		isOpen.value = true;
	}
	emit('focus', event);
};

const handleBlur = (event) => {
	// Delay to allow click on option
	setTimeout(() => {
		isOpen.value = false;
		activeIndex.value = -1;
	}, 200);
	emit('blur', event);
};

const handleKeydown = (event) => {
	if (props.readonly || props.disabled) return;

	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			if (!isOpen.value) {
				isOpen.value = true;
			} else {
				activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1);
			}
			break;

		case 'ArrowUp':
			event.preventDefault();
			if (activeIndex.value > 0) {
				activeIndex.value--;
			}
			break;

		case 'Enter':
			event.preventDefault();
			if (isOpen.value && activeIndex.value >= 0) {
				selectOption(filteredOptions.value[activeIndex.value]);
			} else if (!props.allowCustomValue) {
				// If custom values not allowed, select first match
				if (filteredOptions.value.length > 0) {
					selectOption(filteredOptions.value[0]);
				}
			}
			break;

		case 'Escape':
			event.preventDefault();
			isOpen.value = false;
			activeIndex.value = -1;
			inputRef.value?.blur();
			break;

		case 'Tab':
			isOpen.value = false;
			activeIndex.value = -1;
			break;
	}
};

const selectOption = (option) => {
	emit('update:modelValue', option.value);
	emit('change', option.value);
	emit('select', option);
	isOpen.value = false;
	activeIndex.value = -1;
	inputRef.value?.blur();
};

const focus = () => {
	inputRef.value?.focus();
};

const blur = () => {
	inputRef.value?.blur();
};

// Click outside to close
const handleClickOutside = (event) => {
	if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
		isOpen.value = false;
		activeIndex.value = -1;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});

// Watch activeIndex to scroll into view
watch(activeIndex, (newIndex) => {
	if (newIndex >= 0 && dropdownRef.value) {
		const activeOption = dropdownRef.value.children[newIndex];
		if (activeOption) {
			activeOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}
	}
});

defineExpose({
	focus,
	blur,
	inputRef,
});
</script>

<style scoped>
.combobox-wrapper {
	position: relative;
	display: inline-flex;
	width: 100%;
}

.combobox-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	background-color: var(--color-background);
	border: var(--input-border-width) solid var(--color-border);
	border-radius: var(--radius-lg);
	transition: var(--transition-colors);
}

.combobox-wrapper:hover:not(.combobox-wrapper--disabled) .combobox-input-wrapper {
	border-color: var(--color-border-hover);
}

.combobox-wrapper--open .combobox-input-wrapper,
.combobox-input-wrapper:focus-within:not(.combobox-wrapper--disabled .combobox-input-wrapper) {
	border-color: var(--color-primary-500);
	box-shadow: var(--input-focus-ring);
}

/* Error state */
.combobox-wrapper--error .combobox-input-wrapper {
	border-color: var(--color-error);
}

.combobox-wrapper--error .combobox-input-wrapper:focus-within {
	border-color: var(--color-error);
	box-shadow: 0 0 0 3px var(--color-error-light);
}

/* Success state */
.combobox-wrapper--success .combobox-input-wrapper {
	border-color: var(--color-success);
}

/* Disabled state */
.combobox-wrapper--disabled .combobox-input-wrapper {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--color-gray-50);
}

/* Sizes */
.combobox-wrapper--sm .combobox-input-wrapper {
	height: var(--input-height-sm);
}

.combobox-wrapper--base .combobox-input-wrapper {
	height: var(--input-height-base);
}

.combobox-wrapper--lg .combobox-input-wrapper {
	height: var(--input-height-lg);
}

/* Input */
.combobox-input {
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
}

.combobox-input::placeholder {
	color: var(--color-text-tertiary);
}

.combobox-input:disabled {
	cursor: not-allowed;
}

.combobox-input--sm {
	padding: calc(var(--input-padding-y) * 0.75) var(--input-padding-x);
	padding-right: calc(var(--input-padding-x) + 2rem);
	font-size: var(--text-sm);
}

.combobox-input--lg {
	padding: calc(var(--input-padding-y) * 1.25) var(--input-padding-x);
	padding-right: calc(var(--input-padding-x) + 2rem);
	font-size: var(--text-lg);
}

/* Icon */
.combobox-icon {
	position: absolute;
	right: var(--input-padding-x);
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	color: var(--color-text-tertiary);
	transition: transform var(--duration-base) var(--ease-in-out);
}

/* Dropdown */
.combobox-dropdown {
	position: absolute;
	left: 0;
	right: 0;
	z-index: var(--z-dropdown);
	max-height: 16rem;
	margin-top: var(--space-1);
	overflow-y: auto;
	background-color: var(--color-background);
	border: var(--border-1) solid var(--color-border);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-dropdown);
}

.combobox-dropdown--bottom {
	top: 100%;
}

.combobox-dropdown--top {
	bottom: 100%;
	margin-top: 0;
	margin-bottom: var(--space-1);
}

/* Dropdown transitions */
.combobox-dropdown-enter-active,
.combobox-dropdown-leave-active {
	transition: opacity var(--duration-fast) var(--ease-out),
		transform var(--duration-fast) var(--ease-out);
}

.combobox-dropdown-enter-from {
	opacity: 0;
	transform: translateY(-4px);
}

.combobox-dropdown--top.combobox-dropdown-enter-from {
	transform: translateY(4px);
}

.combobox-dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

.combobox-dropdown--top.combobox-dropdown-leave-to {
	transform: translateY(4px);
}

/* Options */
.combobox-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-2);
	padding: var(--space-2) var(--space-3);
	cursor: pointer;
	transition: var(--transition-colors);
}

.combobox-option:first-child {
	border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.combobox-option:last-child {
	border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.combobox-option:hover,
.combobox-option--active {
	background-color: var(--color-primary-50);
	color: var(--color-primary-700);
}

.combobox-option--selected {
	background-color: var(--color-primary-100);
	color: var(--color-primary-800);
	font-weight: var(--font-medium);
}

.combobox-option-label {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.combobox-option-check {
	flex-shrink: 0;
	color: var(--color-primary-600);
}

/* Scrollbar styling */
.combobox-dropdown::-webkit-scrollbar {
	width: 8px;
}

.combobox-dropdown::-webkit-scrollbar-track {
	background: transparent;
}

.combobox-dropdown::-webkit-scrollbar-thumb {
	background-color: var(--color-gray-300);
	border-radius: var(--radius-full);
}

.combobox-dropdown::-webkit-scrollbar-thumb:hover {
	background-color: var(--color-gray-400);
}
</style>
