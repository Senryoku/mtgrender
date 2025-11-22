<template>
	<header class="app-header">
		<!-- Logo Section -->
		<div class="header-logo">
			<h1>MTGRender</h1>
		</div>

		<!-- Actions Section -->
		<div class="header-actions">
			<!-- Primary Actions -->
			<div class="header-actions-primary">
				<button @click="$emit('newCard')" class="header-button" title="Create new card">
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
						<line x1="12" y1="8" x2="12" y2="16"></line>
						<line x1="8" y1="12" x2="16" y2="12"></line>
					</svg>
					<span>New Card</span>
				</button>

				<button @click="$emit('save')" class="header-button" title="Save current card (Ctrl+S)">
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
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
						<polyline points="17 21 17 13 7 13 7 21"></polyline>
						<polyline points="7 3 7 8 15 8"></polyline>
					</svg>
					<span>Save</span>
					<span class="header-shortcut">Ctrl+S</span>
				</button>
			</div>

			<!-- Search -->
			<div class="header-search">
				<slot name="search"></slot>
			</div>

			<!-- Render Action -->
			<button
				@click="$emit('render')"
				:disabled="rendering"
				class="header-button header-button--primary"
				title="Export card as PNG"
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
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
					<circle cx="8.5" cy="8.5" r="1.5"></circle>
					<polyline points="21 15 16 10 5 21"></polyline>
				</svg>
				<span>{{ rendering ? 'Rendering...' : 'Render to PNG' }}</span>
			</button>
		</div>

		<!-- Contact Section -->
		<div class="header-contact">
			<span class="header-contact-label">Contact:</span>
			<a href="https://senryoku.github.io" target="_blank" rel="noopener noreferrer">
				Senryoku
			</a>
			<a
				href="mailto:maretverdant@gmail.com"
				target="_blank"
				rel="noopener noreferrer"
				class="header-icon-link"
				title="Email"
			>
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
				>
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
					<polyline points="22,6 12,13 2,6"></polyline>
				</svg>
			</a>
			
			<!-- Contributors Section -->
			<div class="contributors-section">
				<span class="contributors-label">Contributors:</span>
				<div class="contributors-avatars">
					<a
						href="https://github.com/shadowner"
						target="_blank"
						rel="noopener noreferrer"
						class="contributor-link"
						title="shadowner"
					>
						<img 
							src="https://github.com/shadowner.png" 
							alt="shadowner" 
							class="contributor-avatar contributor-avatar--primary"
						/>
					</a>
					<a
						href="https://github.com/Senryoku"
						target="_blank"
						rel="noopener noreferrer"
						class="contributor-link"
						title="Senryoku"
					>
						<img 
							src="https://github.com/Senryoku.png" 
							alt="Senryoku" 
							class="contributor-avatar contributor-avatar--secondary"
						/>
					</a>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
defineProps<{
	rendering: boolean;
}>();

defineEmits<{
	newCard: [];
	save: [];
	render: [];
}>();
</script>

<style scoped>
.app-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-6);
	padding: var(--space-4) var(--space-8);
	background-image: linear-gradient(#6e939be0 80%, transparent);
	color: var(--color-text-inverse);
	box-shadow: var(--shadow-sm);
	min-height: 72px;
}

/* Logo Section */
.header-logo h1 {
	margin: 0;
	font-family: 'Beleren Small Caps', serif;
	font-size: var(--text-3xl);
	font-weight: normal;
	white-space: nowrap;
}

/* Actions Section */
.header-actions {
	display: flex;
	align-items: center;
	gap: var(--space-6);
	flex: 1;
}

.header-actions-primary {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.header-search {
	flex: 1;
	display: flex;
	justify-content: center;
	max-width: 600px;
}

/* Header Buttons */
.header-button {
	display: inline-flex;
	align-items: center;
	gap: var(--space-2);
	padding: var(--space-2) var(--space-4);
	font-family: var(--font-sans);
	font-size: var(--text-sm);
	font-weight: var(--font-medium);
	color: var(--color-text-inverse);
	background: rgba(255, 255, 255, 0.1);
	border: var(--border-2) solid rgba(255, 255, 255, 0.2);
	border-radius: var(--radius-lg);
	cursor: pointer;
	transition: var(--transition-colors), transform var(--duration-fast) var(--ease-out);
	white-space: nowrap;
}

.header-button:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.2);
	border-color: rgba(255, 255, 255, 0.3);
	transform: translateY(-1px);
}

