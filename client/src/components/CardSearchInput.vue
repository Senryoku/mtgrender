<template>
	<form @submit.prevent="handleSubmit" class="search-form">
		<div class="search-input-container">
			<div class="search-input-wrapper">
				<!-- Search Icon -->
				<div class="search-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.35-4.35"></path>
					</svg>
				</div>

				<!-- Input Field -->
				<input
					id="card-search-input"
					ref="inputRef"
					type="text"
					class="search-input"
					placeholder="Search for a card..."
					:value="searchCardName"
					@input="handleInput"
					@keydown="handleKeydown"
					autocomplete="off"
				/>

				<!-- Loading Spinner -->
				<div v-if="autocompleteStatus === 'updating'" class="search-spinner">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="spinner"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
				</div>

				<!-- Clear Button -->
				<button
					v-else-if="searchCardName"
					type="button"
					class="search-clear"
					@click="handleClear"
					title="Clear search"
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
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<!-- Autocomplete Dropdown -->
			<transition name="dropdown">
				<div
					v-if="autocompleteStatus && autocompleteStatus !== 'updating'"
					class="search-dropdown"
					@keydown="handleAutocompleteCycle"
				>
					<!-- Error State -->
					<div v-if="autocompleteStatus === 'error'" class="search-dropdown-message error">
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
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
						<span>An error occurred while searching</span>
					</div>

					<!-- Results -->
					<ul v-else-if="Array.isArray(autocompleteStatus) && autocompleteStatus.length > 0">
						<li
							v-for="(result, idx) in autocompleteStatus"
							:key="result"
							:tabindex="idx"
							class="search-dropdown-item"
							@click="handleSelectCard(result)"
							@keydown="handleAutocompleteCycle"
						>
							{{ result }}
						</li>
					</ul>

					<!-- Empty State -->
					<div
						v-else-if="Array.isArray(autocompleteStatus) && autocompleteStatus.length === 0"
						class="search-dropdown-message empty"
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
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
						<span>No cards found</span>
					</div>
				</div>
			</transition>
		</div>

		<!-- Submit Button -->
		<button type="submit" class="search-submit">
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
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			<span>Load from Scryfall</span>
		</button>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { AutocompleteStatus } from '../types/card';

const props = defineProps<{
	searchCardName: string;
	autocompleteStatus: AutocompleteStatus;
}>();

const emit = defineEmits<{
	'update:searchCardName': [value: string];
	autocomplete: [query: string];
	selectCard: [cardName: string];
	loadCard: [cardName: string];
	autocompleteKeydown: [event: KeyboardEvent];
	autocompleteCycle: [event: KeyboardEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:searchCardName', target.value);
	emit('autocomplete', target.value);
};

const handleSubmit = () => {
	emit('loadCard', props.searchCardName);
};

const handleSelectCard = (cardName: string) => {
	emit('selectCard', cardName);
	emit('loadCard', cardName);
};

const handleClear = () => {
	emit('update:searchCardName', '');
	emit('autocomplete', '');
	inputRef.value?.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
	emit('autocompleteKeydown', event);
};

const handleAutocompleteCycle = (event: KeyboardEvent) => {
	emit('autocompleteCycle', event);
};
</script>

<style scoped>
.search-form {
	display: flex;
	align-items: center;
	gap: var(--space-3);
}

.search-input-container {
	position: relative;
	flex: 1;
	max-width: 400px;
}

/* Input Wrapper */
.search-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.95);
	border: var(--border-2) solid rgba(255, 255, 255, 0.3);
	border-radius: var(--radius-lg);
	transition: var(--transition-colors), box-shadow var(--duration-base) var(--ease-in-out);
	height: var(--input-height-base);
}

.search-input-wrapper:hover {
	border-color: rgba(255, 255, 255, 0.5);
	background-color: white;
}

.search-input-wrapper:focus-within {
	border-color: white;
	background-color: white;
	box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

/* Search Icon */
.search-icon {
	position: absolute;
	left: var(--space-3);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-text-tertiary);
	pointer-events: none;
}

