<template>
	<div @drop="dropHandler" @dragover="dragOverHandler">
		<div class="header">
			<h1>MTGRender</h1>
			<div class="menu">
				<button @click="card = Object.assign({}, baseCard)">New Card</button>
				<button @click="save">Save</button>
				<form @submit.prevent="loadCard">
					<input
						type="text"
						placeholder="Card Name..."
						v-model="searchCardName"
						@input="autocompleteCardName"
					/>
					<div class="card-name-autocomplete" v-if="autocompleteStatus">
						<div v-if="autocompleteStatus === 'updating'">Searching...</div>
						<div v-if="autocompleteStatus === 'error'">An error occured.</div>
						<div v-if="Array.isArray(autocompleteStatus)">
							<ul>
								<li
									v-for="r in autocompleteStatus"
									:key="r"
									@click="selectCard(r)"
								>
									{{ r }}
								</li>
							</ul>
						</div>
					</div>
					<button type="submit">Load from Scryfall</button>
				</form>
			</div>
		</div>
		<div class="content">
			<div class="card-display">
				<MTGCard :card="finalCard" :scale="displayScale" @edit="editCard" />
			</div>
			<div style="flex-grow: 1">
				<div class="tabs">
					<div
						v-for="(tabName, idx) in [
							'Card Info',
							'Raw JSON',
							'Render Settings',
							'Global Properties',
						]"
						:key="idx"
						@click="currentTab = idx"
						class="tab"
						:class="{ 'selected-tab': currentTab === idx }"
					>
						{{ tabName }}
					</div>
				</div>
				<div v-show="currentTab === 0" class="inner-tab card-info">
					<div>
						<label for="card-layout">Layout</label>
						<input id="card-layout" v-model="card.layout" type="text" />
					</div>
					<div
						@mouseenter="outlineElement($event, 'name')"
						@focus.capture="outlineElement($event, 'name')"
					>
						<label for="card-name">Name</label>
						<input id="card-name" v-model="card.name" type="text" />
					</div>
					<div
						@mouseenter="outlineElement($event, 'mana-cost')"
						@focus.capture="outlineElement($event, 'mana-cost')"
					>
						<label for="card-mana-cost">Mana Cost</label>
						<input id="card-mana-cost" v-model="card.mana_cost" type="text" />
					</div>
					<div
						@mouseenter="outlineElement($event, 'type-line')"
						@focus.capture="outlineElement($event, 'type-line')"
					>
						<label for="card-type-line">Type Line</label>
						<input id="card-type-line" v-model="card.type_line" type="text" />
					</div>
					<div>
						<label for="card-set">Set</label>
						<input id="card-set" v-model="card.set" type="text" />
						<a @click="card.set = undefined">↺</a>
					</div>
					<div>
						<label for="card-rarity">Rarity</label>
						<input id="card-rarity" v-model="card.rarity" type="text" />
						<a @click="card.rarity = undefined">↺</a>
					</div>
					<div
						@mouseenter="outlineElement($event, 'oracle')"
						@focus.capture="outlineElement($event, 'oracle')"
					>
						<label for="card-oracle">Oracle</label><br />
						<textarea
							id="card-oracle"
							v-model="card.oracle_text"
							cols="40"
							rows="6"
						/>
					</div>
					<div
						@mouseenter="outlineElement($event, 'pt-box')"
						@focus.capture="outlineElement($event, 'pt-box')"
					>
						<label for="card-power">P / T</label>
						<input
							id="card-power"
							class="small-input"
							v-model="card.power"
							type="text"
						/>
						/
						<input
							id="card-toughness"
							class="small-input"
							v-model="card.toughness"
							type="text"
						/>
						<a @click="card.power = card.toughness = undefined">↺</a>
					</div>
					<div
						@mouseenter="outlineElement($event, 'loyalty')"
						@focus.capture="outlineElement($event, 'loyalty-box')"
					>
						<label for="card-loyalty">Loyalty</label>
						<input
							id="card-loyalty"
							class="small-input"
							v-model="card.loyalty"
							type="text"
						/>
						<a @click="card.loyalty = undefined">↺</a>
					</div>
					<div
						class="subsection"
						@mouseenter="outlineElement($event, 'illustration')"
						@focus.capture="outlineElement($event, 'illustration')"
					>
						<h3>Illustration</h3>
						<div v-if="card.image_uris">
							<label for="card-illustration">Source</label>
							<input
								id="card-illustration"
								v-model="card.image_uris.art_crop"
								type="text"
							/>
						</div>
						<div class="help">
							You can can drag the illustration and use your mouse wheel to
							adjust its position and scale.
						</div>
						<div v-if="card.image_uris">
							<label for="card-illustration-scale">Scale</label>
							<input
								id="card-illustration-scale"
								v-model="card.illustration_scale"
								type="number"
							/>
							<a @click="card.illustration_scale = 1.0">↺</a>
						</div>
						<div v-if="card.illustration_position">
							<label for="card-illustration-position">Position</label>
							<input
								id="card-illustration-position"
								v-model="card.illustration_position.x"
								type="number"
							/>
							<input
								id="card-illustration-position"
								v-model="card.illustration_position.y"
								type="number"
							/>
							<a @click="card.illustration_position = { x: 0, y: 0 }">↺</a>
						</div>
						<div v-if="card.illustration_textbox">
							<label for="card-illustration-bleedthrough"
								>Bleedtrough Textbox</label
							>
							<input
								type="checkbox"
								id="card-illustration-bleedthrough"
								v-model="card.illustration_textbox"
							/>
						</div>
					</div>
					<div class="subsection">
						<h3>Footer</h3>
						<div
							@mouseenter="outlineElement($event, 'artist-name')"
							@focus.capture="outlineElement($event, 'artist-name')"
						>
							<label for="card-artist">Artist</label>
							<input id="card-artist" v-model="card.artist" type="text" />
						</div>
						<div
							@mouseenter="outlineElement($event, 'collector-number')"
							@focus.capture="outlineElement($event, 'collector-number')"
						>
							<label for="card-number">Number</label>
							<input
								id="card-number"
								v-model="card.collector_number"
								type="text"
							/>
						</div>
						<div
							@mouseenter="outlineElement($event, 'copyright')"
							@focus.capture="outlineElement($event, 'copyright')"
						>
							<label for="copyright">Copyright</label>
							<input id="copyright" v-model="card.copyright" type="text" />
							<a @click="card.copyright = undefined">↺</a>
						</div>
					</div>
				</div>
				<div v-show="currentTab === 1" class="inner-tab">
					<textarea
						:value="JSON.stringify(card, null, 2)"
						@change="updateCard"
						ref="jsonView"
						rows="20"
						cols="80"
						spellcheck="false"
					></textarea>
				</div>
				<div v-show="currentTab === 2" class="inner-tab">
					{{ illustrationDimensions[0] }}x{{ illustrationDimensions[1] }}
					<button @click="upscale" :disabled="upscaling">
						Upscale Illustration
					</button>
					<div>
						<label for="render-margin">Margin (mm)</label>
						<input
							id="render-margin"
							type="number"
							v-model="renderOptions.margin"
						/>
					</div>
					<button @click="render" :disabled="rendering">Render to PNG</button>
				</div>
				<div v-show="currentTab === 3" class="inner-tab">
					<div>
						<label>Default Card Properties:</label><br />
						<textarea
							:value="JSON.stringify(defaultCardProperties, null, 2)"
							@change="updateDefaultCardProperties"
							ref="defaultCardPropertiesJsonView"
							rows="20"
							cols="80"
							spellcheck="false"
						></textarea>
					</div>
					<div>
						<label>Override Card Properties:</label><br />
						<textarea
							:value="JSON.stringify(overrideCardProperties, null, 2)"
							@change="updateOverrideCardProperties"
							ref="overrideCardPropertiesJsonView"
							rows="20"
							cols="80"
							spellcheck="false"
						></textarea>
					</div>
				</div>
			</div>
			<CardStore
				:currentCard="card"
				@load="load"
				@renderAll="renderAll"
				ref="store"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { ref } from "vue";
