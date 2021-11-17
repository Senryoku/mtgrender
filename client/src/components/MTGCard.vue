<template>
	<div
		class="mtg-card"
		:class="{
			mdfc: is_mdfc,
			transform: is_transform,
			back: currentFace === 1,
			legendary: is_legendary,
			'has-legendary-crown': has_legendary_crown,
			planeswalker: is_planeswalker,
			'planeswalker-large': is_large_planeswalker,
			saga: is_saga,
			adventure: is_adventure,
			'extended-art':
				(is_adventure ? card : card_face).art_variant === 'extended',
			'full-art': [
				'full',
				'full-footer',
				'archive',
				'japanese-archive',
			].includes((is_adventure ? card : card_face).art_variant),
			'full-footer': ['full-footer', 'japanese-archive'].includes(
				(is_adventure ? card : card_face).art_variant
			),
			archive: (is_adventure ? card : card_face).art_variant === 'archive',
			'japanese-archive':
				(is_adventure ? card : card_face).art_variant === 'japanese-archive',
			compasslanddfc: this.card.frame_effects?.includes('compasslanddfc'),
		}"
	>
		<div class="inner-background"></div>
		<div
			class="illustration"
			:class="{
				'behind-textbox':
					card.illustration_textbox ||
					(is_planeswalker && card.illustration_textbox !== false),
			}"
			@wheel.prevent="scale_illustration"
			@mousedown.prevent="start_drag_illustration"
			@mouseup.prevent="end_drag_illustration"
			@mousemove="drag_illustration"
			@mouseleave="cancel_drag_illustration"
		></div>
		<div class="planeswalker-oracle-bg" v-if="is_planeswalker"></div>
		<div class="inner-frame">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 14.36 20"
				id="archive-frame"
				width="100%"
				height="100%"
				preserveAspectRatio="none"
				v-if="(is_adventure ? card : card_face).art_variant === 'archive'"
			>
				<filter
					id="noise"
					x="0%"
					y="0%"
					width="100%"
					height="100%"
					filterUnits="userSpaceOnUse"
				>
					<feTurbulence
						baseFrequency="0.16"
						numOctaves="16"
						result="noisy"
						seed="2"
					/>
					<feTurbulence
						baseFrequency="8"
						numOctaves="16"
						type="fractalNoise"
						result="noisy2"
						seed="157"
					/>
					<feColorMatrix
						type="luminanceToAlpha"
						in="noisy"
						result="alphaNoise1"
					/>
					<feColorMatrix
						type="luminanceToAlpha"
						in="noisy2"
						result="alphaNoise2"
					/>
					<feFlood
						x="0"
						y="0"
						width="100%"
						height="100%"
						flood-color="#d5b057"
						flood-opacity="1"
						result="flood"
					/>
					<feComposite
						operator="out"
						in="alphaNoise1"
						in2="alphaNoise2"
						result="alphaNoise"
					/>
					<feComposite
						operator="in"
						in="flood"
						in2="alphaNoise"
						result="coloredNoise"
					/>
					<feComposite
						operator="in"
						in="coloredNoise"
						in2="SourceGraphic"
						result="finalNoise"
					/>
					<feBlend in="SourceGraphic" in2="finalNoise" mode="multiply" />
				</filter>
				<defs>
					<clipPath id="illustration-clip">
						<path d="M 0.425 2.321 H 13.902 L 14.4 2.481 V 0 H 0 V 2.496 Z" />
					</clipPath>
					<clipPath id="top-clip">
						<path
							d="M 1.026 0.84 H 13.37 c 0.206 0.329 0.186 0.876 -0.026 1.198 H 1 c -0.213 -0.417 -0.151 -0.965 0.02 -1.177 Z"
						/>
					</clipPath>
				</defs>
				<g stroke="black" stroke-width="0.06">
					<g clip-path="url(#illustration-clip)">
						<rect
							class="background-color"
							x="0"
							y="0"
							width="100%"
							height="100%"
							stroke-width="0"
						/>
						<circle class="background-feature" cx="8.5" cy="1.2" r="5" />
						<circle class="background-feature" cx="8.5" cy="4" r="5" />
						<circle
							class="background-feature"
							cx="10"
							cy="2"
							r="1.8"
							stroke-width="0.04"
							opacity="0.5"
						/>
						<circle
							class="background-feature"
							cx="12"
							cy="2"
							r="2"
							stroke-width="0.04"
							opacity="0.5"
						/>

						<circle class="gold" cx="1.345" cy="1.432" r="1.24" />
						<circle class="gold" cx="13.013" cy="1.432" r="1.24" />

						<circle class="gold" cx="2.6" cy="0.588" r="0.1" />
						<circle class="gold" cx="3" cy="0.588" r="0.1" />
						<circle class="gold" cx="3.4" cy="0.588" r="0.1" />

						<circle class="gold" cx="10.95" cy="0.588" r="0.1" />
						<circle class="gold" cx="11.35" cy="0.588" r="0.1" />
						<circle class="gold" cx="11.75" cy="0.588" r="0.1" />

						<path
							class="primary-color"
							d="M -0.017 0.403 C 0.079 0.355 0.166 0.292 0.302 0.24 C 0.445 0.156 0.536 0.085 0.624 -0.047 H 1.053 C 0.918 0.164 0.823 0.244 0.576 0.351 C 0.369 0.459 0.13 0.566 -0.005 0.733 Z M 13.319 -0.028 C 13.44 0.161 13.605 0.282 13.831 0.384 C 14.03 0.444 14.199 0.579 14.375 0.715 V 0.379 C 14.2593 0.3293 14.154 0.278 14.028 0.222 C 13.889 0.142 13.81 0.096 13.733 -0.02 Z"
						/>
						<path
							class="primary-left-color"
							d="M 0.853 0.521 H 1.657 C 1.905 0.55 2.017 0.612 2.178 0.81 H 7.201 V 2.31 H 0.797 C 0.701 2.123 0.653 1.96 0.616 1.765 L 0.292 1.452 L 0.625 1.184 C 0.69 0.875 0.714 0.728 0.845 0.525 Z"
						/>
						<path
							class="primary-right-color"
							transform="translate(14.36) scale(-1 1)"
							d="M 0.853 0.521 H 1.657 C 1.905 0.55 2.017 0.612 2.178 0.81 H 7.201 V 2.31 H 0.797 C 0.701 2.123 0.653 1.96 0.616 1.765 L 0.292 1.452 L 0.625 1.184 C 0.69 0.875 0.714 0.728 0.845 0.525 Z"
						/>

						<g id="top-ring">
							<path
								class="lighter-left-color"
								d="M 7.2 -1.8 A 1 1 0 0 0 7.2 4.4 V 4 A 1 1 0 0 1 7.2 -1.4 Z"
							/>
							<path
								class="lighter-right-color"
								d="M 7.2 -1.4 A 1 1 0 0 1 7.2 4 V 4.4 A 1 1 0 0 0 7.2 -1.8 Z"
							/>
							<path
								class="primary-left-color"
								d="M 7.2 -1.6 A 1 1 0 0 0 7.2 4.1 V 3.96 A 1 1 0 0 1 7.2 -1.46 Z"
								stroke-width="0"
							/>
							<path
								class="primary-right-color"
								d="M 7.2 -1.46 A 1 1 0 0 1 7.2 3.96 V 4.098 A 1 1 0 0 0 7.2 -1.6 Z"
								stroke-width="0"
							/>
						</g>

						<path
							class="lighter-color"
							d="M 5.266 2.07 L 5.421 2.305 H 9.004 L 9.207 2.07 Z"
						/>

						<rect x="2.29" y="2.312" width="16" height="2" fill="black" />
					</g>

					<path
						class="darker-color"
						d="M -0.046 10.999 H 14.455 V 11.93 L 13.408 13.145 V 12.462 H 1.009 V 13.058 L -0.045 11.793 Z"
					/>
					<path
						class="lighter-color"
						d="M 1.8 10.999 H 13.364 V 11.445 H 2.639 Z"
					/>
					<path
						class="primary-color"
						d="M 13.873 11.24 C 13.939 11.28 13.973 11.318 13.964 11.381 C 13.962 11.472 13.953 11.481 13.914 11.526 C 13.867 11.575 13.86 11.587 13.815 11.602 C 13.7627 11.602 13.7103 11.602 13.649 11.569 C 13.6113 11.5437 13.5647 11.4853 13.534 11.413 C 13.5167 11.346 13.5153 11.265 13.525 11.203 C 13.546 11.1257 13.578 11.0673 13.61 11.009 C 13.69 10.921 13.789 10.861 13.925 10.822 C 14.052 10.81 14.124 10.806 14.239 10.865 C 14.351 10.913 14.378 10.929 14.45 10.993 C 14.526 11.108 14.589 11.212 14.613 11.355 C 14.637 11.53 14.625 11.626 14.585 11.725 C 14.514 11.877 14.454 11.976 14.355 12.096 C 14.2117 12.3017 14.0683 12.5073 13.925 12.713 C 13.87 12.812 13.818 12.908 13.809 13.067 C 13.804 13.643 13.799 14.219 13.794 14.795 C 13.7887 15.3537 13.7833 15.9123 13.778 16.471 C 13.7847 16.9237 13.7913 17.3763 13.798 17.829 C 13.798 17.9247 13.798 18.0203 13.798 18.116 C 13.686 18.203 13.634 18.239 13.543 18.271 C 13.5323 17.067 13.5217 15.863 13.511 14.659 C 13.531 14.01 13.503 13.764 13.511 13.517 C 13.513 13.295 13.513 13.081 13.576 12.846 C 13.634 12.657 13.69 12.541 13.79 12.41 C 13.961 12.183 14.08 12.02 14.216 11.757 C 14.271 11.622 14.295 11.51 14.276 11.386 C 14.256 11.281 14.199 11.217 14.132 11.189 C 14.07 11.166 14.01 11.16 13.948 11.184 C 13.917 11.196 13.896 11.213 13.878 11.231 Z"
					/>
					<path
						class="primary-color"
						d="M 0.527 12.847 C 0.544 12.9 0.564 12.969 0.563 13.113 C 0.567 13.616 0.571 14.119 0.575 14.622 C 0.58 15.142 0.567 15.668 0.571 16.196 C 0.567 16.6553 0.571 17.1197 0.575 17.584 C 0.575 17.7593 0.575 17.9347 0.575 18.11 C 0.639 18.198 0.716 18.231 0.813 18.256 V 12.627 L 0.765 12.574 Z"
					/>

					<path
						class="gold"
						d="M 0.536 14.616 L 0.289 14.354 L 0.31 13.619 C 0.342 13.38 0.667 13.017 0.912 12.839 V 16.707 L 0.523 17.109 L 0.514 17.663 L 0.564 17.745 L 0.559 18.123 C 0.402 18.002 0.323 17.835 0.245 17.647 L 0.263 17.025 C 0.263 16.969 0.286 16.915 0.323 16.871 L 0.868 16.342 V 13.39 C 0.715 13.45 0.629 13.635 0.549 13.788 Z"
					/>
					<path
						transform="translate(14.36,0) scale(-1, 1)"
						class="gold"
						d="M 0.536 14.616 L 0.289 14.354 L 0.31 13.619 C 0.342 13.38 0.667 13.017 0.912 12.839 V 16.707 L 0.523 17.109 L 0.514 17.663 L 0.564 17.745 L 0.559 18.123 C 0.402 18.002 0.323 17.835 0.245 17.647 L 0.263 17.025 C 0.263 16.969 0.286 16.915 0.323 16.871 L 0.868 16.342 V 13.39 C 0.715 13.45 0.629 13.635 0.549 13.788 Z"
					/>

					<path
						fill="black"
						stroke-width="0"
						d="M 0.854 18.258 H 13.53 C 13.956 18.121 14.175 17.744 14.413 16.781 V 20.059 H -0.026 V 16.809 C 0.165 17.405 0.388 18.22 0.855 18.26"
					/>

					<path
						class="background-color"
						d="M 0.968 12.46 H 13.359 V 15.067 C 14.04 15.257 13.669 15.913 13.364 15.887 V 18.579 H 0.98 V 15.911 C 0.547 15.818 0.429 15.151 0.956 15.057 Z"
					/>

					<path
						class="lighter-left-color"
						d="M 0.849 12.558 V 14.935 C 0.516 15.007 0.158 15.671 0.823 15.998 V 18.583 H 1.103 V 15.765 H 0.942 C 0.703 15.754 0.568 15.287 0.942 15.157 H 1.087 V 12.552 H 9.354 L 9.921 12.338 L 1.048 12.324 C 0.799 12.16 0.721 11.377 1.178 10.998 C 1.38 11.107 1.484 11.169 1.666 11.226 H 2.522 C 1.93 11.034 1.401 10.713 1.027 10.521 C 0.41 11.159 0.337 12.025 0.851 12.56 Z Z"
					/>
					<path
						class="lighter-right-color"
						d="M 9.356 12.555 H 13.267 V 15.17 H 13.399 C 13.557 15.2 13.654 15.317 13.648 15.476 C 13.651 15.62 13.54 15.779 13.401 15.787 H 13.263 V 18.655 H 13.52 V 16.023 C 14.087 15.748 13.998 15.115 13.516 14.949 V 12.552 C 13.904 12.268 13.987 11.434 13.428 10.82 L 12.75 11.242 L 9.356 12.555 Z"
					/>

					<path
						class="background-color"
						d="M 1 11.22 h 12.37 c 0.231 0.263 0.236 0.879 -0.027 1.126 h -12.313 c -0.231 -0.324 -0.248 -0.748 -0.033 -1.122 z"
					/>
					<circle
						class="gold"
						cx="1"
						cy="15.476"
						r="0.14"
						stroke-width="0.04"
					/>
					<circle
						class="gold"
						cx="13.356"
						cy="15.476"
						r="0.14"
						stroke-width="0.04"
					/>

					<path
						class="primary-color"
						d="M 0.611 11.258 C 0.53 11.231 0.454 11.24 0.428 11.338 C 0.412 11.477 0.464 11.517 0.531 11.553 C 0.603 11.577 0.686 11.561 0.742 11.489 C 0.83 11.386 0.855 11.319 0.842 11.184 C 0.834 11.036 0.738 10.952 0.639 10.885 C 0.544 10.83 0.48 10.817 0.329 10.815 C 0.157 10.833 0.049 10.884 -0.036 10.952 C -0.19 11.118 -0.229 11.324 -0.232 11.538 C -0.211 11.672 -0.211 11.648 -0.158 11.804 C -0.084 11.965 0.209 12.357 0.332 12.52 L 0.512 12.812 L 0.743 12.552 C 0.593 12.396 0.396 12.151 0.158 11.775 C 0.094 11.634 0.09 11.498 0.109 11.339 C 0.137 11.252 0.205 11.155 0.316 11.147 C 0.38 11.14 0.429 11.141 0.489 11.152 C 0.519 11.162 0.551 11.184 0.583 11.213 Z"
					/>

					<path
						class="gold"
						d="M 0.702 12.419 C 0.547 12.5 0.336 12.683 0.339 12.987 L 0.507 13.116 L 0.549 13.096 C 0.511 13.011 0.608 12.865 0.834 12.668 C 0.8373 12.6343 0.8407 12.6007 0.836 12.563 C 0.808 12.517 0.781 12.466 0.719 12.422 Z"
					/>
					<path
						class="gold"
						d="M 0.702 12.419 C 0.547 12.5 0.336 12.683 0.339 12.987 L 0.507 13.116 L 0.549 13.096 C 0.511 13.011 0.608 12.865 0.834 12.668 C 0.8373 12.6343 0.8407 12.6007 0.836 12.563 C 0.808 12.517 0.781 12.466 0.719 12.422 Z"
						transform="translate(14.36,0) scale(-1, 1)"
					/>

					<path
						class="lighter-color"
						d="M -0.065 2.822 C 0.007 2.73 0.112 2.62 0.282 2.605 H 2.066 L 3.889 0.847 H 10.413 L 12.303 2.599 H 14.102 C 14.273 2.68 14.369 2.736 14.487 2.864 V 2.538 C 14.365 2.449 14.286 2.357 14.118 2.347 H 12.394 L 10.541 0.564 H 8.353 C 8.226 0.555 8.116 0.513 8.044 0.435 C 7.942 0.332 7.861 0.214 7.754 0.16 C 7.66 0.104 7.584 0.095 7.483 0.128 C 7.539 0.216 7.557 0.251 7.543 0.422 C 7.507 0.585 7.378 0.668 7.203 0.672 C 7.006 0.659 6.964 0.596 6.881 0.506 C 6.821 0.383 6.821 0.265 6.899 0.148 C 6.828 0.11 6.733 0.104 6.651 0.157 C 6.472 0.256 6.398 0.441 6.224 0.511 C 6.112 0.56 5.993 0.556 5.879 0.56 H 3.81 L 1.987 2.336 H 0.301 C 0.129 2.354 0.021 2.405 -0.091 2.481 Z"
					/>
					<path
						class="background-color"
						d="M 1 0.814 H 13.37 c 0.237 0.351 0.233 0.868 -0.002 1.251 H 1 c -0.227 -0.379 -0.229 -0.947 0 -1.251 Z"
					/>
					<g clip-path="url(#top-clip)">
						<path
							class="top-feature"
							d="M 5.191 2.214 C 4.399 1.521 2.825 1.205 0.69 1.647 M 4.536 2.298 C 4.87 1.658 5.443 0.958 6.246 0.532 M 5.272 2.139 C 5.53 1.57 5.996 1.065 6.624 0.604 M 6.68 0.671 C 6.82 0.993 6.967 1.189 7.206 1.541 M 6.35 0.719 C 6.402 1.172 6.791 1.861 6.982 2.139"
						/>
						<path
							class="top-feature"
							transform="translate(14.36,0) scale(-1, 1)"
							d="M 5.191 2.214 C 4.399 1.521 2.825 1.205 0.69 1.647 M 4.536 2.298 C 4.87 1.658 5.443 0.958 6.246 0.532 M 5.272 2.139 C 5.53 1.57 5.996 1.065 6.624 0.604 M 6.68 0.671 C 6.82 0.993 6.967 1.189 7.206 1.541 M 6.35 0.719 C 6.402 1.172 6.791 1.861 6.982 2.139"
						/>
					</g>
					<path
						id="top-front"
						class="lighter-left-color"
						d="M 4.453 0.83 C 4.471 0.865 4.49 0.888 4.529 0.896 H 5.243 C 5.297 0.896 5.335 0.884 5.384 0.846 L 6.477 -0.087 H 6.003 L 5.188 0.657 C 5.113 0.722 5.022 0.787 4.918 0.829 H 4.452 Z"
					/>
					<path
						id="top-front"
						class="lighter-right-color"
						transform="translate(14.36,0) scale(-1, 1)"
						d="M 4.453 0.83 C 4.471 0.865 4.49 0.888 4.529 0.896 H 5.243 C 5.297 0.896 5.335 0.884 5.384 0.846 L 6.477 -0.087 H 6.003 L 5.188 0.657 C 5.113 0.722 5.022 0.787 4.918 0.829 H 4.452 Z"
					/>

					<path
						class="gold"
						d="M 8.73 18.578 C 8.939 18.633 9.067 18.705 9.146 18.865 H 13.019 L 13.015 18.578 Z"
					/>
					<path
						class="gold"
						d="M 12.645 18.37 C 12.553 18.374 12.537 18.43 12.502 18.458 C 12.366 18.569 12.223 18.641 12.044 18.705 H 12.888 L 13.17 18.366 Z"
					/>
					<path
						class="gold"
						d="M 13.063 18.864 H 12.167 C 12.577 18.693 12.987 18.454 13.258 18.08 V 18.685 Z"
					/>
				</g>
			</svg>
		</div>
		<div class="legendary-crown" v-show="has_legendary_crown"></div>
		<div class="top-line">
			<span
				class="name"
				@dblclick.prevent="edit_property('name')"
				@mousedown.prevent=""
				ref="name_el"
			>
				{{ card_face.name }}
			</span>
			<div
				class="mana-cost"
				@dblclick.prevent="edit_property('mana_cost')"
				@mousedown.prevent=""
			>
				<img
					v-for="(uri, idx) in mana_cost"
					class="ms ms-shadow"
					:key="idx"
					:src="uri"
				/>
			</div>
		</div>
		<div class="mid-line">
			<img
				class="color-indicator"
				v-if="card_face.color_indicator"
				:src="color_indicator"
			/>
			<div
				class="type-line"
				@dblclick="edit_property('type_line')"
				@mousedown.prevent=""
				ref="type_line_el"
			>
				{{ card_face.type_line }}
			</div>
			<div class="set-icon-container" v-if="set_icon_uri">
				<img class="set-icon" :src="set_icon_uri" />
			</div>
		</div>
		<template
			v-if="is_adventure && card.card_faces && card.card_faces.length > 1"
		>
			<div class="adventure-part">
				<div class="adventure-top-line">
					<span
						class="adventure-name"
						@dblclick.prevent="edit_property(['card_faces', 1, 'name'])"
						@mousedown.prevent=""
						>{{ card.card_faces[1].name }}</span
					>
					<div
						class="adventure-mana-cost"
						@dblclick.prevent="edit_property(['card_faces', 1, 'mana_cost'])"
						@mousedown.prevent=""
					>
						<img
							v-for="(uri, idx) in adventure_mana_cost"
							class="ms ms-shadow"
							:key="idx"
							:src="uri"
						/>
					</div>
				</div>
				<div class="adventure-type">{{ card.card_faces[1].type_line }}</div>
				<div class="oracle adventure-oracle" ref="adventure_oracle_el">
					<div
						class="oracle-inner"
						v-for="(line, idx) in adventure_oracle_lines"
						:key="idx"
						v-html="line"
						@dblclick="edit_property(['card_faces', 1, 'oracle_text'])"
						@mousedown.prevent=""
					></div>
					<div
						class="oracle-flavor"
						v-if="card.card_faces[1].flavor_text"
						@dblclick="edit_property(['card_faces', 1, 'flavor_text'])"
						@mousedown.prevent=""
					>
						<hr />
						{{ card.card_faces[1].flavor_text }}
					</div>
				</div>
			</div>
			<div class="oracle adventure-main-oracle" ref="oracle_el">
				<div
					class="oracle-inner"
					v-for="(line, idx) in oracle_lines"
					:key="idx"
					v-html="line"
					@dblclick="edit_property(['card_faces', 0, 'oracle_text'])"
					@mousedown.prevent=""
				></div>
				<div
					class="oracle-flavor"
					v-if="card.card_faces[0].flavor_text"
					@dblclick="edit_property(['card_faces', 0, 'flavor_text'])"
					@mousedown.prevent=""
				>
					<hr />
					{{ card.card_faces[0].flavor_text }}
				</div>
			</div>
		</template>
		<template v-else-if="is_saga">
			<div
				class="oracle saga-oracle"
				@dblclick="edit_property('oracle_text')"
				@mousedown.prevent=""
			>
				<div
					class="saga-reminder"
					v-if="saga_reminder"
					v-html="saga_reminder"
				></div>
				<div class="saga-frame"></div>
				<div class="saga-steps" ref="oracle_el">
					<div class="saga-step" v-for="(step, idx) in saga_steps" :key="idx">
						<div class="saga-step-number">
							<img v-for="step in step.steps" :key="step" :src="step" />
						</div>
						<div v-html="step.html"></div>
					</div>
				</div>
			</div>
		</template>
		<template v-else-if="planeswalker_abilities">
			<div
				class="oracle planeswalker-oracle"
				ref="oracle_el"
				@dblclick="edit_property('oracle_text')"
			>
				<div
					class="planeswalker-ability"
					v-for="(ability, idx) in planeswalker_abilities"
					:key="idx"
					:class="{
						'planeswalker-ability-with-cost': ability.cost !== null,
					}"
				>
					<div
						class="planeswalker-ability-cost"
						v-if="ability.cost !== null"
						:class="{
							'planeswalker-ability-cost-minus': ability.cost < 0,
							'planeswalker-ability-cost-zero': ability.cost === 0,
							'planeswalker-ability-cost-plus': ability.cost > 0,
						}"
					>
						{{ ability.cost > 0 ? "+" : "" }}{{ ability.cost }}
					</div>
					<div v-html="ability.html"></div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="oracle normal-oracle" ref="oracle_el">
				<div
					class="oracle-inner"
					v-for="(line, idx) in oracle_lines"
					:key="idx"
					v-html="line"
					@dblclick="edit_property('oracle_text')"
					@mousedown.prevent=""
				></div>
				<div
					class="oracle-flavor"
					v-if="card_face.flavor_text"
					@dblclick="edit_property('flavor_text')"
					@mousedown.prevent=""
				>
					<hr />
					{{ card_face.flavor_text }}
				</div>
			</div>
		</template>
		<div class="pt-box" v-show="card_face.power || card_face.toughness">
			<span @dblclick="edit_property('power')" @mousedown.prevent="">{{
				card_face.power
			}}</span
			>/<span @dblclick="edit_property('toughness')" @mousedown.prevent=""
				>{{ card_face.toughness }}
			</span>
		</div>
		<div
			class="loyalty"
			v-show="card_face.loyalty"
			@dblclick="edit_property('loyalty')"
		>
			{{ card_face.loyalty }}
		</div>
		<div class="footer">
			<div class="footer-left">
				<div
					class="collector-number"
					@dblclick="edit_property('collector_number')"
					@mousedown.prevent=""
				>
					{{
						(is_adventure || !card_face?.collector_number ? card : card_face)
							.collector_number
					}}
				</div>
				<div>
					<span v-if="card.set" class="set">{{ card.set.toUpperCase() }}</span>
					<span v-if="card.set && card.lang" style="margin-right: 0.2mm"
						>&nbsp;•&nbsp;</span
					>
					<span v-if="card.lang" class="language"
						>{{ card.lang.toUpperCase() }}&nbsp;</span
					>
					<span class="artist-icon" v-if="card.artist"> a </span>
					<span
						class="artist-name"
						@dblclick="edit_property('artist')"
						@mousedown.prevent=""
						>{{ card.artist }}</span
					>
				</div>
			</div>
			<div class="footer-right">
				<div
					v-if="
						card_face.power ||
						card_face.toughness ||
						card_face.loyalty ||
						card_face.art_variant === 'archive'
					"
				>
					&nbsp;
				</div>
				<div class="copyright" @dblclick="edit_property('copyright')">
					{{ copyright }}
				</div>
			</div>
		</div>
		<div v-if="is_mdfc" class="mdfc-icon"></div>
		<div v-if="is_mdfc" class="mdfc-hint">
			<span>{{ mdfc_hint_text }}</span>
			<div class="mana-cost mdfc-hint-mana-cost">
				<img
					v-for="(uri, idx) in mdfc_back_mana_cost"
					class="ms ms-shadow"
					:key="idx"
					:src="uri"
				/>
			</div>
		</div>
		<div v-if="is_transform" class="transform-icon"></div>
		<div
			v-if="is_transform && currentFace === 0 && back_face.power"
			class="transform-hint"
		>
			{{ back_face.power }}/{{ back_face.toughness }}
		</div>
		<div v-if="is_dualfaced" class="flip-icon" @click="flip">⭯</div>
		<div
			v-if="
				debug &&
				display_debug &&
				(card?.image_uris?.png || card_face?.image_uris?.png)
			"
			class="debug-overlay"
			@mousemove="update_debug_overlay"
			@mouseleave="update_debug_overlay"
		>
			<div>
				<img :src="card?.image_uris?.png || card_face?.image_uris?.png" />
			</div>
		</div>
		<div class="debug-controls" v-if="debug">
			<input type="number" step="0.1" v-model="debug_opacity" />
			<input type="checkbox" v-model="display_debug" />
		</div>
		<svg class="svg" height="0" width="0">
			<clipPath id="full-art-clip-path" clipPathUnits="objectBoundingBox">
				<path
					d="M0,0 H1 V0.745 C1,0.745,0.993,0.829,0.935,0.884 V0.925 H0.065 V0.884 C0.03,0.842,0.015,0.832,0,0.745 Z"
				></path>
			</clipPath>
			<clipPath
				id="full-art-planeswalker-clip-path"
				clipPathUnits="objectBoundingBox"
			>
				<path
					d="M 0 0 H 1 V 0.745 C 1 0.745 0.993 0.829 0.935 0.884 L 0.912 0.911 H 0.09 L 0.065 0.884 C 0.03 0.842 0.015 0.832 0 0.745 Z"
				></path>
			</clipPath>
		</svg>
	</div>
