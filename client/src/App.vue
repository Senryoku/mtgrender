<template>
	<div @drop="dropHandler" @dragover="dragOverHandler" class="app">
		<div class="header">
			<h1>MTGRender</h1>
			<div class="menu">
				<button @click="card = Object.assign({}, baseCard)">New Card</button>
				<button @click="save">
					Save<span class="shortcut">[Ctrl+S]</span>
				</button>
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
				<button @click="render" :disabled="rendering">Render to PNG</button>
			</div>
		</div>
		<div class="content">
			<div class="card-display">
				<MTGCard
					:card="finalCard"
					:scale="displayScale"
					:renderMargin="renderOptions.margin"
					@edit="editCard"
					ref="cardComponent"
				/>
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
					<div>
						<label for="card-set">Set</label>
						<input id="card-set" v-model="card.set" type="text" />
						<a @click="card.set = undefined">↺</a>
					</div>
					<div>
						<label for="card-set-icon">Set Icon</label>
						<input
							id="card-set-icon"
							v-model="card.set_icon"
							type="text"
							placeholder="Leave Blank to use the official set icon"
						/>
						<a @click="card.set_icon = undefined">↺</a>
					</div>
					<div>
						<label for="card-rarity">Rarity</label>
						<input id="card-rarity" v-model="card.rarity" type="text" />
						<a @click="card.rarity = undefined">↺</a>
					</div>
					<template v-if="card.card_faces && card.card_faces.length > 1">
						<div>
							<label for="card-full-name">Full Name</label>
							<input id="card-full-name" v-model="card.name" type="text" />
						</div>
						<div class="dual-face-editor">
							<div>
								<h2>Front</h2>
								<CardFaceEditor
									v-model="card.card_faces[0]"
									@outline="outlineElement"
								/>
							</div>
							<div>
								<h2>Back</h2>
								<CardFaceEditor
									v-model="card.card_faces[1]"
									@outline="outlineElement"
								/>
							</div>
						</div>
					</template>
					<template v-else>
						<CardFaceEditor v-model="card" @outline="outlineElement" />
					</template>
				</div>
				<div v-show="currentTab === 1" class="inner-tab">
					<textarea
						:value="JSON.stringify(card, null, 2)"
						@change="updateCard"
						ref="jsonView"
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
							ref="defaultCardPropertiesJsonView"
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
							ref="overrideCardPropertiesJsonView"
							class="large-textarea"
							rows="20"
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
		<div class="footer">
			MTGRender uses images from templates by Chilli_Axe. MTGRender is
			unofficial Fan Content permitted under the Fan Content Policy. Not
			approved/endorsed by Wizards. Portions of the materials used are property
			of Wizards of the Coast. ©Wizards of the Coast LLC
		</div>
	</div>
</template>

<script lang="ts">
import { createApp, ref } from "vue";
import domtoimage from "dom-to-image";
import { downloadZip } from "client-zip";

import MTGCard from "./components/MTGCard.vue";
import CardFaceEditor from "./components/CardFaceEditor.vue";
import CardStore from "./components/CardStore.vue";
import RenderSettings from "./components/RenderSettings.vue";
import Modal from "./components/Modal.vue";
import Progress from "./components/Progress.vue";

let upscaler_instance = null;
const upscaler = async () => {
	if (!upscaler_instance) {
		await import("upscaler").then((Upscaler) => {
			upscaler_instance = new Upscaler.default({
				model: "div2k/rdn-C3-D10-G64-G064-x2",
			});
		});
	}
	return upscaler_instance;
};

function download(filename, data) {
	const link = document.createElement("a");
	link.download = filename;
	link.href = data;
	link.click();
	link.remove();
}

function openModal(props = {}) {
	const div = document.createElement("div");
	document.body.appendChild(div);
	return createApp(Modal, props).mount(div);
}

let optipngWorker;
function loadWebWorker() {
	if (!optipngWorker)
		optipngWorker = new Worker("./workers/optipng.worker.js", {
			type: "module",
		});
}

function Uint8ToString(u8a) {
	const CHUNK_SZ = 0x8000;
	const c = [];
	for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
		c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
	}
	return c.join("");
}