import domtoimage from "dom-to-image";
import Upscaler from "upscaler";
import { downloadZip } from "client-zip";
import "keyrune";

import MTGCard from "./components/MTGCard.vue";
import CardStore from "./components/CardStore.vue";

const upscaler = new Upscaler({});

function download(filename, data) {
	const link = document.createElement("a");
	link.download = filename;
	link.href = data;
	link.click();
	link.remove();
}

export default {
	name: "App",
	components: {
		MTGCard,
		CardStore,
	},
	data() {
		const jsonView = ref(null);
		const store = ref(null);
		const defaultCardProperties = JSON.parse(
			localStorage.getItem("defaultCardProperties") ?? "{}"
		);
		const overrideCardProperties = JSON.parse(
			localStorage.getItem("overrideCardProperties") ?? "{}"
		);
		return {
			card: {},
			defaultCardProperties,
			overrideCardProperties,
			displayScale: 2.0,
			searchCardName: "",
			autocompleteStatus: null,
			renderOptions: {
				margin: 3,
			},
			rendering: false,
			upscaling: false,
			currentTab: 0,
			jsonView,
			store,
			baseCard: {
				name: "Card Name",
				mana_cost: "{1}{R}{G}{B}",
				type_line: "Supertype — Subtype(s)",
				oracle_text: "{T}: Does something.",
				power: 0,
				toughness: 1,
				image_uris: {
					art_crop:
						"data:image/svg+xml;base64,PHN2ZyB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB3aWR0aD0iMTgwLjExODczbW0iIGhlaWdodD0iMTM5Ljc5MzY0bW0iIHZpZXdCb3g9IjAgMCAxODAuMTE4NzMgMTM5Ljc5MzY0IiB2ZXJzaW9uPSIxLjEiIGlkPSJzdmc4IiBzb2RpcG9kaTpkb2NuYW1lPSJwbGFjZUhvbGRlci5zdmciIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMyAoMjQwNTU0NiwgMjAxOC0wMy0xMSkiPiA8ZGVmcyBpZD0iZGVmczIiIC8+IDxzb2RpcG9kaTpuYW1lZHZpZXcgaWQ9ImJhc2UiIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgYm9yZGVyY29sb3I9IiM2NjY2NjYiIGJvcmRlcm9wYWNpdHk9IjEuMCIgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgaW5rc2NhcGU6em9vbT0iMC4zNSIgaW5rc2NhcGU6Y3g9IjM0MS40NDMyIiBpbmtzY2FwZTpjeT0iMjkzLjM5ODk0IiBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgc2hvd2dyaWQ9ImZhbHNlIiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyOTkiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjcxMyIgaW5rc2NhcGU6d2luZG93LXg9IjY3IiBpbmtzY2FwZTp3aW5kb3cteT0iMjciIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGZpdC1tYXJnaW4tdG9wPSIwIiBmaXQtbWFyZ2luLWxlZnQ9IjAiIGZpdC1tYXJnaW4tcmlnaHQ9IjAiIGZpdC1tYXJnaW4tYm90dG9tPSIwIiAvPiA8bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNSI+IDxyZGY6UkRGPiA8Y2M6V29yayByZGY6YWJvdXQ9IiI+IDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PiA8ZGM6dHlwZSByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPiA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4gPC9jYzpXb3JrPiA8L3JkZjpSREY+IDwvbWV0YWRhdGE+IDxnIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIiBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIiBpZD0ibGF5ZXIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMuNTkwOTQ0LC02Ni42Mzg2MTEpIj4gPHJlY3Qgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNkMGQwZDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuOTYxMjMyNDI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpmaWxsIG1hcmtlcnMgc3Ryb2tlIiBpZD0icmVjdDgyNiIgd2lkdGg9IjE4MC4xMTg3MyIgaGVpZ2h0PSIxMzkuNzkzNjQiIHg9IjEzLjU5MDk0NCIgeT0iNjYuNjM4NjExIiAvPiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjY3NTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuOTgwMzg0MzU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpmaWxsIG1hcmtlcnMgc3Ryb2tlIiBkPSJNIDExOC41MDY5LDEzMy41MTM2MiA4NC4yNTc5OTQsMTY3Ljc2MjUzIDY4LjI5MDA3MiwxNTEuNzk0NjEgMjYuMzUyNDQ1LDE5My43MzIyMyBoIDMxLjkzNTg0MyA1MS45Mzk0MTIgNjguNDk3ODEgeiIgaWQ9InJlY3Q4MzIiIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+IDxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MC42NzU7ZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjk5NzE3MDMzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6ZmlsbCBtYXJrZXJzIHN0cm9rZSIgaWQ9InBhdGg4NjAiIGN4PSI1OC4yMTcwNiIgY3k9IjEwOC41NTU0MiIgcj0iMTEuNzcyNzI2IiAvPiA8cmVjdCBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6Mi45NjEyMzI0MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOmZpbGwgbWFya2VycyBzdHJva2UiIGlkPSJyZWN0ODYyIiB3aWR0aD0iMTUyLjYxNDE3IiBoZWlnaHQ9IjExNi4wOTg3NCIgeD0iMjYuMTExMjY3IiB5PSI3Ny42MzM2OTgiIC8+IDwvZz4gPC9zdmc+",
				},
			},
		};
	},
	mounted() {
		if (!this.$refs.store.load_default())
			this.loadCard("Elspeth Conquers Death");
	},
	methods: {
		save() {
			this.$refs.store.save();
		},
		async autocompleteCardName(event) {
			this.autocompleteStatus = "updating";
			const response = await fetch(
				`https://api.scryfall.com/cards/autocomplete?q=${event.target.value}`
			);
			if (response.status !== 200) {
				this.autocompleteStatus = "error";
			} else {
				const data = await response.json();
				if (data.total_values > 0) this.autocompleteStatus = data.data;
				else this.autocompleteStatus = null;
			}
		},
		closeAutocomplete() {
			this.autocompleteStatus = null;
		},
		selectCard(cardName) {
			this.searchCardName = cardName;
			this.loadCard(this.searchCardName);
			this.closeAutocomplete();
		},
		load(card) {
			this.card = card;
		},
		loadCard(event) {
			const name = event.target ? event.target.elements[0].value : event;
			fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
				.then((response) => response.json())
				.then((data) => {
					if (data.status && data.status != 200) {
						console.log(data);
						alert("Not found.\nDetails: " + data.details);
					} else {
						this.card = data;
					}
				});
			return false;
		},
		editCard(key, value) {
			if (Array.isArray(key)) {
				let obj = this.card;
				for (let idx = 0; idx < key.length - 1; ++idx) obj = obj[key[idx]];
				obj[key[key.length - 1]] = value;
			} else this.card[key] = value;
		},
		async dropHandler(event) {
			console.log("File(s) dropped");

			// Prevent default behavior (Prevent file from being opened)
			event.preventDefault();

			if (event.dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
				for (var i = 0; i < event.dataTransfer.items.length; i++) {
					// If dropped items aren't files, reject them
					if (event.dataTransfer.items[i].kind === "file") {
						var file = event.dataTransfer.items[i].getAsFile();
						console.log("... file[" + i + "].name = " + file.name);
						console.log(file);
						if (file.type === "application/json") {
							try {
								this.card = JSON.parse(await file.text());
							} catch (err) {
								alert(err);
							}
						} else if (file.type.startsWith("image/")) {
							let reader = new FileReader();
							reader.addEventListener(
								"load",
								() => {
									// convert image file to base64 string
									this.card.image_uris.art_crop = reader.result;
								},
								false
							);

							if (file) {
								reader.readAsDataURL(file);
							}
						} else {
							alert(`Expected json file, got '${file.type}'.`);
						}
					} else if (event.dataTransfer.items[i].kind === "string") {
						// Is it an URL?
						// try { let url = new URL(event.dataTransfer.items[i]); } catch (_) { return false; }
						console.log(event.dataTransfer.items[i]);
						if (event.dataTransfer.items[i].type.includes("url")) {
							let url = event.dataTransfer.getData(
								event.dataTransfer.items[i].type
							);
							//if(url.endsWith(".png") || url.endsWith(".jpg"))
							this.card.image_uris.art_crop = url;
						}
					}
				}
			} else {
				// Use DataTransfer interface to access the file(s)
				for (var i = 0; i < event.dataTransfer.files.length; i++) {
					console.log(
						"... file[" + i + "].name = " + event.dataTransfer.files[i].name
					);
				}
			}
		},
		dragOverHandler(event) {
			// Prevent default behavior (Prevent file from being opened)
			event.preventDefault();
		},
		outlineElement(event, target) {
			// FIXME: Disabled for now because I can't make sure these outlines don't show up in renders
			return false;
			target = document.querySelector(".mtg-card ." + target);
			if (target) {
				const css_class =
					"outlined-" + (event.type === "focus" ? "focus" : "over");
				target.classList.add(css_class);
				event.target.addEventListener(
					event.type === "focus" ? "blur" : "mouseleave",
					() => {
						target.classList.remove(css_class);
					},
					{ once: true }
				);
			}
		},
		async upscale() {
			this.upscaling = true;
			const img = new Image();
			img.src = this.card.image_uris.art_crop;
			upscaler
				.upscale(img, {
					output: "tensor",
				})
				.then((img) => {
					console.log(img);
					//this.card.image_uris.art_crop = img.src;
					this.upscaling = false;
				})
				.catch((error) => {
					alert(error);
					this.upscaling = false;
				});
		},
		renderCurrent(options) {
			const card_display_el = document.querySelector(".card-display");
			const card_el = document.querySelector(".mtg-card");
			// FIXME: Doesn't work as expected
			card_el.classList.add("rendering");
			const cleanup = () => {
				card_el.classList.remove("rendering");
			};
			const margin_px = (3288 / 63.5) * this.renderOptions.margin;
			const scale = 3288 / card_el.clientWidth / this.displayScale;
			// FIXME: Call toPng twice to workaround image not loading on the first call
			// See https://github.com/tsayen/dom-to-image/issues/394
			const func = options?.toBlob ? domtoimage.toBlob : domtoimage.toPng;
			return func(card_display_el).then(() => {
				return func(card_display_el, {
					width:
						(2 * margin_px) / this.displayScale +
						this.displayScale * scale * card_el.clientWidth,
					height:
						(2 * margin_px) / this.displayScale +
						this.displayScale * scale * card_el.clientHeight,
					style: {
						"transform-origin": "top left",
						transform: `scale(${scale})`,
						"background-color": "black",
						padding: `${this.renderOptions.margin}mm`,
					},
				})
					.then((dataUrl) => {
						cleanup();
						return dataUrl;
					})
					.catch((error) => {
						console.error("Error generating render:", error);
						cleanup();
					});
			});
		},
		async render() {
			this.rendering = true;
			const dataUrl = await this.renderCurrent();
			download(`${this.card.name}.png`, dataUrl);
			this.rendering = false;
		},
		async renderAll(cards) {
			this.rendering = true;
			const renders = [];
			for (let c of cards) {
				this.card = c;
				renders.push({
					name: this.card.name + ".png",
					lastModified: new Date(),
					input: await this.renderCurrent({ toBlob: true }),
				});
			}
			// FIXME: See https://touffy.me/client-zip/demo/worker to handle larger archives
			const blob = await downloadZip(renders).blob();
			download("MTGRenders.zip", URL.createObjectURL(blob));
			this.rendering = false;
		},
		updateCard(event) {
			try {
				this.card = JSON.parse(event.target.value);
			} catch (err) {
				console.error(err);
			}
		},
		updateDefaultCardProperties(event) {
			try {
				this.defaultCardProperties = JSON.parse(event.target.value);
			} catch (err) {
				console.error(err);
			}
		},
		updateOverrideCardProperties(event) {
			try {
				this.overrideCardProperties = JSON.parse(event.target.value);
			} catch (err) {
				console.error(err);
			}
		},
	},
	computed: {
		illustrationDimensions() {
			if (!this.card?.image_uris?.art_crop) return [0, 0];
			const img = new Image();
			img.src = this.card.image_uris.art_crop;
			return [img.width, img.height];
		},
		finalCard() {
			let r = Object.assign({}, this.defaultCardProperties);
			Object.assign(r, this.card);
			Object.assign(r, this.overrideCardProperties);
			return r;
		},
	},
	watch: {
		card() {
			this.$refs.jsonView.value = JSON.stringify(this.card);
		},
		defaultCardProperties() {
			this.$refs.defaultCardPropertiesJsonView.value = JSON.stringify(
				this.defaultCardProperties
			);
			localStorage.setItem(
				"defaultCardProperties",
				JSON.stringify(this.defaultCardProperties)
			);
		},
		overrideCardProperties() {
			this.$refs.overrideCardPropertiesJsonView.value = JSON.stringify(
				this.overrideCardProperties
			);
			localStorage.setItem(
				"overrideCardProperties",
				JSON.stringify(this.overrideCardProperties)
			);
		},
	},
};
</script>

