<template>
	<div class="card-face-editor">
		<Accordion :model-value="['basic']" :multiple="true" :bordered="true">
			<!-- Section 1: Basic Information -->
			<AccordionItem id="basic" title="Basic Information" :default-open="true">
				<div class="editor-section">
					<FormGroup
						label="Name"
						hint="The card name"
						:required="true"
						@mouseenter="outlineElement($event, 'name')"
					>
						<Input
							id="card-name"
							v-model="localValue.name"
							placeholder="e.g. Lightning Bolt"
							size="base"
							:required="true"
							@focus="outlineElement($event, 'name')"
						/>
					</FormGroup>

					<FormGroup
						label="Printed Name"
						hint="Alternative name printed on the card (optional)"
						@mouseenter="outlineElement($event, 'printed_name')"
					>
						<Input
							id="card-printed-name"
							v-model="localValue.printed_name"
							placeholder="e.g. 閃電/Lightning Bolt"
							size="base"
							:show-clear="true"
							@focus="outlineElement($event, 'printed_name')"
						/>
					</FormGroup>

					<FormGroup
						label="Mana Cost"
						hint="Mana cost in {2}{W}{U} format"
						:error="!manaCostValidation.isValid.value"
						:error-message="manaCostValidation.error.value"
						@mouseenter="outlineElement($event, 'mana-cost')"
					>
						<Input
							id="card-mana-cost"
							v-model="localValue.mana_cost"
							placeholder="e.g. {2}{W}{U}"
							size="base"
							:error="!manaCostValidation.isValid.value"
							@blur="manaCostValidation.validate()"
							@focus="outlineElement($event, 'mana-cost')"
						/>
					</FormGroup>
				</div>
			</AccordionItem>

			<!-- Section 2: Type & Text -->
			<AccordionItem id="type-text" title="Type and Text">
				<div class="editor-section">
					<FormGroup
						label="Type Line"
						hint="Card type (e.g. Creature — Human Wizard)"
						@mouseenter="outlineElement($event, 'type-line')"
					>
						<Combobox
							id="card-type-line"
							v-model="localValue.type_line"
							:options="commonCardTypes"
							placeholder="e.g. Creature — Human Wizard"
							size="base"
							@focus="outlineElement($event, 'type-line')"
						/>
					</FormGroup>

					<FormGroup
						label="Oracle Text"
						hint="Card rules text"
						@mouseenter="outlineElement($event, 'oracle')"
					>
						<Textarea
							id="card-oracle"
							v-model="localValue.oracle_text"
							placeholder="Enter card text..."
							:rows="6"
							:auto-resize="true"
							@focus="outlineElement($event, 'oracle')"
						/>
					</FormGroup>

					<FormGroup
						label="Flavor Text"
						hint="Flavor text (optional)"
						@mouseenter="outlineElement($event, 'flavor')"
					>
						<Textarea
							id="card-flavor"
							v-model="localValue.flavor_text"
							placeholder="Flavor text..."
							:rows="2"
							:auto-resize="true"
							@focus="outlineElement($event, 'flavor')"
						/>
					</FormGroup>
				</div>
			</AccordionItem>

			<!-- Section 3: Stats (conditional) -->
			<AccordionItem
				v-if="showStats"
				id="stats"
				title="Statistics"
			>
				<div class="editor-section">
					<FormGroup
						v-if="showPowerToughness"
						label="Power / Toughness"
						hint="Format: N/N, */*, or X/X"
						:error="!ptValidation.isValid.value"
						:error-message="ptValidation.error.value"
						@mouseenter="outlineElement($event, 'pt-box')"
					>
						<div class="stat-row">
							<Input
								id="card-power"
								v-model="localValue.power"
								placeholder="*"
								size="base"
								:error="!ptValidation.isValid.value"
								@blur="ptValidation.validate()"
								@focus="outlineElement($event, 'pt-box')"
							/>
							<span class="stat-separator">/</span>
							<Input
								id="card-toughness"
								v-model="localValue.toughness"
								placeholder="*"
								size="base"
								:error="!ptValidation.isValid.value"
								@blur="ptValidation.validate()"
								@focus="outlineElement($event, 'pt-box')"
							/>
							<Button
								variant="ghost"
								size="sm"
								:icon-only="true"
								@click="clearPowerToughness"
								title="Reset"
							>
								↺
							</Button>
						</div>
					</FormGroup>

					<FormGroup
						v-if="showLoyalty"
						label="Loyalty"
						hint="Planeswalker starting loyalty"
						:error="!loyaltyValidation.isValid.value"
						:error-message="loyaltyValidation.error.value"
						@mouseenter="outlineElement($event, 'loyalty')"
					>
						<div class="stat-row">
							<Input
								id="card-loyalty"
								v-model="localValue.loyalty"
								placeholder="3"
								size="base"
								:error="!loyaltyValidation.isValid.value"
								@blur="loyaltyValidation.validate()"
								@focus="outlineElement($event, 'loyalty-box')"
							/>
							<Button
								variant="ghost"
								size="sm"
								:icon-only="true"
								@click="localValue.loyalty = undefined"
								title="Reset"
							>
								↺
							</Button>
						</div>
					</FormGroup>
				</div>
			</AccordionItem>

			<!-- Section 4: Illustration -->
			<AccordionItem v-if="illustrationEditor" id="illustration" title="Illustration">
				<div class="editor-section">
					<IllustrationEditor v-model="localValue" />
				</div>
			</AccordionItem>

			<!-- Section 5: Footer -->
			<AccordionItem id="footer" title="Footer">
				<div class="editor-section">
					<FormGroup
						label="Artist"
						hint="Artist name"
						@mouseenter="outlineElement($event, 'artist-name')"
					>
						<Input
							id="card-artist"
							v-model="localValue.artist"
							placeholder="e.g. John Avon"
							size="base"
							@focus="outlineElement($event, 'artist-name')"
						/>
					</FormGroup>

					<FormGroup
						label="Collector Number"
						hint="Collection number"
						@mouseenter="outlineElement($event, 'collector-number')"
					>
						<Input
							id="card-number"
							v-model="localValue.collector_number"
							placeholder="e.g. 123"
							size="base"
							:maxlength="10"
							@focus="outlineElement($event, 'collector-number')"
						/>
					</FormGroup>

					<FormGroup
						label="Copyright"
						hint="Copyright notice (optional)"
						@mouseenter="outlineElement($event, 'copyright')"
					>
						<Input
							id="copyright"
							v-model="localValue.copyright"
							placeholder="e.g. ™ & © 2024 Wizards of the Coast"
							size="base"
							:show-clear="true"
							@focus="outlineElement($event, 'copyright')"
						/>
					</FormGroup>
				</div>
			</AccordionItem>
		</Accordion>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Accordion from './ui/Accordion.vue';
