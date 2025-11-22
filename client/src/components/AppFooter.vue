<template>
	<footer class="app-footer">
		<div class="footer-content">
			<div class="footer-credits">
				<p>
					<strong>MTGRender</strong> uses images from templates by
					<a
						href="https://github.com/chilli-axe"
						target="_blank"
						rel="noopener noreferrer"
					>
						Chilli_Axe
					</a>.
				</p>
			</div>
			<div class="footer-legal">
				<p>
					MTGRender is unofficial Fan Content permitted under the
					<a
						href="https://company.wizards.com/en/legal/fancontentpolicy"
						target="_blank"
						rel="noopener noreferrer"
					>
						Fan Content Policy
					</a>.
					Not approved/endorsed by Wizards. Portions of the materials used are property of
					Wizards of the Coast. ©Wizards of the Coast LLC.
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
// Footer component for legal and credits information
</script>

<style scoped>
.app-footer {
	background-image: linear-gradient(transparent, #6e939be0 20%);
	color: var(--color-text-inverse);
	padding: var(--space-8) var(--space-8) var(--space-6);
	margin-top: auto;
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.footer-content {
	max-width: 1400px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.footer-credits,
.footer-legal {
	text-align: center;
}

.footer-credits p,
.footer-legal p {
	margin: 0;
	font-size: var(--text-sm);
	line-height: var(--leading-relaxed);
	color: rgba(255, 255, 255, 0.9);
}

.footer-credits strong {
	font-weight: var(--font-semibold);
	color: white;
}

.footer-legal p {
	font-size: var(--text-xs);
	color: rgba(255, 255, 255, 0.7);
	max-width: 800px;
	margin: 0 auto;
}

.app-footer a {
	color: #ace4f1;
	text-decoration: none;
	font-weight: var(--font-medium);
	transition: var(--transition-colors);
	border-bottom: 1px solid transparent;
}

.app-footer a:hover {
	color: #d0f6ff;
	border-bottom-color: #d0f6ff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.app-footer {
		padding: var(--space-6) var(--space-4) var(--space-4);
	}

	.footer-content {
		gap: var(--space-3);
	}

	.footer-credits p,
	.footer-legal p {
		font-size: var(--text-xs);
	}
}
</style>