<style scoped>
@font-face {
	font-family: "Inconsolata";
	src: url("./assets/fonts/Ligconsolata-Regular.ttf") format("truetype");
}

a,
button {
	cursor: pointer;
}

a:hover {
	color: #666;
}

input,
textarea {
	border: 2px solid #ccc;
	border-radius: 0.4em;
	margin: 0.1em;
	padding: 0.1em 0.3em 0.2em 0.3em;
}

textarea {
	font-family: Inconsolata;
}

.header {
	display: flex;
	gap: 2em;
	margin: 1em;
}

.header h1 {
	margin: 0;
}

.menu {
	display: flex;
	gap: 1em;
	margin: 0.5em;
	position: relative;
}

.card-name-autocomplete {
	position: absolute;
	top: 100%;
	z-index: 1;
	background-color: white;
}

.card-name-autocomplete ul {
	list-style: none;
	margin: 0.2em;
	padding: 0;
}

.card-name-autocomplete li {
	padding: 0.2em;
	cursor: pointer;
}

.card-name-autocomplete li:hover {
	background-color: lightblue;
}

.content {
	display: flex;
	gap: 1em;
	margin: 1em;
	justify-content: space-between;
}

.card-display {
	width: calc(2 * 63mm);
}

.card-display .mtg-card {
	transform: scale(v-bind(displayScale));
	transform-origin: left top;
}