/* Input Field */
.search-input {
	flex: 1;
	width: 100%;
	padding: var(--input-padding-y) var(--input-padding-x);
	padding-left: calc(var(--space-3) + 24px);
	padding-right: calc(var(--space-3) + 28px);
	font-family: var(--font-sans);
	font-size: var(--text-base);
	line-height: var(--leading-normal);
	color: var(--color-text-primary);
	background-color: transparent;
	border: none;
	outline: none;
}

.search-input::placeholder {
	color: var(--color-text-tertiary);
}

/* Spinner */
.search-spinner {
	position: absolute;
	right: var(--space-3);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-primary-500);
}

.spinner {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Clear Button */
.search-clear {
	position: absolute;
	right: var(--space-3);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-1);
	background: transparent;
	border: none;
	border-radius: var(--radius-base);
	color: var(--color-text-tertiary);
	cursor: pointer;
	transition: var(--transition-colors);
}

.search-clear:hover {
	color: var(--color-text-primary);
	background-color: var(--color-gray-100);
}

.search-clear:active {
	transform: scale(0.95);
}

/* Dropdown */
.search-dropdown {
	position: absolute;
	top: calc(100% + var(--space-2));
	left: 0;
	right: 0;
	z-index: var(--z-dropdown);
	max-height: 300px;
	overflow-y: auto;
	background-color: white;
	border: var(--border-1) solid var(--color-border);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-dropdown);
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
	transition: opacity var(--duration-fast) var(--ease-out),
		transform var(--duration-fast) var(--ease-out);
}

.dropdown-enter-from {
	opacity: 0;
	transform: translateY(-8px);
}

.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

/* Dropdown List */
.search-dropdown ul {
	list-style: none;
	margin: 0;
	padding: var(--space-1);
}

/* Dropdown Items */
.search-dropdown-item {
	padding: var(--space-2) var(--space-3);
	cursor: pointer;
	color: var(--color-text-primary);
	border-radius: var(--radius-base);
	transition: var(--transition-colors);
	font-size: var(--text-sm);
}

.search-dropdown-item:hover,
.search-dropdown-item:focus,
.search-dropdown-item:focus-visible {
	background-color: var(--color-primary-50);
	color: var(--color-primary-700);
	outline: none;
}

/* Dropdown Messages (error, empty) */
.search-dropdown-message {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	padding: var(--space-4);
	font-size: var(--text-sm);
	color: var(--color-text-secondary);
}

.search-dropdown-message.error {
	color: var(--color-error);
}

.search-dropdown-message.empty {
	color: var(--color-text-tertiary);
}

/* Scrollbar styling */
.search-dropdown::-webkit-scrollbar {
	width: 8px;
}

.search-dropdown::-webkit-scrollbar-track {
	background: transparent;
}

.search-dropdown::-webkit-scrollbar-thumb {
	background-color: var(--color-gray-300);
	border-radius: var(--radius-full);
}

.search-dropdown::-webkit-scrollbar-thumb:hover {
	background-color: var(--color-gray-400);
}

/* Submit Button */
.search-submit {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	padding: var(--space-2) var(--space-4);
	font-family: var(--font-sans);
	font-size: var(--text-sm);
	font-weight: var(--font-medium);
	color: var(--color-text-inverse);
	background: rgba(255, 255, 255, 0.2);
	border: var(--border-2) solid rgba(255, 255, 255, 0.3);
	border-radius: var(--radius-lg);
	cursor: pointer;
	transition: var(--transition-colors), transform var(--duration-fast) var(--ease-out);
	white-space: nowrap;
}

.search-submit:hover {
	background: rgba(255, 255, 255, 0.3);
	border-color: rgba(255, 255, 255, 0.5);
}

.search-submit:active {
	transform: translateY(1px);
}

.search-submit svg {
	flex-shrink: 0;
}
</style>
