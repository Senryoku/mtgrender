<template>
	<svg
		style="
			position: absolute;
			top: 0.7mm;
			left: 0;
			z-index: -1;
			width: 9mm;
			height: 6mm;
		"
		viewBox="-3 0 34 22"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		id="level-box-bg"
		preserveAspectRatio="none"
	>
		<defs>
			<filter id="inset-shadow">
				<feOffset dx="1" dy="-1" />
				<feGaussianBlur
					stdDeviation="1"
					result="offset-blur"
				/>
				<feComposite
					operator="out"
					in="SourceGraphic"
					in2="offset-blur"
					result="inverse"
				/>
				<feFlood
					flood-color="black"
					flood-opacity="1"
					result="color"
				/>
				<feComposite
					operator="in"
					in="color"
					in2="inverse"
					result="shadow"
				/>
				<feComponentTransfer
					in="shadow"
					result="shadow"
				>
					<feFuncA type="linear" slope="1" />
				</feComponentTransfer>
				<feComposite
					operator="over"
					in="shadow"
					in2="SourceGraphic"
				/>
			</filter>
			<filter id="drop-shadow">
				<feComponentTransfer>
					<feFuncR type="linear" slope="1.2" />
					<feFuncG type="linear" slope="1.2" />
					<feFuncB type="linear" slope="1.2" />
				</feComponentTransfer>
				<feDropShadow
					dx="-1"
					dy="0.6"
					stdDeviation="1"
				/>
			</filter>
		</defs>
		<path
			d="M 0 0 H 20 L 30 10 L 20 20 H 0 Z"
			:fill="boxColor"
			filter="url(#drop-shadow)"
		/>
		<path
			d="M 0 0 H 20 L 30 10 L 20 20 H 0 Z M 2 2 V 18 H 18.8 L 27.2 10.000 L 18.8 2 Z"
			:fill="boxColor"
			filter="url(#inset-shadow)"
		/>
	</svg>
</template>

<script setup lang="ts">
/**
 * LevelBoxBackground Component
 *
 * Renders the decorative SVG background for level-up creature level indicators.
 * Creates a pentagon-shaped box with drop shadow and inset shadow effects
 * to give depth to the level indicators (LEVEL 2-4, LEVEL 5+, etc.).
 *
 * @prop {string} boxColor - The fill color for the level box background
 */
defineProps<{
	boxColor: string;
}>();
</script>