.header-button:active:not(:disabled) {
	transform: translateY(0);
}

.header-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.header-button svg {
	flex-shrink: 0;
}

/* Primary Button Variant */
.header-button--primary {
	background: rgba(255, 255, 255, 0.2);
	border-color: rgba(255, 255, 255, 0.3);
}

.header-button--primary:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.3);
	border-color: rgba(255, 255, 255, 0.4);
}

/* Keyboard Shortcut */
.header-shortcut {
	margin-left: var(--space-1);
	padding: 2px var(--space-2);
	font-size: 0.75rem;
	color: rgba(255, 255, 255, 0.7);
	background: rgba(0, 0, 0, 0.2);
	border-radius: var(--radius-base);
	font-family: var(--font-mono);
}

/* Contact Section */
.header-contact {
	display: flex;
	align-items: center;
	gap: var(--space-3);
	font-size: var(--text-sm);
	white-space: nowrap;
}

.header-contact-label {
	color: rgba(255, 255, 255, 0.8);
}

.header-contact a {
	color: #ace4f1;
	text-decoration: none;
	transition: var(--transition-colors);
	font-weight: var(--font-medium);
}

.header-contact a:hover {
	color: #d0f6ff;
}

/* Icon Links */
.header-icon-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--space-2);
	border-radius: var(--radius-base);
	transition: var(--transition-colors), transform var(--duration-fast) var(--ease-out);
}

.header-icon-link:hover {
	background: rgba(255, 255, 255, 0.1);
	transform: translateY(-1px);
}

.header-icon-link:active {
	transform: translateY(0);
}

.header-icon-link img {
	width: 20px;
	height: 20px;
	display: block;
}

.header-icon-link svg {
	flex-shrink: 0;
}

/* Contributors Section */
.contributors-section {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.contributors-label {
	color: rgba(255, 255, 255, 0.8);
	font-size: var(--text-sm);
}

.contributors-avatars {
	display: flex;
	gap: var(--space-1);
	position: relative;
}

.contributor-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.contributor-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 2px solid rgba(255, 255, 255, 0.3);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	z-index: 1;
}

/* Primary contributor animations */
.contributor-avatar--primary {
	animation: float 3s ease-in-out infinite;
}

.contributor-link:hover .contributor-avatar--primary {
	transform: scale(1.1) rotate(360deg);
	border-color: #ace4f1;
	box-shadow: 0 0 20px rgba(172, 228, 241, 0.6);
}

/* Secondary contributor animations */
.contributor-avatar--secondary {
	animation: float 3s ease-in-out infinite reverse;
	animation-delay: -1.5s;
}

.contributor-link:hover .contributor-avatar--secondary {
	transform: scale(1.1) rotate(-360deg);
	border-color: #d0f6ff;
	box-shadow: 0 0 20px rgba(208, 246, 255, 0.6);
}

/* Glow effect on hover */
.contributor-link::before {
	content: '';
	position: absolute;
	inset: -4px;
	border-radius: 50%;
	background: linear-gradient(45deg, #ace4f1, #d0f6ff, #ace4f1);
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 0;
}

.contributor-link:hover::before {
	opacity: 0.3;
	animation: rotate 2s linear infinite;
}

/* Floating animation */
@keyframes float {
	0%, 100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-4px);
	}
}

/* Rotating gradient animation */
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Pulse animation for avatars */
.contributor-avatar::after {
	content: '';
	position: absolute;
	inset: -2px;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
	opacity: 0;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 0;
		transform: scale(1);
	}
	50% {
		opacity: 0.5;
		transform: scale(1.1);
	}
}

/* Responsive adjustments */
@media (max-width: 1200px) {
	.app-header {
		gap: var(--space-4);
		padding: var(--space-3) var(--space-6);
	}

	.header-actions {
		gap: var(--space-4);
	}

	.header-button span:not(.header-shortcut) {
		display: none;
	}

	.header-button {
		padding: var(--space-2);
		min-width: 36px;
		justify-content: center;
	}

	.header-shortcut {
		display: none;
	}
}

@media (max-width: 900px) {
	.header-contact-label {
		display: none;
	}
	
	.contributors-label {
		display: none;
	}
	
	.contributor-avatar {
		width: 28px;
		height: 28px;
	}
}

@media (max-width: 600px) {
	.contributors-section {
		gap: var(--space-1);
	}
	
	.contributor-avatar {
		width: 24px;
		height: 24px;
	}
}
</style>