</template>

<script lang="ts">
import { ref, nextTick } from "vue";

// Disabled for now: This should be made optional, or even explicitly specified (like "{Flash}" instead of "Flash")
const keywords = {
	//Flash: "You may cast this spell any time you could cast an instant.",
};
const mana_regex = /{([^}]+)}/g;

const ArchiveColors = {
	W: "#878167",
	U: "#1c477b",
	B: "#161417",
	R: "#69201a",
	G: "#2d4429",
	Gold: "#927c43",
};

const ArchiveFrameColors = {
	W: { primary: "#9d8793", lighter: "#f0e8e5", darker: "#a89390" },
	U: { primary: "#0e3d95", lighter: "#125faf", darker: "#13316d" },
	B: { primary: "#7d7584", lighter: "#443a39", darker: "#47414b" },
	R: { primary: "#821d23", lighter: "#cd4431", darker: "#462327" },
	G: { primary: "#30513c", lighter: "#366a54", darker: "#1a3429" },
	Gold: { primary: "#ceac4b", lighter: "#ceac4b", darker: "#86622e" },
};

const mana_symbols = {};
import mana_symbols_list from "../assets/data/symbology.json";
for (let symbol of mana_symbols_list.data) mana_symbols[symbol.symbol] = symbol;
import sets_with_icons from "../assets/data/sets_with_icons.json";

