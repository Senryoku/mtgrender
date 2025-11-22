<template>
	<div @drop="handleDrop" @dragover="handleDragOver" class="app">
		<AppHeader :rendering="rendering" @newCard="handleNewCard" @save="handleSave" @render="render">
			<template #search>
				<CardSearchInput
					v-model:searchCardName="searchCardName"
					:autocompleteStatus="autocompleteStatus"
					@autocomplete="handleAutocomplete"
					@selectCard="handleSelectCard"
					@loadCard="handleLoadCard"
					@autocompleteKeydown="handleAutocompleteKeydown"
					@autocompleteCycle="handleAutocompleteCycle"
				/>
			</template>
		</AppHeader>

		<div class="content">
			<div class="card-display">
				<!-- Debug Controls - Separated from card -->


				<MTGCard
					:card="finalCard"
					:scale="displayScale"
					:renderMargin="renderOptions.margin"
					:displayDebug="displayDebug"
					:debugOpacity="debugOpacity"
					@edit="editCard"
				/>

								<div class="debug-controls" v-if="isDevelopment">
					<h4>Debug Tools</h4>
					<div class="debug-control-group">
						<label>
							<input type="checkbox" v-model="displayDebug" />
							Show overlay
						</label>
					</div>
					<div class="debug-control-group">
						<label for="debug-opacity">Opacity: {{ (debugOpacity * 100).toFixed(0) }}%</label>
						<input
							id="debug-opacity"
							type="range"
							min="0"
							max="1"
							step="0.05"
							v-model="debugOpacity"
						/>
					</div>
				</div>
			</div>

			<div style="flex-grow: 1">
				<CardTabs :tabs="tabs" v-model:currentTab="currentTab">
					<div v-show="currentTab === 0" class="inner-tab card-info">
						<div class="card-properties-grid">
							<div class="card-properties-section">
								<FormGroup
									label="Layout"
									hint="Type de mise en page de la carte"
								>
									<Combobox
										id="card-layout"
										v-model="card.layout"
										:options="cardLayouts"
										placeholder="Choisir un layout..."
										@change="layoutChange"
									/>
								</FormGroup>

								<FormGroup label="Set" hint="Code de l'extension">
									<div style="display: flex; gap: var(--space-2); align-items: flex-start">
										<div style="flex: 0 0 120px">
											<Combobox
												id="card-set"
												v-model="card.set"
												:options="setsWithIcons"
												placeholder="ex: MH3"
												size="base"
											/>
										</div>
										<Button
											variant="ghost"
											size="sm"
											:icon-only="true"
											@click="card.set = undefined"
											title="Réinitialiser"
										>
											↺
										</Button>
									</div>
								</FormGroup>

								<FormGroup
									label="Set Icon (Custom)"
									hint="URL personnalisée pour l'icône d'extension"
								>
									<Input
										id="card-set-icon"
										v-model="card.set_icon"
										placeholder="URL de l'icône..."
										:show-clear="true"
									/>
								</FormGroup>

								<FormGroup label="Rarity" hint="Rareté de la carte">
									<div style="display: flex; gap: var(--space-2); align-items: flex-start">
										<Combobox
											id="card-rarity"
											v-model="card.rarity"
											:options="cardRarities"
											placeholder="Choisir une rareté..."
											:allow-custom-value="false"
										/>
										<Button
											variant="ghost"
											size="sm"
											:icon-only="true"
											@click="card.rarity = undefined"
											title="Réinitialiser"
										>
											↺
										</Button>
									</div>
								</FormGroup>
							</div>
							<div class="card-properties-section">
								<FormGroup
									label="Frame Effects"
									hint="Effets spéciaux sur la bordure (showcase, extended, etc.)"
								>
									<form @submit.prevent="handleAddFrameEffect" style="display: flex; gap: var(--space-2)">
										<Combobox
											id="add-frame-effect"
											v-model="newFrameEffect"
											:options="frameEffects"
											placeholder="Ajouter un effet..."
											size="base"
											style="flex: 1"
										/>
										<Button type="submit" variant="primary" size="base">
											Ajouter
										</Button>
									</form>
									<ul v-if="card.frame_effects && card.frame_effects.length > 0" class="frame-effects-list">
										<li
											v-for="(effect, idx) in card.frame_effects"
											:key="idx"
											class="frame-effect-item"
										>
											<Input
												v-model="card.frame_effects![idx]"
												size="sm"
											/>
											<Button
												variant="ghost"
												size="sm"
												:icon-only="true"
												@click="removeFrameEffect(idx)"
												title="Supprimer"
											>
												🗑
											</Button>
										</li>
									</ul>
								</FormGroup>
							</div>
						</div>

						<template v-if="card.card_faces && card.card_faces.length > 1">
							<div>
								<label for="card-full-name">Full Name</label>
								<input id="card-full-name" v-model="card.name" type="text" />
							</div>
							<IllustrationEditor
								v-if="card.layout === 'adventure'"
								v-model="card"
								@outline="outlineElement"
							/>
							<div class="dual-face-editor">
								<div>
									<h2>{{ card.layout === 'adventure' ? 'Main' : 'Front' }}</h2>
									<CardFaceEditorV2
										v-model="card.card_faces[0]"
										@outline="outlineElement"
										:illustrationEditor="card.layout !== 'adventure'"
									/>
								</div>
								<div>
									<h2>
										{{ card.layout === 'adventure' ? 'Adventure' : 'Back' }}
									</h2>
									<CardFaceEditorV2
										v-model="card.card_faces[1]"
										@outline="outlineElement"
										:illustrationEditor="card.layout !== 'adventure'"
									/>
								</div>
							</div>
						</template>
						<template v-else>
							<CardFaceEditorV2 v-model="card" @outline="outlineElement" />
						</template>
					</div>

					<div v-show="currentTab === 1" class="inner-tab">
						<textarea
							:value="JSON.stringify(card, null, 2)"
							@change="updateCard"
							ref="jsonViewRef"
							class="large-textarea"
							rows="20"
							spellcheck="false"
						></textarea>
					</div>

					<div v-show="currentTab === 2" class="inner-tab">
						<RenderSettings v-model="renderOptions" />
					</div>

					<div v-show="currentTab === 3" class="inner-tab">
						<div>
							<label>Default Card Properties:</label><br />
							<textarea
								:value="JSON.stringify(defaultCardProperties, null, 2)"
								@change="updateDefaultCardProperties"
								ref="defaultCardPropertiesJsonViewRef"
								class="large-textarea"
								rows="20"
								spellcheck="false"
							></textarea>
						</div>
						<div>
							<label>Override Card Properties:</label><br />
							<textarea
								:value="JSON.stringify(overrideCardProperties, null, 2)"
								@change="updateOverrideCardProperties"
								ref="overrideCardPropertiesJsonViewRef"
								class="large-textarea"
								rows="20"
								spellcheck="false"
							></textarea>
						</div>
					</div>
				</CardTabs>
			</div>

			<!-- <CardStore :currentCard="card" @load="loadCard" @renderAll="renderAll" ref="storeRef" /> -->
		</div>


	<AppFooter />
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import SetsWithIcons from "./assets/data/sets_with_icons.json";
import MTGCard from './components/MTGCard.vue';
import CardFaceEditorV2 from './components/CardFaceEditor.vue';
import CardStore from './components/CardStore.vue';
import RenderSettings from './components/RenderSettings.vue';
import IllustrationEditor from './components/IllustrationEditor.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import CardSearchInput from './components/CardSearchInput.vue';
import CardTabs from './components/CardTabs.vue';
import Combobox from './components/ui/Combobox.vue';
import FormGroup from './components/ui/FormGroup.vue';
import Input from './components/ui/Input.vue';
import Button from './components/ui/Button.vue';