export default {
	name: "App",
	components: {
		MTGCard,
		CardFaceEditor,
		CardStore,
		RenderSettings,
	},
	data() {
		const cardComponent = ref(null);
		const jsonView = ref(null);
		const store = ref(null);
		const savedRenderOptions = localStorage.getItem("renderOptions");
		const renderOptions = savedRenderOptions
			? JSON.parse(savedRenderOptions)
			: { margin: 3, upscale: false };
		const defaultCardProperties = JSON.parse(
			localStorage.getItem("defaultCardProperties") ?? "{}"
		);
		const overrideCardProperties = JSON.parse(
			localStorage.getItem("overrideCardProperties") ?? "{}"
		);
		return {
			card: {},
			cardComponent,
			defaultCardProperties,
			overrideCardProperties,
			displayScale: 2.0,
			searchCardName: "",
			autocompleteStatus: null,
			renderOptions,
			rendering: false,
			upscaling: false,
			upscaleCache: {},
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
		document.addEventListener("keydown", this.keydown);
	},
	unmounted() {
		document.removeEventListener("keydown", this.keydown);
	},
	methods: {
		keydown(e) {},
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
						this.toast(`Loaded '${data.name}' from Scryfall.`);
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
								this.save();
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
							alert(`Unexpected file type, got '${file.type}'.`);
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
			/*
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
			*/
		},
		async upscale(imageURL, progress_callback) {
			this.upscaling = true;
			const blob = await fetch(imageURL).then((response) => response.blob());
			const imageObjectURL = URL.createObjectURL(blob);
			const default_progress = (arg) => {
				console.log("Upscaling... ", arg);
			};
			return (await upscaler())
				.upscale(imageObjectURL, {
					patchSize: 64,
					padding: 6,
					progress: progress_callback ?? default_progress,
				})
				.then((img) => {
					this.upscaling = false;
					return img;
				})
				.catch((error) => {
					console.error(error);
					progress_callback?.(error);
					this.upscaling = false;
				});
		},
		async renderCurrent(options) {
			const cardComp = this.$refs.cardComponent;
			options?.progress?.push_task({
				name: `Render '${cardComp.card_face.name}'`,
			});

			try {
				const card_display_el = document.querySelector(".card-display");
				const card_el = document.querySelector(".mtg-card");
				// FIXME: Doesn't work as expected
				card_el.classList.add("rendering");
				const cleanup_func = [];
				cleanup_func.push(() => {
					card_el.classList.remove("rendering");
				});
				const cleanup = () => {
					for (let c of cleanup_func) c();
				};
				const margin_px = (3288 / 63.5) * this.renderOptions.margin;
				const scale = 3288 / card_el.clientWidth / this.displayScale;

				if (this.renderOptions.upscale) {
					options?.progress?.push_step("Upscale Illustration");
					const original =
						cardComp.card_face?.image_uris?.art_crop ??
						this.card.image_uris?.art_crop;
					if (original) {
						if (!(original in this.upscaleCache)) {
							this.upscaleCache[original] = await this.upscale(
								original,
								(percent) => {
									if (isNaN(percent)) options?.progress?.fail_step(percent);
									else
										options?.progress?.update_step({
											type: "percent",
											value: (100 * percent).toFixed(2),
										});
								}
							);
						} else options?.progress?.update_step("Cached!");
						const illustration_el = card_el.querySelector(".illustration");
						const backgroundImageBackup = illustration_el.style.backgroundImage;
						illustration_el.style.backgroundImage =
							"url(" + this.upscaleCache[original] + ")";
						cleanup_func.push(() => {
							illustration_el.style.backgroundImage = backgroundImageBackup;
						});
						await new this.$nextTick();
						options?.progress?.end_step();
					} else {
						console.warn(
							`Upscaler: '${cardComp.card_face.name}' do not have an illustration.`
						);
						options?.progress?.fail_step("No image");
					}
				}

				options?.progress?.push_step("Pre Render");
				// FIXME: Call toPng twice to workaround image not loading on the first call
				// See https://github.com/tsayen/dom-to-image/issues/394
				const func =
					options?.toBlob || this.renderOptions.optimize
						? domtoimage.toBlob
						: domtoimage.toPng;

				await func(card_display_el).catch((error) => {
					console.error("Error generating first render:", error);
					options?.progress?.fail_task(error.message);
					cleanup();
				});

				options?.progress?.end_step();
				options?.progress?.push_step("Final Render");
				let result = await func(card_display_el, {
					width:
						2 * margin_px + this.displayScale * scale * card_el.clientWidth,
					height:
						2 * margin_px + this.displayScale * scale * card_el.clientHeight,
					style: {
						"transform-origin": "top left",
						transform: `scale(${scale})`,
						"background-color": "black",
						padding: `${this.renderOptions.margin * this.displayScale}mm`,
					},
				}).catch((error) => {
					console.error("Error generating render:", error);
					options?.progress?.fail_task(error.message);
					cleanup();
				});

				if (result) {
					options?.progress?.end_step();
					if (this.renderOptions.optimize) {
						options?.progress?.push_step("Optimize output PNG");
						try {
							let input_file_size = 0,
								output_file_size = 0;

							loadWebWorker();
							let optimizedPromise = new Promise((resolve) => {
								optipngWorker.onmessage = function (event) {
									const message = event.data;
									if (message.type == "stdout") {
										console.log("OptiPNG Worker:", message.data);
										let match_input = message.data.match(
											/Input file size = (\d+) bytes/
										);
										if (match_input) {
											input_file_size = parseInt(match_input[1]);
											options?.progress?.update_step(
												`Original Size: ${(
													input_file_size /
													1024 /
													1024
												).toFixed(2)}MB`
											);
										}
										let match_output = message.data.match(
											/Output file size = (\d+) bytes/
										);
										if (match_output) {
											output_file_size = parseInt(match_output[1]);
											options?.progress?.update_step(
												`${(input_file_size / 1024 / 1024).toFixed(2)}MB => ${(
													output_file_size /
													1024 /
													1024
												).toFixed(2)}MB`
											);
										}
									} else if (message.type == "done") {
										resolve(message.data);
									}
								};
							});

							optipngWorker.postMessage({
								type: "command",
								arguments: ["-o1"],
								file: {
									name: `${cardComp.card_face.name}.png`,
									data: new Uint8Array(await result.arrayBuffer()),
								},
							});

							let optimized = (await optimizedPromise).data;

							result = options?.toBlob
								? optimized
								: "data:image/png;base64," + btoa(Uint8ToString(optimized));
							options?.progress?.end_step(
								`${(input_file_size / 1024 / 1024).toFixed(2)}MB => ${(
									output_file_size /
									1024 /
									1024
								).toFixed(2)}MB`
							);
							options?.progress?.end_task();
						} catch (err) {
							options?.progress?.fail_step(err);
							options?.progress?.fail_task();
							result = null;
						}
					} else options?.progress?.end_task();
					cleanup();
					return result;
				}
			} catch (err) {
				options?.progress?.fail_task(err);
			}
			return null;
		},
		async render() {
			this.rendering = true;
			const modal = openModal({ disposable: false });
			const progress = createApp(Progress).mount(modal.$refs.defaultSlot);
			// TODO: Handle multiple faces
			let errored = false;
			try {
				if (this.$refs.cardComponent.is_dualfaced) {
					for (let idx = 0; idx < this.card.card_faces.length; ++idx) {
						this.$refs.cardComponent.set_face(idx);
						const dataUrl = await this.renderCurrent({ progress });
						if (dataUrl)
							download(
								`${this.$refs.cardComponent.card_face.name}.png`,
								dataUrl
							);
						else errored = true;
					}
				} else {
					const dataUrl = await this.renderCurrent({ progress });
					if (dataUrl) download(`${this.card.name}.png`, dataUrl);
					else errored = true;
				}
			} catch (err) {
				console.error(err);
			}
			modal.set_disposable(true);
			if (!errored)
				setTimeout(() => {
					//modal.close();
				}, 1000);
			this.rendering = false;
		},
		async renderAll(cards) {
			this.rendering = true;
			const modal = openModal({ disposable: false });
			const progress = createApp(Progress).mount(modal.$refs.defaultSlot);
			const renders = [];
			for (let c of cards) {
				try {
					this.card = c;
					await this.$nextTick();
					if (this.$refs.cardComponent.is_dualfaced) {
						for (let idx = 0; idx < this.card.card_faces.length; ++idx) {
							this.$refs.cardComponent.set_face(idx);
							const input = await this.renderCurrent({
								toBlob: true,
								progress,
							});
							if (input)
								renders.push({
									name: this.$refs.cardComponent.card_face.name + ".png",
									lastModified: new Date(),
									input,
								});
						}
					} else {
						const input = await this.renderCurrent({ toBlob: true, progress });
						if (input)
							renders.push({
								name: this.card.name + ".png",
								lastModified: new Date(),
								input,
							});
					}
				} catch (err) {
					console.error(err);
				}
			}
			progress.push_task({ name: `Create ZIP archive` });
			// FIXME: See https://touffy.me/client-zip/demo/worker to handle larger archives
			const blob = await downloadZip(renders).blob();
			progress.end_task();
			download("MTGRenders.zip", URL.createObjectURL(blob));
			modal.set_disposable(true);
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
		renderOptions: {
			handler() {
				localStorage.setItem(
					"renderOptions",
					JSON.stringify(this.renderOptions)
				);
			},
			deep: true,
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

<style>
@font-face {
	font-family: "Inconsolata";
	src: url("./assets/fonts/Ligconsolata-Regular.ttf") format("truetype");
}

a,
button,
.clickable {
	cursor: pointer;
}

a:hover {
	color: #666;
}

input,
textarea,
button,
select {
	border: 2px solid #9fb5bb;
	border-radius: 0.4em;
	margin: 0.1em;
	padding: 0.1em 0.3em 0.2em 0.3em;
	background: #e2f0f3;
}

input[type="button"],
button {
	color: white;
	background: #6c9ba5;
	border: 2px solid #80b6c2;
	box-shadow: 1px 1px 1px #000000;
	transition: border 0.1s ease;
	padding: 0.2em 0.6em 0.4em 0.6em;
}

input[type="button"]:hover,
button:hover {
	border: 2px solid #9acfda;
}

input[type="button"]:active,
button:active,
.clickable {
	transform: translateY(2px);
	box-shadow: initial;
}

textarea {
	font-family: Inconsolata;
}

.large-textarea {
	width: 100%;
	box-sizing: border-box;
}

.shortcut {
	color: rgb(214, 214, 214);
	font-size: 0.8em;
	margin-left: 0.4em;
}
</style>

<style scoped>
@font-face {
	font-family: "Beleren Small Caps";
	src: url("./assets/fonts/belerensmallcaps-bold.ttf") format("truetype");
}

.app {
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.header {
	display: flex;
	align-items: center;
	gap: 2em;
	padding: 1em 2em;
	background-image: linear-gradient(#6e939be0 80%, transparent);
}

.header h1 {
	margin: 0;
	color: white;
	font-family: Beleren Small Caps;
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
	flex-grow: 1;
	display: flex;
	gap: 1em;
	margin: 1em 2em;
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
	background-color: #ffffff50;
	box-shadow: inset 0 -4px 4px #00000018;
	color: #596669;
	border-radius: 0.5em 0.5em 0 0;
	padding: 0.2em 0.8em 0.2em 0.8em;
	cursor: pointer;
	font-weight: 900;
}

.dual-face-editor {
	display: flex;
	gap: 1em;
}

.selected-tab {
	background-color: #ffffff80;
	color: #000000;
	box-shadow: initial;
}

.inner-tab {
	background-color: #ffffff80;
	padding: 0.5em;
	border-radius: 0 0.5em 0.5em 0.5em;
}

.footer {
	color: white;
	font-size: 0.8em;
	padding: 0.6em 1em;
	background-image: linear-gradient(transparent, #6e939bd0 0.6em);
}
</style>

<style>
.card-info h2 {
	margin: 0.2em 0.4em;
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