function check_overflow(el) {
	const curOverflow = el.style.overflow;

	if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

	const isOverflowing =
		el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
	el.style.overflow = curOverflow;

	return isOverflowing;
}

function contains(str, search) {
	if (!str || !search) return false;
	if (Array.isArray(search))
		return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
	return str.toLowerCase().includes(search.toLowerCase());
}

export default {
	name: "MTGCard",
	props: {
		card: Object,
		scale: Number,
		renderMargin: Number,
	},
	data() {
		const name_el = ref(null);
		const oracle_el = ref(null);
		const adventure_oracle_el = ref(null);
		const type_line_el = ref(null);
		return {
			name_el,
			oracle_el,
			adventure_oracle_el,
			type_line_el,
			currentFace: 0,
			dragging_illustration: null,
			debug: import.meta.env.MODE === "development",
			display_debug: false,
			debug_opacity: 0,
		};
	},
	updated() {
		this.fit();
	},
	methods: {
		set_face(idx) {
			this.currentFace = idx;
		},
		gen_mana_symbol(str, classes = []) {
			if ("{" + str + "}" in mana_symbols) {
				let el = new Image();
				el.src = mana_symbols["{" + str + "}"].svg_uri;
				el.className = "ms";
				return el;
			}
		},
		parse_oracle(str) {
			if (str in keywords) {
				return `${str} <span class="oracle-reminder">(${keywords[str]})</span>`;
			}
			str = str.replace(
				mana_regex,
				(match, group) => this.gen_mana_symbol(group).outerHTML // FIXME: This is horrible
			);
			// Included reminder text
			str = str.replace(
				/\([^)]+\)/g,
				(match) => `<span class="oracle-reminder">${match}</span>`
			);
			return str;
		},
		edit_property(prop) {
			// TODO
			const r = prompt(`Edit Card property '${prop}'`, this.card_face[prop]);
			if (r)
				this.$emit(
					"edit",
					this.d ? ["card_faces", this.currentFace, prop] : prop,
					r
				);
		},
		scale_illustration(event) {
			let s = 1;
			const card = this.is_adventure ? this.card : this.card_face;
			if (card.illustration_scale) s = card.illustration_scale;
			s += event.deltaY > 0 ? -0.1 : 0.1;
			s = Math.min(Math.max(1, s), 50);
			this.$emit(
				"edit",
				this.card.card_faces && !this.is_adventure
					? ["card_faces", this.currentFace, "illustration_scale"]
					: "illustration_scale",
				s
			);
		},
		start_drag_illustration(event) {
			const card = this.is_adventure ? this.card : this.card_face;
			if (!card.illustration_position)
				this.$emit(
					"edit",
					this.card.card_faces && !this.is_adventure
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					{ x: 0, y: 0 }
				);
			this.dragging_illustration = {
				x: card.illustration_position?.x ?? 0,
				y: card.illustration_position?.y ?? 0,
			};
		},
		cancel_drag_illustration(event) {
			if (this.dragging_illustration) {
				this.$emit(
					"edit",
					this.card.card_faces && !this.is_adventure
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					this.dragging_illustration
				);
				this.end_drag_illustration();
			}
		},
		end_drag_illustration(event) {
			this.dragging_illustration = null;
		},
		drag_illustration(event) {
			const card = this.is_adventure ? this.card : this.card_face;
			if (this.dragging_illustration) {
				this.$emit(
					"edit",
					this.card.card_faces && !this.is_adventure
						? ["card_faces", this.currentFace, "illustration_position"]
						: "illustration_position",
					{
						x:
							card.illustration_position.x +
							(this.mmperpixel * event.movementX) / this.scale,
						y:
							card.illustration_position.y +
							(this.mmperpixel * event.movementY) / this.scale,
					}
				);
			}
		},
		fit_font_size(el, initial_size = 8) {
			let curr_font_size = initial_size;
			el.style.fontSize = curr_font_size + "pt";
			while (check_overflow(el) && curr_font_size > 3) {
				curr_font_size *= 0.9;
				el.style.fontSize = curr_font_size + "pt";
			}
		},
		fit() {
			this.fit_name();
			this.fit_type_line();
			this.fit_oracle_text();
		},
		fit_name() {
			if (!this.$refs.name_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				const initial_font_size = 9.454;
				let curr_letter_spacing = 0.034; //initial_spacing;
				this.$refs.name_el.style.fontSize = initial_font_size + "pt";
				this.$refs.name_el.style.letterSpacing = curr_letter_spacing + "mm";
				while (
					check_overflow(this.$refs.name_el) &&
					curr_letter_spacing > -0.09
				) {
					curr_letter_spacing -= 0.001;
					this.$refs.name_el.style.letterSpacing = curr_letter_spacing + "mm";
				}
				if (check_overflow(this.$refs.name_el))
					this.fit_font_size(this.$refs.name_el, initial_font_size);
			});
		},
		fit_type_line() {
			if (!this.$refs.type_line_el) return;
			// Make sure type fits in its box
			nextTick(() => {
				this.fit_font_size(this.$refs.type_line_el);
			});
		},
		fit_oracle_text() {
			if (!this.$refs.oracle_el) return;
			// Make sure oracle text fits in its box
			nextTick(() => {
				this.fit_font_size(this.$refs.oracle_el);
				if (this.$refs.adventure_oracle_el)
					this.fit_font_size(this.$refs.adventure_oracle_el);
			});
		},
		flip() {
			this.currentFace = (this.currentFace + 1) % 2;
			this.fit_name();
			this.fit_oracle_text();
			this.fit_type_line();
		},
		compute_colors(face) {
			if (
				face?.colors === undefined &&
				face?.color_identity === undefined &&
				face?.mana_cost === undefined
			)
				return "Colourless";
			let colors =
				face?.colors && face?.colors.length > 0
					? face?.colors
					: face?.color_identity
					? face?.color_identity
					: [...face.mana_cost].filter((c) => "WUBRG".includes(c));
			if (colors.length === 0 && this.card.color_identity.length > 0)
				colors = this.card.color_identity;
			const sorted_colors = [...new Set(colors)]
				.sort((l: string, r: string) => {
					return "WUBRG".indexOf(l) - "WUBRG".indexOf(r);
				})
				.join("");
			// TODO: Correctly handle dual mana cost (bi-colored border)
			return contains(face.type_line, ["Artifact", "Artefact", "Artéfact"])
				? "Artifact"
				: sorted_colors.length === 0
				? "Colourless"
				: sorted_colors.length > 2
				? "Gold"
				: sorted_colors;
		},
		update_debug_overlay(event) {
			if (event.type === "mousemove") {
				event.target.firstElementChild.style.width =
					(event.clientX - event.target.parentNode.getBoundingClientRect().x) /
						this.scale +
					"px";
			} else {
				event.target.firstElementChild.style.width = "";
			}
		},
	},
	computed: {
		mmperpixel() {
			return 63.5 / this.$el.clientWidth;
		},
		card_face() {
			if (this.card.card_faces)
				return this.card.card_faces[this.is_adventure ? 0 : this.currentFace];
			return this.card;
		},
		back_face() {
			if (this.card.card_faces)
				return this.card.card_faces[(this.currentFace + 1) % 2];
			return this.card;
		},
		is_land() {
			return this.card_face?.type_line?.startsWith("Land") ||
				this.card_face?.type_line?.startsWith("Terrain")
				? true
				: false;
		},
		is_legendary() {
			return this.card.frame_effects?.includes("legendary") ||
				this.card_face?.type_line?.startsWith("Legendary") ||
				this.card_face?.type_line?.includes("légendaire")
				? true
				: false;
		},
		has_legendary_crown() {
			return (
				this.is_legendary &&
				!this.is_planeswalker &&
				!this.card.frame_effects?.includes("compasslanddfc")
			);
		},
		is_adventure() {
			return this.card.layout === "adventure";
		},
		is_planeswalker() {
			return this.card_face?.type_line?.toLowerCase().includes("planeswalker");
		},
		is_large_planeswalker() {
			return this.is_planeswalker && this.planeswalker_abilities.length > 3;
		},
		is_saga() {
			return (
				this.card_face?.layout === "saga" ||
				contains(this.card_face?.type_line, "Saga")
			);
		},
		is_vehicle() {
			if (!this.card?.type_line) return false;
			return contains(this.card_face.type_line, ["Vehicle", "Véhicule"]);
		},
		is_dualfaced() {
			return this.card.card_faces && !this.is_adventure;
		},
		is_mdfc() {
			return this.card.layout === "modal_dfc";
		},
		is_transform() {
			return this.card.layout === "transform";
		},
		mana_cost() {
			if (!this.card_face?.mana_cost) return [];
			return [...this.card_face.mana_cost.matchAll(mana_regex)].map((m) =>
				["archive", "japanese-archive"].includes(this.card_face?.art_variant)
					? new URL(
							`../assets/img/archives_symbols/${m[1]}.svg`,
							import.meta.url
					  ).href
					: mana_symbols[m[0]].svg_uri
			);
		},
		adventure_mana_cost() {
			if (!this.card?.card_faces?.[1]?.mana_cost) return [];
			return [...this.card.card_faces[1].mana_cost.matchAll(mana_regex)].map(
				(m) => mana_symbols[m[0]].svg_uri
			);
		},
		mdfc_back_mana_cost() {
			if (!this.card?.card_faces?.[(this.currentFace + 1) % 2]?.mana_cost)
				return [];
			return [
				...this.card.card_faces[(this.currentFace + 1) % 2].mana_cost.matchAll(
					mana_regex
				),
			].map((m) => mana_symbols[m[0]].svg_uri);
		},
		mdfc_hint_text() {
			return (
				this.card_face.mdfc_hint ??
				this.back_face?.type_line
					?.substr(this.back_face.type_line.indexOf("—") + 1)
					.trim()
			);
		},
		extended_art() {
			return ["extended", "full", "full-footer"].includes(
				(this.is_adventure ? this.card : this.card_face).art_variant
			);
		},
		oracle_lines() {
			if (!this.card_face?.oracle_text) return [];
			return this.card_face.oracle_text.split("\n").map(this.parse_oracle);
		},
		adventure_oracle_lines() {
			if (!this.card.card_faces?.[1]?.oracle_text) return [];
			return this.card.card_faces[1].oracle_text
				.split("\n")
				.map(this.parse_oracle);
		},
		saga_reminder() {
			if (!this.card_face?.oracle_text) return "";
			return this.parse_oracle(this.card_face.oracle_text.split("\n")[0]);
		},
		saga_steps() {
			return this.card_face.oracle_text
				.split("\n")
				.filter((s) => s.match(/^(.+) — /))
				.map(this.parse_oracle)
				.map((str) => {
					const m = str.match(/(.+) — (.+)/);
					return {
						steps: m[1]
							.split(",")
							.map(
								(s) =>
									new URL(`../assets/img/saga/${s.trim()}.png`, import.meta.url)
										.href
							),
						html: m[2],
					};
				});
		},
		planeswalker_abilities() {
			if (!this.is_planeswalker) return null;
			return this.card_face.oracle_text
				.split("\n")
				.map(this.parse_oracle)
				.map((line) => {
					const r = { html: line, cost: null };
					const m = line.match(/^[+-−]?(\d+):/);
					if (m) {
						if (line[0] === "0") {
							r.cost = 0;
						} else if (line[0] === "+") {
							r.cost = parseInt(m[1]);
						} else r.cost = -parseInt(m[1]);
						r.html = line.substr(m[0].length + 1);
					}
					return r;
				});
		},
		copyright() {
			return (
				this.card?.copyright ??
				`™ & © ${new Date().getFullYear()} Wizards of the Coast`
			);
		},
		colors() {
			return this.compute_colors(this.card_face);
		},
		boxes_colors() {
			return this.colors === "Vehicle"
				? "Artifact"
				: this.is_land // FIXME: Fixes colors for cards like 'Agadeem, the Undercrypt', but may cause problem elsewhere?
				? "Land"
				: this.colors.length > 1 && this.colors.length < 5
				? "Gold"
				: this.colors;
		},
		background() {
			const folder = this.is_planeswalker
				? this.is_large_planeswalker
					? "planeswalker_large_bg"
					: "planeswalker_bg"
				: this.is_saga
				? "saga_bg"
				: this.card.frame_effects?.includes("compasslanddfc") &&
				  this.currentFace === 1
				? "ixalan_bg"
				: "bg";
			return `url(${
				new URL(
					`../assets/img/${folder}/${
						this.is_vehicle ? "Vehicle" : this.boxes_colors
					}.png`,
					import.meta.url
				).href
			})`;
		},
		frame() {
			let folder = this.is_adventure
				? "adventure_frames"
				: this.is_saga
				? "saga_frames"
				: this.is_planeswalker
				? this.is_large_planeswalker
					? "planeswalker_large_frames"
					: "planeswalker_frames"
				: this.is_mdfc
				? "mdfc_frames"
				: this.is_transform
				? this.currentFace === 0
					? "transform_frames"
					: "transform_back_frames"
				: "frames";
			if (this.extended_art && !this.is_saga) folder = "extended_" + folder;
			const colors =
				this.colors === "Artifact" && this.card_face?.colors?.length === 1
					? this.card_face.colors[0]
					: this.colors;
			return `url(${
				new URL(`../assets/img/${folder}/${colors}.png`, import.meta.url).href
			})`;
		},
		boxes() {
			const folder = this.is_planeswalker
				? "planeswalker_boxes"
				: this.is_mdfc || this.is_transform
				? this.currentFace === 0
					? "mdfc_boxes"
					: "mdfc_back_boxes"
				: this.extended_art
				? "extended_boxes"
				: "boxes";
			return `url(${
				new URL(
					`../assets/img/${folder}/${this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		mid_boxes() {
			return this.extended_art && !this.is_planeswalker
				? `url(${
						new URL(
							`../assets/img/extended_boxes/${this.boxes_colors}.png`,
							import.meta.url
						).href
				  })`
				: this.boxes;
		},
		legendary_crown() {
			const colors =
				this.colors === "Artifact" && this.card_face?.colors?.length === 1
					? this.card_face.colors[0]
					: this.colors;
			const folder = this.extended_art
				? "extended_legendary_crowns"
				: "legendary_crowns";
			return `url(${
				new URL(`../assets/img/${folder}/${colors}.png`, import.meta.url).href
			})`;
		},
		pt_box() {
			return `url(${
				new URL(
					`../assets/img/${
						(this.is_mdfc || this.is_transform) && this.currentFace === 1
							? "transform_back_pt_boxes"
							: "pt_boxes"
					}/${this.is_vehicle ? "Vehicle" : this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		saga_text_box() {
			return `url(${
				new URL(
					`../assets/img/saga_textboxes/${this.boxes_colors}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_icon() {
			return `url(${
				new URL(
					`../assets/img/mdfc${this.currentFace === 0 ? "" : "_back"}_icons/${
						this.boxes_colors === "Land" ? this.colors : this.boxes_colors
					}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_hint() {
			let colors = this.compute_colors(this.back_face);
			if (colors.length > 1 && colors.length < 5) colors = "Gold";
			return `url(${
				new URL(
					`../assets/img/mdfc${
						this.currentFace === 0 ? "" : "_back"
					}_hints/${colors}.png`,
					import.meta.url
				).href
			})`;
		},
		mdfc_hint_color() {
			return this.currentFace === 0 ? "white" : "black";
		},
		transform_icon() {
			return `url(${
				new URL(
					`../assets/img/transform${
						this.currentFace === 0 ? "" : "_back"
					}_icons/${
						this.card.frame_effects?.[0] ?? "sunmoondfc"
					}.png` /* FIXME: Pretty sure this will break at some point */,
					import.meta.url
				).href
			})`;
		},
		pt_box_color() {
			return this.is_vehicle || (this.is_transform && this.currentFace === 1)
				? "white"
				: "black";
		},
		top_line_color() {
			return this.is_mdfc
				? this.currentFace === 0
					? "black"
					: "white"
				: this.is_transform && this.currentFace === 1 && !this.is_planeswalker
				? "white"
				: "black";
		},
		mid_line_color() {
			return (this.extended_art &&
				!this.is_planeswalker &&
				(!this.is_transform || this.currentFace === 0)) ||
				((this.is_transform || this.is_mdfc) &&
					this.currentFace === 1 &&
					!this.is_planeswalker)
				? "white"
				: "black";
		},
		color_indicator() {
			return new URL(
				`../assets/img/color_indicators/${[...this.card_face.color_indicator]
					.sort((lhs, rhs) => "WUBRG".indexOf(lhs) - "WUBRG".indexOf(rhs))
					.join("")}.png`,
				import.meta.url
			).href;
		},
		illustration() {
			return `url(${
				(this.is_adventure ? this.card : this.card_face)?.image_uris?.art_crop
			})`;
		},
		illustration_scale() {
			return (
				(this.is_adventure ? this.card : this.card_face)?.illustration_scale ??
				1
			);
		},
		illustration_position() {
			const card = this.is_adventure ? this.card : this.card_face;
			return card?.illustration_position
				? {
						x: card?.illustration_position.x + "mm",
						y: card?.illustration_position.y + "mm",
				  }
				: { x: "0mm", y: "0mm" };
		},
		set_icon_uri() {
			if (this.card.set_icon) return this.card.set_icon;
			if (sets_with_icons.includes(this.card?.set))
				return new URL(
					`../assets/img/set_icons/${this.card?.set}_${
						this.card?.rarity ?? "common"
					}.png`,
					import.meta.url
				).href;
			return null;
		},
		archive_frame_colors() {
			const colors = this.card_face?.color_identity ?? this.card_face?.colors;
			if (!colors)
				return Object.assign(
					{
						left: ArchiveFrameColors["Gold"],
						right: ArchiveFrameColors["Gold"],
					},
					ArchiveFrameColors["Gold"]
				);
			return Object.assign(
				{
					left: ArchiveFrameColors[colors[0]] ?? ArchiveFrameColors["Gold"],
					right:
						ArchiveFrameColors[colors[colors.length === 1 ? 0 : 1]] ??
						ArchiveFrameColors["Gold"],
				},
				colors.length > 1 || ArchiveFrameColors[colors[0]]
					? ArchiveFrameColors["Gold"]
					: ArchiveFrameColors[colors[0]]
			);
		},
		japanese_color() {
			return this.card_face?.colors?.length === 1
				? ArchiveColors[this.card_face.colors[0]]
				: "#927c43";
		},
		japanese_name_color() {
			if (this.card_face?.colors?.length === 2)
				return `linear-gradient(to right, ${
					ArchiveColors[this.card_face.colors[0]]
				}, ${ArchiveColors[this.card_face.colors[1]]})`;
			return this.japanese_color;
		},
		/* These don't appear in the render, great \o/ */
		japanese_type_line_border() {
			const c0 =
				this.card_face?.colors?.length === 2
					? ArchiveColors[this.card_face.colors[0]]
					: this.japanese_color;
			const c1 =
				this.card_face?.colors?.length === 2
					? ArchiveColors[this.card_face.colors[1]]
					: c0;
			return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-0.05 -0.05 1.1 1.1'><defs><linearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' stop-color='${c0}' /><stop offset='100%25' stop-color='${c1}' /></linearGradient></defs><path d='M 0.2 0 c -0.1 0.125 -0.2 0.25 -0.2 0.5 c 0 0.25 0.1 0.375 0.2 0.5 l 0.6 0 c 0.1 -0.125 0.2 -0.25 0.2 -0.5 c 0 -0.25 -0.1 -0.375 -0.2 -0.5 Z' stroke='url(%23gradient)' stroke-width='0.1' fill='none'/></svg>")`.replaceAll(
				"#",
				"%23"
			);
		},
		japanese_oracle_border() {
			const c0 =
				this.card_face?.colors?.length === 2
					? ArchiveColors[this.card_face.colors[0]]
					: this.japanese_color;
			const c1 =
				this.card_face?.colors?.length === 2
					? ArchiveColors[this.card_face.colors[1]]
					: c0;
			return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' stop-color='${c0}' /><stop offset='100%25' stop-color='${c1}' /></linearGradient></defs><rect x='0' y='0' width='100' height='100' fill='url(%23gradient)' /></svg>")`.replaceAll(
				"#",
				"%23"
			);
		},
	},
	watch: {
		"card.oracle_text": function () {
			this.fit_oracle_text();
		},
		"card.type_line": function () {
			this.fit_type_line();
		},
		"card.card_faces": function () {
			this.fit();
		},
	},
};
</script>

<style scoped>
@font-face {
	font-family: "Beleren";
	src: url("../assets/fonts/beleren-bold_P1.01.ttf") format("truetype");
}

@font-face {
	font-family: "Beleren Small Caps";
	src: url("../assets/fonts/belerensmallcaps-bold.ttf") format("truetype");
}

@font-face {
	font-family: "MPlantin";
	src: url("../assets/fonts/mplantin.eot") format("eot"),
		url("../assets/fonts/mplantin.woff") format("woff"),
		url("../assets/fonts/mplantin.ttf") format("truetype");
}

@font-face {
	font-family: "MPlantin-Italic";
	src: url("../assets/fonts/MPlantin-Italic.ttf") format("truetype");
	font-style: italic;
}

@font-face {
	font-family: "Relay Medium";
	src: url("../assets/fonts/relay-medium.ttf") format("truetype");
}

@font-face {
	font-family: "Relay Wide Medium";
	src: url("../assets/fonts/relaywide-medium.ttf") format("truetype");
}

.mtg-card {
	position: relative;
	width: 63.5mm;
	height: 88.9mm;
	border-radius: 3mm;
	padding: 2.25mm;
	background-color: black;

	font-family: Beleren;
	font-size: 3mm;
	text-rendering: geometricPrecision;

	box-sizing: border-box;
}

.inner-background {
	position: absolute;
	left: calc((63.5mm - 58.5mm) / 2);
	width: 58.5mm;
	height: 78mm;
	margin: auto;
	border-radius: 0.75mm 0.75mm 4mm 4mm;
	overflow-y: visible;
	background-image: v-bind(background);
	background-size: 100%;
	padding-top: 1.1mm;
	background-repeat: no-repeat;

	pointer-events: none;
	user-select: none;
}

.inner-frame {
	position: absolute;
	margin: auto;
	width: calc(58.5mm * 0.98);
	top: 3.5mm;
	left: calc((63.5mm - 58.5mm * 0.98) / 2);
	height: 79mm;
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black)
		drop-shadow(0.1mm -0.2mm 0.1mm #ffffffa0);
	background-image: v-bind(frame);
	background-size: 100%;
	background-repeat: no-repeat;
	padding-top: 0.508mm;

	pointer-events: none;
	user-select: none;
}

.has-legendary-crown .inner-background {
	background-position: 0 -1.3mm;
	margin-top: 1.3mm;
}

.has-legendary-crown .inner-frame {
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black);
}

.legendary-crown {
	position: absolute;
	left: 1mm;
	top: 1.5mm;
	width: 61.1mm;
	height: 14mm;
	background-image: v-bind(legendary_crown);
	background-size: 100%;
	background-repeat: no-repeat;
}

.extended-art .legendary-crown,
.full-art .legendary-crown {
	top: 1.2mm;
}

.top-line,
.mid-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 5.1mm;
	width: 53.8mm;
	margin: auto;
	padding: 0 1mm 0 1.5mm;
	background-image: v-bind(boxes);
	background-size: 100%;

	pointer-events: initial;
	user-select: initial;
}

.top-line {
	position: absolute;
	top: 4mm;
	left: 0;
	right: 0;
	color: v-bind(top_line_color);
	gap: 1.5mm;
}

.name {
	font-size: 9.454pt;
	white-space: nowrap;
	letter-spacing: 0.034mm;
}

.mana-cost {
	font-size: 6.4pt;
	display: flex;
	gap: 0.24mm;
	margin-top: -0.4mm;
}

.mana-cost .ms,
.adventure-mana-cost .ms {
	width: 1.35em;
	border-radius: 50%;
	box-shadow: -0.2mm 0.2mm 0 rgba(0, 0, 0, 0.85);
}

.illustration {
	position: absolute;
	top: 9.8mm;
	left: 4.4mm;
	width: 54.7mm;
	height: 39.9mm;
	margin: auto;
	background-image: v-bind(illustration);
	background-color: yellow;
	background-size: calc(v-bind(illustration_scale) * 100%);
	background-position: v-bind(illustration_position.x)
		v-bind(illustration_position.y);
	background-repeat: no-repeat;
	cursor: grab;
}

.mtg-card:not(.full-art):not(.extended-art):not(.compasslanddfc.back)
	.illustration {
	box-shadow: inset 0.2mm -0.2mm 0.2mm black;
}

.extended-art .illustration {
	left: 0;
	top: 7mm;
	width: 100%;
	height: 48mm;
	background-color: black;
	mask-image: linear-gradient(
		rgba(0, 0, 0, 0) 0,
		rgba(0, 0, 0, 1) 6%,
		rgba(0, 0, 0, 1) 94%,
		rgba(0, 0, 0, 0) 100%
	);
}

.mid-line {
	position: absolute;
	top: 49.9mm;
	left: 0;
	right: 0;
	background-position: 0 bottom;
	gap: 0.6mm;
	color: v-bind(mid_line_color);
	background-image: v-bind(mid_boxes);
}

.color-indicator {
	width: 2.8mm;
	margin-left: -0.5mm;
}

.type-line {
	font-size: 8pt;
	height: 5mm;
	line-height: 5mm;
	flex-grow: 1;
	white-space: nowrap;
	margin-top: -0.2mm;
}

.set-icon-container {
	height: 3.9mm;
	width: 7mm;
	margin-right: 0.3mm;
	display: flex;
	justify-content: right;
	align-items: center;
	margin-top: -0.2mm;
}

.set-icon {
	max-height: 100%;
	max-width: 100%;
}

.oracle {
	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

.oracle:deep(.ms) {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: baseline;
}

.normal-oracle {
	position: absolute;
	top: 55.6mm;
	left: 0;
	right: 0;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;

	width: 53.8mm;
	height: 26mm;
	margin: auto;
}

/* Workaround the fact that adventure frames have a sligthly larger ratio */
.adventure .inner-frame {
	width: 57.4mm;
	left: 2.9mm;
}

.adventure .mid-line {
	top: 49.7mm;
}

.adventure-main-oracle {
	position: absolute;
	top: 54.9mm;
	left: 33mm;
	width: 25.5mm;
	height: 25mm;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;
}

.adventure-part {
	position: absolute;
	top: 55.3mm;
	left: 5mm;
	width: 26mm;
	height: 25.2mm;

	display: flex;
	align-items: stretch;
	flex-direction: column;
}

.adventure-top-line,
.adventure-type {
	color: white;
	height: 4.2mm;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 7pt;
	line-height: 7pt;
	flex-shrink: 0;
	margin-left: 0.6mm;
}

.adventure-mana-cost {
	display: flex;
	font-size: 5pt;
	gap: 0.3mm;
	margin-top: -0.4mm;
	margin-right: 0.5mm;
}

.adventure-oracle {
	flex-grow: 1;
	margin: 0.8mm 0 0.2mm 0;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.8mm;

	font-family: MPlantin;
	font-size: 8pt;
	line-height: 1em;

	pointer-events: initial;
	user-select: initial;
}

/************** Saga *************/

.saga .inner-background {
	top: 2.5mm;
}

.saga .inner-frame {
	top: 3.66mm;
	margin: 0;
	width: 58.5mm;
	margin-left: -1mm;
}

.saga .saga-frame {
	position: absolute;
	top: 0;
	left: -2.8mm;
	width: 10mm;
	height: 100%;
	background-image: v-bind(frame);
	background-size: 58.5mm;
	background-position: 0 -6.3mm;
	background-repeat: no-repeat;
	pointer-events: none;
}

.saga .mid-line,
.saga .top-line {
	top: 4.2mm;
	left: 0.1mm;
}

.saga .mid-line {
	top: 75.2mm;
}

.saga .illustration {
	width: 27.3mm;
	height: 64.3mm;
	top: 10mm;
	left: 31.8mm;
	outline-offset: 0;
}

.saga-oracle {
	position: absolute;
	left: 4.9mm;
	top: 9.95mm;
	width: 26.6mm;
	height: 64.3mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.saga-reminder {
	height: 12mm;
	font-size: 7.3pt;
	line-height: 7.3pt;
	padding: 2mm 0.7mm 2mm 0.7mm;
}

.saga-steps {
	display: flex;
	align-items: stretch;
	justify-content: stretch;
	flex-direction: column;
	gap: 0.8mm;
	padding-left: 2.15mm;
	height: 47.5mm;
}

.saga-step {
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	box-shadow: 0 -0.35mm 0.5mm #00000020;
	padding: 1.35mm;
	flex-grow: 1;
	line-height: 1em;
}

.saga-step-number {
	position: absolute;
	width: 5mm;
	top: 50%;
	transform: translateY(-50%);
	left: -4.65mm;
	z-index: 4;
}

.saga-step-number img {
	width: 5mm;
}

/* Planeswalkers */

.planeswalker .inner-frame {
	top: 2.36mm;
	left: 3mm;
	width: calc(58mm - 2px);
	height: 80mm;
}

.planeswalker .top-line,
.planeswalker .mid-line {
	width: 53.75mm;
}

.planeswalker .top-line {
	top: 3mm;
}

.planeswalker .mid-line {
	top: 49.6mm;
}

.planeswalker-large .mid-line {
	top: 43.6mm;
}

.planeswalker .illustration {
	position: absolute;
	left: 4mm;
	top: 8.2mm;
	width: 55mm;
	height: 39mm;
	/*border-radius: 2mm/50%;*/
}

.planeswalker .illustration.behind-textbox {
	background-color: white;
	height: 73mm;
	z-index: -1;
}

.planeswalker.extended-art .illustration.behind-textbox {
	top: 6mm;
	height: 75mm;
	mask-image: linear-gradient(
		rgba(0, 0, 0, 0) 0,
		rgba(0, 0, 0, 1) 3%,
		rgba(0, 0, 0, 1) 97%,
		rgba(0, 0, 0, 0) 100%
	);
	left: 0;
	right: 0;
	width: 100%;
}

.planeswalker:not(.full-art):not(.extended-art) .illustration.behind-textbox {
	border-radius: 2mm / calc(39mm / 2);
	border-bottom-left-radius: 4mm 3mm;
	border-bottom-right-radius: 2mm;
}

.planeswalker.extended-art .illustration,
.planeswalker.full-art .illustration {
	z-index: auto;
}

.planeswalker.full-art .illustration,
.full-art .illustration {
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: initial;
}

.planeswalker-oracle-bg {
	position: absolute;
	left: 7.4mm;
	top: 55.6mm;
	width: 51.2mm;
	height: 25.35mm;
	background-color: #ffffff90;
	border-radius: 0.9mm;
	border-bottom-left-radius: 8mm 2.1mm;
	border-bottom-right-radius: 8mm 2.1mm;
	box-shadow: inset -0.2mm -0.2mm 0.2mm #00000080,
		inset 0.2mm 0.2mm 0.2mm #00000080;
}

.planeswalker-large .planeswalker-oracle-bg {
	top: 49.5mm;
	height: 31.45mm;
}

.planeswalker-oracle {
	position: absolute;
	left: 2.8mm;
	top: 55.7mm;

	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: column;
	gap: 0.4mm;

	width: 49.5mm;
	height: 24mm;

	padding: 0.5mm;
	padding-left: 5.5mm;
	padding-bottom: 1mm;
}

.planeswalker-large .planeswalker-oracle {
	top: 49mm;
	height: 31.04mm;
}

.planeswalker-ability {
	position: relative;
	flex-shrink: 0;
	padding: 0.4mm 0.4em;
	z-index: 0;
}

.planeswalker-ability:nth-child(2n + 1):before {
	content: "";
	position: absolute;
	left: -0.6mm;
	right: -0.6mm;
	top: -1.2mm;
	bottom: -1.2mm;
	background-color: #fff6;
	mask-image: linear-gradient(
			transparent,
			transparent 1.2mm,
			black 1.2mm,
			black calc(100% - 1.2mm),
			transparent calc(100% - 1.2mm),
			transparent
		),
		url("../assets/img/planeswalker_ability_top.png"),
		url("../assets/img/planeswalker_ability_bottom.png");
	mask-size: 100%, 100%, 100%;
	mask-position: 0 0, 0 0, 0 100%;
	mask-repeat: repeat-x;
	mask-composite: add;
	z-index: -1;
}

.planeswalker-ability-with-cost:nth-child(2n + 1):before {
	left: -3.1mm;
	right: -0.6mm;
}

.planeswalker-ability:nth-child(1):before {
	border-top-left-radius: 1mm;
	border-top-right-radius: 1mm;
	mask-image: linear-gradient(
			black calc(100% - 1.2mm),
			transparent calc(100% - 1.2mm),
			transparent
		),
		url("../assets/img/planeswalker_ability_bottom.png");
	mask-size: 100%, 100%;
	mask-position: 0 0, 0 100%;
	mask-composite: add;
	top: -0.1mm;
}

.planeswalker:not(.planeswalker-large)
	.planeswalker-ability:nth-child(3):before {
	mask-image: linear-gradient(transparent, transparent 1.2mm, black 1.2mm),
		url("../assets/img/planeswalker_ability_top.png");
	mask-size: 100%, 100%;
	mask-position: 0 0, 0 0;
	bottom: -1mm;
	border-bottom-left-radius: 10mm 2mm;
}

.planeswalker-ability-with-cost {
	margin-left: 2.5mm;
	min-height: 4.8mm;
	flex-grow: 1;
	display: flex;
	align-items: center;
	padding: 0.4mm 0;
}

.planeswalker-ability-cost {
	position: absolute;
	left: -8.5mm;
	top: 50%;
	transform: translateY(-50%);
	background-size: 100%;
	background-repeat: no-repeat;
	width: 7mm;
	color: white;
	font-size: 7pt;
	text-align: center;
	font-family: Beleren;
}

.planeswalker-ability-cost-plus {
	background-image: url("../assets/img/planeswalker/LoyaltyPlus.png");
	height: 4.7mm;
	line-height: 5mm;
}

.planeswalker-ability-cost-zero {
	background-image: url("../assets/img/planeswalker/LoyaltyZero.png");
	height: 4.2mm;
	line-height: 3.8mm;
}

.planeswalker-ability-cost-minus {
	background-image: url("../assets/img/planeswalker/LoyaltyMinus.png");
	height: 4.7mm;
	line-height: 3.8mm;
}

.planeswalker-ability-cost::after {
	content: ":";
	position: absolute;
	right: -0.7mm;
	top: 50%;
	transform: translateY(-50%);
	color: black;
	font-family: MPlantin;
	font-size: 8pt;
}

.planeswalker-ability-cost-minus::after {
	top: 1.7mm;
}

.planeswalker-ability-cost-zero::after {
	top: 1.7mm;
}

.planeswalker .footer {
	top: 83mm;
}

.oracle-inner,
.oracle-flavor,
.oracle-reminder {
	margin: 0 0.44mm;
}

.oracle-flavor hr {
	border: 0;
	height: 0.25mm;
	background-image: linear-gradient(
		to right,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0.2) 20%,
		rgba(0, 0, 0, 0.2) 80%,
		rgba(0, 0, 0, 0)
	);
	margin-top: 0.2mm;
	margin-bottom: 0.8mm;
}

.oracle-flavor,
:deep(.oracle-reminder) {
	font-family: MPlantin-Italic;
	font-style: italic;
}

.pt-box {
	position: absolute;
	right: 3mm;
	bottom: 2.6mm;
	width: 11.58mm;
	height: 7.4mm;
	background-image: v-bind(pt_box);
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 5.5mm;
	font-size: 9.6pt;
	color: v-bind(pt_box_color);

	pointer-events: initial;
	user-select: initial;

	z-index: 3;
}

.loyalty {
	position: absolute;
	right: 3mm;
	bottom: 5mm;
	width: 9.8mm;
	height: 5.8mm;
	background-image: url("../assets/img/planeswalker/Loyalty.png");
	background-size: 100% 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 6.4mm;
	font-size: 9.5pt;
	color: white;

	pointer-events: initial;
	user-select: initial;
	z-index: 3;
}

.footer {
	position: absolute;
	top: 82.91mm;
	left: 50%;
	transform: translateX(-50%);

	width: 55mm;
	margin: auto;

	display: flex;
	justify-content: space-between;
	color: white;
	font-family: Relay Wide Medium;
	font-size: 3.9pt;

	z-index: 3;
}

.footer-left > div,
.footer-right > div {
	height: 1.35mm;
}

.collector-number {
	letter-spacing: 0.2mm;
}

.copyright {
	font-family: MPlantin;
	margin-top: 0.2mm; /* FIXME: Workaround a weird upshift using this font */
	font-size: 4pt;
}

.copyright div {
	min-height: 2mm;
}

.set {
	letter-spacing: 0.23mm;
}

.language {
	letter-spacing: 0.15mm;
}

.artist-icon {
	font-family: NDPMTG;
}

.artist-name {
	font-family: Beleren Small Caps;
	font-size: 4.5pt;
}

.flip-icon {
	position: absolute;
	bottom: -12mm;
	left: 50%;
	font-size: 10mm;
	user-select: none;
	cursor: pointer;
	transform: translateX(-50%) rotateX(60deg);
}

.mdfc:not(.planeswalker) .inner-frame {
	width: 58.8mm;
	left: 1.6mm;
}

.mdfc .top-line .name {
	padding-left: 5mm;
}

.mdfc.legendary:not(.planeswalker) .inner-frame {
	/* Workdaround to hide frame behind the legendary crown */
	border-top-left-radius: 10mm;
}

.mdfc .normal-oracle {
	height: 22.6mm;
	left: 0;
}

.mdfc .planeswalker-oracle {
	height: 22mm;
}

.mdfc.planeswalker-large .planeswalker-oracle {
	height: 29mm;
}

.mdfc-icon {
	position: absolute;
	top: 4.1mm;
	left: 2.5mm;
	width: 5.8mm;
	aspect-ratio: calc(294 / 238);
	background-image: v-bind(mdfc_icon);
	background-size: 100%;
	z-index: 3;
}

.planeswalker .mdfc-icon {
	top: 3mm;
}

.mdfc-hint {
	position: absolute;
	bottom: 6.2mm;
	left: 1.6mm;
	width: 28mm;
	height: 3.9mm;

	display: flex;
	justify-content: space-between;
	align-content: stretch;
	align-items: center;

	font-size: 5pt;
	color: v-bind(mdfc_hint_color);
	background-image: v-bind(mdfc_hint);
	background-size: 100%;

	padding: 0 2.6mm;
	padding-top: 0.1mm; /* FIXME: Shouldn't be needed? */

	box-sizing: border-box;
	z-index: 3;
}

.planeswalker .mdfc-hint {
	bottom: 6mm;
}

.mdfc-hint span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex-shrink: 1;
	max-width: 20mm;
}

.mdfc-hint .mana-cost {
	font-size: 4pt;
}

/* Transform */

.transform:not(.back):not(.planeswalker) .inner-frame {
	left: 2.9mm;
	width: 58.5mm;
}

.transform:not(.planeswalker) .inner-frame {
	top: 3.7mm;
	left: 2.9mm;
	width: 57.4mm;
	height: 78.1mm;
	background-size: 100% 100%;
}

.transform:not(.planeswalker) .top-line {
	top: 4.2mm;
}

.transform .top-line .name {
	padding-left: 5.2mm;
}

.transform-icon {
	position: absolute;
	top: 4mm;
	left: 3.5mm;
	width: 5.4mm;
	aspect-ratio: 1;
	border-radius: 50%;
	border: 0.02mm black solid; /* Fixme: Border is too thick on renders */
	box-sizing: border-box;
	background-color: white;
	background-image: v-bind(transform_icon);
	background-size: 4.7mm;
	background-position: center center;
	background-repeat: no-repeat;
	z-index: 3;
}

.planeswalker .transform-icon {
	top: 3mm;
}

.transform-hint {
	position: absolute;
	bottom: 11.2mm;
	right: 5.2mm;
	z-index: 3;
	font-family: Beleren;
	font-size: 6.8pt;
	color: #666;
}

/* Ixalan maps */

.compasslanddfc.back .inner-frame {
	background-image: none;
	filter: none;
}

.compasslanddfc.back .name {
	font-family: Beleren Small Caps;
	padding: 0;
	margin: 0;
}

.compasslanddfc.back .illustration {
	top: 9.2mm;
	left: 3mm;
	right: 3mm;
	width: auto;
	height: 40mm;
	z-index: -1;
}

.compasslanddfc.back .top-line,
.compasslanddfc.back .mid-line {
	background-image: none;
	justify-content: center;
	margin: 0;
	padding: 0;
	color: black;
	left: 0;
	right: 0;
	width: 100%;
}

.compasslanddfc.back .type-line {
	text-align: center;
}

.compasslanddfc.back .oracle {
	top: 55.9mm;
	left: 7mm;
	right: 7.6mm;
	bottom: 10mm;
	width: auto;
	height: auto;
}

.compasslanddfc.back .set-icon-container {
	position: absolute;
	top: -40.8mm;
	left: 50%;
	transform: translate(-50%);
	justify-content: center;
}

.compasslanddfc.back .transform-icon {
	display: none; /* Embeded in the background */
}

.archive .inner-frame {
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	filter: none;
	background: none;

	--primary: v-bind(archive_frame_colors.primary);
	--lighter: v-bind(archive_frame_colors.lighter);
	--darker: v-bind(archive_frame_colors.darker);
	--left-primary: v-bind(archive_frame_colors.left.primary);
	--left-lighter: v-bind(archive_frame_colors.left.lighter);
	--left-darker: v-bind(archive_frame_colors.left.darker);
	--right-primary: v-bind(archive_frame_colors.right.primary);
	--right-lighter: v-bind(archive_frame_colors.right.lighter);
	--right-darker: v-bind(archive_frame_colors.right.darker);
}

.archive .inner-frame svg {
	width: 100%;
}

.archive .top-line,
.archive .mid-line,
.archive .oracle {
	background-image: none;
	color: #222;
}

.archive .top-line .mana-cost .ms {
	width: 3.6mm;
	opacity: 0.8;
}

.archive .top-line .mana-cost .ms-shadow {
	box-shadow: initial;
}

/* Japanse Mystical Archive */

.japanese-archive .inner-frame,
.japanese-archive .top-line,
.japanese-archive .mid-line {
	background-image: none;
}

.japanese-archive .legendary-crown {
	display: none;
}

.japanese-archive .name {
	background-color: v-bind(japanese_color);
	background-image: v-bind(japanese_name_color);
	color: #fff;
	padding: 1mm 2mm;
	border-radius: 1.5mm;
	outline-style: solid;
	outline-color: v-bind(japanese_color);
	outline-width: 0.6mm;
	outline-offset: 0.4mm;
}

.japanese-archive .top-line .mana-cost .ms {
	width: 4.2mm;
}

.japanese-archive .top-line .mana-cost .ms-shadow {
	box-shadow: initial;
}

.japanese-archive .type-line,
.japanese-archive .oracle {
	background-color: #ffffffa0;
	border: 0.22mm solid v-bind(japanese_color); /* FIXME: Should be a gradient when multicolored */
}

.japanese-archive .oracle {
	outline: #0005;
	outline-width: 0.1mm;
	outline-offset: -0.6mm;
	outline-style: solid;
	padding: 0.4mm 0.8mm;
	box-sizing: border-box;

	border-image-source: v-bind(japanese_oracle_border);
	border-image-slice: 10%;
	border-image-width: 0.22mm;
	border-image-repeat: round;
}

.japanese-archive .type-line {
	border-radius: 1mm/50%;
	position: absolute;
	left: 0.4mm;
	padding: 0 3mm;
	height: 4mm;
	line-height: 4mm;
	max-width: 40mm;

	border-image-source: v-bind(japanese_type_line_border);
	border-image-slice: 50% 50%;
	border-image-width: 50% 1.5mm;
}

.japanese-archive .set-icon-container {
	position: absolute;
	right: 0;
}

.full-footer .illustration,
.japanese-archive .illustration {
	background-color: #ffffff;
	clip-path: url(#full-art-clip-path);
}

.full-footer.planeswalker .illustration {
	clip-path: url(#full-art-planeswalker-clip-path);
}

/* Extend art as much as possible when adding a bordering while rendering */

.rendering.extended-art .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) *
			(100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(
			v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		)
		calc(v-bind(illustration_position.y));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

.rendering.full-art:not(.full-footer):not(.japanese-archive) .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	height: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) *
			(100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(
			v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		)
		calc(
			v-bind(illustration_position.y) + 1mm * v-bind(renderMargin) *
				v-bind(scale)
		);
	top: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	bottom: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

/* Debug */

.debug-overlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	width: 63.5mm;
	height: 100%;
	opacity: v-bind(debug_opacity);
}

.debug-overlay:hover {
	opacity: 1;
}

.debug-overlay > div {
	overflow: hidden;
	position: relative;
	pointer-events: none;
}

.debug-overlay > div:after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	width: 0.5px;
	height: 100%;
	background-color: #0008;
}

.debug-overlay > div > img {
	width: 63.5mm;
}

.debug-controls {
	position: absolute;
	bottom: -4em;
}
</style>

<style type="text/css">
.gold {
	fill: #f5d54e;
}
.background-color {
	fill: #ecdfbf;
	filter: url(#noise);
}
.background-feature {
	fill: transparent;
	stroke: #cfac58;
	stroke-width: 0.07;
	opacity: 0.6;
}
.top-feature {
	fill: transparent;
	stroke: #000000;
	stroke-width: 0.03;
	opacity: 0.1;
}
.primary-color {
	fill: var(--primary, #0e3d95);
}
.lighter-color {
	fill: var(--lighter, #125faf);
}
.darker-color {
	fill: var(--darker, #13316d);
}
.primary-left-color {
	fill: var(--left-primary, #0e3d95);
}
.lighter-left-color {
	fill: var(--left-lighter, #125faf);
}
.darker-left-color {
	fill: var(--left-darker, #13316d);
}
.primary-right-color {
	fill: var(--right-primary, #0e3d95);
}
.lighter-right-color {
	fill: var(--right-lighter, #125faf);
}
.darker-right-color {
	fill: var(--right-darker, #13316d);
}
</style>