import { useCardData } from './composables/useCardData';
import { useCardAutocomplete } from './composables/useCardAutocomplete';
import { useCardRender } from './composables/useCardRender';
import { useDragDrop } from './composables/useDragDrop';
import { useLocalStorage, useLocalStorageSync } from './composables/useLocalStorage';
import { scryfallService } from './services/scryfallService';

import {
	CARD_LAYOUTS,
	CARD_RARITIES,
	FRAME_EFFECTS,
	TABS,
	DEFAULT_RENDER_OPTIONS,
} from './constants/cardConstants';

import type { Card, RenderOptions } from './types/card';

// Constants
const cardLayouts = CARD_LAYOUTS;
const cardRarities = CARD_RARITIES;
const frameEffects = FRAME_EFFECTS;
const tabs = TABS;
const setsWithIcons = SetsWithIcons;

// State
const displayScale = ref(2.0);
const currentTab = ref(0);
const newFrameEffect = ref('');

// Debug state
const displayDebug = ref(false);
const debugOpacity = ref(0.5);
const isDevelopment = import.meta.env.MODE === 'development';

// Render options
const { getStoredValue: getRenderOptions } = useLocalStorage<RenderOptions>(
	'renderOptions',
	DEFAULT_RENDER_OPTIONS
);
const renderOptions = ref<RenderOptions>(getRenderOptions());
useLocalStorageSync('renderOptions', renderOptions, true);