.tabs {
	display: flex;
	gap: 0.4em;
	user-select: none;
}

.tab {
	background-color: #ffffff60;
	color: #000000a0;
	border-radius: 0.5em 0.5em 0 0;
	padding: 0.1em 0.4em 0 0.4em;
	cursor: pointer;
	font-weight: 900;
}

.selected-tab {
	background-color: #ffffff80;
	color: #000000;
}

.inner-tab {
	background-color: #ffffff80;
	padding: 0.5em;
	border-radius: 0 0 0.5em 0.5em;
}

.card-info label {
	display: inline-block;
	width: 6em;
}

.card-info input[type="text"] {
	width: 19em;
}

.card-info input.small-input {
	width: 3em;
}

.card-info .subsection {
	padding-bottom: 0.25em;
}

.card-info .subsection h3 {
	margin: 0;
}

.card-info .subsection div {
	margin-left: 1em;
}

.card-info .help {
	position: relative;
	font-size: 0.7em;
	padding: 0.25em;
	background-color: rgb(209, 233, 255);
	border-radius: 0.25em;
}

.card-info .help::before {
	content: "🛈";
	position: absolute;
	left: -1em;
	top: 50%;
	transform: translateY(-50%);
}
</style>

<style>
.mtg-card:not(.rendering) * {
	transition: outline-offset 0.2s, outline-color 0.2s;
	outline-color: transparent;
	outline-offset: 20px;
}

.mtg-card:not(.rendering) .outlined-over,
.mtg-card:not(.rendering) .outlined-focus {
	outline: red 1px dashed;
	outline-offset: 0;
}
</style>