import AccordionItem from './ui/AccordionItem.vue';
import FormGroup from './ui/FormGroup.vue';
import Input from './ui/Input.vue';
import Combobox from './ui/Combobox.vue';
import Textarea from './ui/Textarea.vue';
import Button from './ui/Button.vue';
import IllustrationEditor from './IllustrationEditor.vue';
import {
	useFieldValidation,
	validationRules,
	validatePowerToughness,
} from '../composables/useValidation';

const props = defineProps<{
	modelValue: any;
	illustrationEditor?: boolean;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: any];
	outline: [event: Event, element: string];
}>();

// Local value with v-model sync
const localValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

// Common MTG card types for autocomplete
const commonCardTypes = [
	'Artifact',
	'Artifact Creature',
	'Artifact — Equipment',
	'Artifact — Vehicle',
	'Conspiracy',
	'Creature',
	'Creature — Angel',
	'Creature — Beast',
	'Creature — Demon',
	'Creature — Dragon',
	'Creature — Elemental',
	'Creature — Elf',
	'Creature — Giant',
	'Creature — Goblin',
	'Creature — Human',
	'Creature — Human Soldier',
	'Creature — Human Wizard',
	'Creature — Knight',
	'Creature — Merfolk',
	'Creature — Vampire',
	'Creature — Wizard',
	'Creature — Zombie',
	'Enchantment',
	'Enchantment — Aura',
	'Enchantment — Saga',
	'Enchantment Creature',
	'Instant',
	'Land',
	'Land — Forest',
	'Land — Island',
	'Land — Mountain',
	'Land — Plains',
	'Land — Swamp',
	'Legendary Artifact',
	'Legendary Creature',
	'Legendary Enchantment',
	'Legendary Land',
	'Legendary Planeswalker',
	'Planeswalker',
	'Sorcery',
	'Tribal Instant',
	'Tribal Sorcery',
];

// Conditional sections based on card type
const showPowerToughness = computed(() => {
	const typeLine = localValue.value?.type_line?.toLowerCase() || '';
	return (
		typeLine.includes('creature') ||
		typeLine.includes('créature') ||
		typeLine.includes('vehicle') ||
		typeLine.includes('véhicule')
	);
});

const showLoyalty = computed(() => {
	const typeLine = localValue.value?.type_line?.toLowerCase() || '';
	return typeLine.includes('planeswalker') || typeLine.includes('arpenteur');
});

const showStats = computed(() => {
	return showPowerToughness.value || showLoyalty.value;
});

// Validation
const manaCost = computed(() => localValue.value?.mana_cost || '');
const manaCostValidation = useFieldValidation(manaCost, [validationRules.manaCost]);

const powerToughness = computed(() => {
	const power = localValue.value?.power || '';
	const toughness = localValue.value?.toughness || '';
	if (!power && !toughness) return '';
	return `${power}/${toughness}`;
});
const ptValidation = useFieldValidation(powerToughness, [
	{
		validator: validatePowerToughness,
		message: 'Invalid format. Use N/N, */*, or X/X.',
	},
]);

const loyalty = computed(() => localValue.value?.loyalty || '');
const loyaltyValidation = useFieldValidation(loyalty, [validationRules.loyalty]);

// Methods
const outlineElement = (event: Event, element: string) => {
	emit('outline', event, element);
};

const clearPowerToughness = () => {
	localValue.value.power = undefined;
	localValue.value.toughness = undefined;
	ptValidation.reset();
};

// Watch for type_line changes to reset inappropriate stats
watch(
	() => localValue.value?.type_line,
	() => {
		if (!showPowerToughness.value) {
			localValue.value.power = undefined;
			localValue.value.toughness = undefined;
		}
		if (!showLoyalty.value) {
			localValue.value.loyalty = undefined;
		}
	}
);
</script>

<style scoped>
.card-face-editor {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	width: 100%;
}

.editor-section {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.stat-row {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.stat-row > :deep(.input-wrapper) {
	flex: 1;
}

.stat-separator {
	font-size: var(--text-lg);
	font-weight: var(--font-medium);
	color: var(--color-text-secondary);
}
</style>