// Card data management
const {
	card,
	defaultCardProperties,
	overrideCardProperties,
	finalCard,
	newCard,
	loadCard: loadCardData,
	editCard,
	layoutChange,
	addFrameEffect,
	removeFrameEffect,
} = useCardData();

// Sync card properties to localStorage
useLocalStorageSync('defaultCardProperties', defaultCardProperties, false);
useLocalStorageSync('overrideCardProperties', overrideCardProperties, false);

// Autocomplete
const {
	searchCardName,
	autocompleteStatus,
	autocompleteCardName,
	selectCard,
	handleAutocompleteKeydown,
	handleAutocompleteCycle,
} = useCardAutocomplete();

// Refs
const cardComponentRef = ref<any>(null);
const jsonViewRef = ref<HTMLTextAreaElement | null>(null);
const storeRef = ref<any>(null);
const defaultCardPropertiesJsonViewRef = ref<HTMLTextAreaElement | null>(null);
const overrideCardPropertiesJsonViewRef = ref<HTMLTextAreaElement | null>(null);

// Rendering
const { rendering, render, renderAll } = useCardRender(
	renderOptions,
	displayScale,
	cardComponentRef
);

// Drag and drop
const { handleDrop, handleDragOver } = useDragDrop(
	card,
	(cardData: Card) => {
		loadCardData(cardData);
		handleSave();
	},
	(imageUrl: string) => {
		if (!card.value.image_uris) {
			card.value.image_uris = {};
		}
		card.value.image_uris.art_crop = imageUrl;
	}
);

// Handlers
const handleNewCard = () => {
	newCard();
};

const handleSave = () => {
	storeRef.value?.save();
};

const handleAutocomplete = (query: string) => {
	autocompleteCardName(query);
};

const handleSelectCard = (cardName: string) => {
	selectCard(cardName);
};

const handleLoadCard = async (cardName: string) => {
	try {
		const cardData = await scryfallService.getCard(cardName);
		loadCardData(cardData);
	} catch (error: any) {
		alert('Not found.\nDetails: ' + error.message);
	}
};

const handleAddFrameEffect = () => {
	if (newFrameEffect.value) {
		addFrameEffect(newFrameEffect.value);
		newFrameEffect.value = '';
	}
};

const outlineElement = () => {
	// FIXME: Disabled for now
	return false;
};

const updateCard = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		loadCardData(JSON.parse(target.value));
	} catch (err) {
		console.error(err);
	}
};

const updateDefaultCardProperties = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		defaultCardProperties.value = JSON.parse(target.value);
	} catch (err) {
		console.error(err);
	}
};

const updateOverrideCardProperties = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		overrideCardProperties.value = JSON.parse(target.value);
	} catch (err) {
		console.error(err);
	}
};

// Watchers
watch(card, () => {
	if (jsonViewRef.value) {
		jsonViewRef.value.value = JSON.stringify(card.value, null, 2);
	}
});

watch(defaultCardProperties, () => {
	if (defaultCardPropertiesJsonViewRef.value) {
		defaultCardPropertiesJsonViewRef.value.value = JSON.stringify(
			defaultCardProperties.value,
			null,
			2
		);
	}
});

watch(overrideCardProperties, () => {
	if (overrideCardPropertiesJsonViewRef.value) {
		overrideCardPropertiesJsonViewRef.value.value = JSON.stringify(
			overrideCardProperties.value,
			null,
			2
		);
	}
});

// Lifecycle
onMounted(() => {
	if (!storeRef.value?.load_default()) {
		handleLoadCard('Elspeth Conquers Death');
	}
});

</script>
