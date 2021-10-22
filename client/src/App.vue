<template>
	<div @drop="dropHandler" @dragover="dragOverHandler">
		<div class="menu">
			<button @click="card = JSON.parse(JSON.stringify(base_card))">
				New Card
			</button>
			<form @submit.prevent="load_card">
				<input type="text" placeholder="Card Name..." />
				<button type="submit">Load</button>
			</form>
		</div>
		<div class="content">
			<div class="card-display">
				<MTGCard :card="card" />
			</div>
			<div>
				<div class="tabs">
					<div
						v-for="(tabName, idx) in ['Card Info', 'Render', 'Raw JSON']"
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
						<label for="card-name">Name</label>
						<input id="card-name" v-model="card.name" type="text" />
					</div>
					<div>
						<label for="card-mana-cost">Mana Cost</label>
						<input id="card-mana-cost" v-model="card.mana_cost" type="text" />
					</div>
					<div>
						<label for="card-type-line">Type Line</label>
						<input id="card-type-line" v-model="card.type_line" type="text" />
					</div>
					<div>
						<label for="card-oracle">Oracle</label><br />
						<textarea
							id="card-oracle"
							v-model="card.oracle_text"
							cols="40"
							rows="6"
						/>
					</div>
					<div>
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
					</div>
					<div v-if="card.image_uris">
						<label for="card-illustration">Illustration</label>
						<input
							id="card-illustration"
							v-model="card.image_uris.art_crop"
							type="text"
						/>
					</div>
					<div>
						<label for="card-artist">Artist</label>
						<input id="card-artist" v-model="card.artist" type="text" />
					</div>
					<div>
						<label for="card-set">Set</label>
						<input id="card-set" v-model="card.set" type="text" />
					</div>
					<div>
						<label for="card-number">Number</label>
						<input
							id="card-number"
							v-model="card.collector_number"
							type="text"
						/>
					</div>
				</div>
				<div v-show="currentTab === 1" class="inner-tab">
					{{ illustration_dimensions[0] }}x{{ illustration_dimensions[1] }}
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
				<div v-show="currentTab === 2" class="inner-tab">
					<textarea
						:value="JSON.stringify(card, null, 2)"
						@change="update_card"
						ref="jsonView"
						rows="20"
						cols="80"
					></textarea>
				</div>
			</div>
			<CardStore :currentCard="card" @load="load" />
		</div>
	</div>
</template>

<script lang="ts">
import { ref } from "vue";
import domtoimage from "dom-to-image";
import "keyrune";

import MTGCard from "./components/MTGCard.vue";
import CardStore from "./components/CardStore.vue";

export default {
	name: "App",
	components: {
		MTGCard,
		CardStore,
	},
	data() {
		const jsonView = ref(null);
		return {
			card: {},
			display_scale: 2.0,
			renderOptions: {
				margin: 3,
			},
			rendering: false,
			upscaling: false,
			currentTab: 0,
			jsonView,
			base_card: {
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
		this.load_card("Displacer Beast");
	},
	methods: {
		load(card) {
			this.card = card;
		},
		load_card(event) {
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
		async upscale() {
			this.upscaling = true;
			const formdata = new FormData();
			formdata.append("image", this.card.image_uris.art_crop);
			await fetch("https://api.deepai.org/api/waifu2x", {
				method: "POST",
				headers: { "api-key": "84b79bce-e6c3-4153-bd0d-83e1edb2aa1c" },
				body: formdata,
			})
				.then((response) => response.json())
				.then((data) => {
					this.card.image_uris.art_crop = data.output_url;
					this.upscaling = false;
				})
				.catch((error) => {
					alert(error);
					this.upscaling = false;
				});
		},
		render() {
			this.rendering = true;
			const card_el = document.querySelector(".mtg-card");
			const margin_px = (3288 / 63.5) * this.renderOptions.margin;
			const scale = 3288 / card_el.clientWidth / this.display_scale;
			// FIXME: Call toPng twice to workaround image not loading on the first call
			// See https://github.com/tsayen/dom-to-image/issues/394
			domtoimage.toPng(document.querySelector(".card-display")).then(() => {
				domtoimage
					.toPng(document.querySelector(".card-display"), {
						width:
							(2 * margin_px) / this.display_scale +
							this.display_scale * scale * card_el.clientWidth,
						height:
							(2 * margin_px) / this.display_scale +
							this.display_scale * scale * card_el.clientHeight,
						style: {
							"transform-origin": "top left",
							transform: `scale(${scale})`,
							"background-color": "black",
							padding: `${this.renderOptions.margin}mm`,
						},
					})
					.then((dataUrl) => {
						const link = document.createElement("a");
						link.download = `${this.card.name}.png`;
						link.href = dataUrl;
						link.click();
						this.rendering = false;
					})
					.catch((error) => {
						console.error("oops, something went wrong!", error);
						this.rendering = false;
					});
			});
		},
		update_card(event) {
			try {
				this.card = JSON.parse(event.target.value);
			} catch (err) {
				console.error(err);
			}
		},
	},
	computed: {
		illustration_dimensions() {
			if (!this.card?.image_uris?.art_crop) return [0, 0];
			const img = new Image();
			img.src = this.card.image_uris.art_crop;
			return [img.width, img.height];
		},
	},
	watch: {
		card() {
			this.$refs.jsonView.value = JSON.stringify(this.card);
		},
	},
};
</script>

<style scoped>
.menu {
	display: flex;
	gap: 1em;
	margin: 0.5em;
}

.content {
	display: flex;
	gap: 1em;
	margin: 1em;
}

.card-display {
	width: calc(2 * 63mm);
}

.card-display .mtg-card {
	transform: scale(v-bind(display_scale));
	transform-origin: left top;
}

.tabs {
	display: flex;
	gap: 1em;
}

.tab {
	background-color: #00000040;
	color: #000000a0;
	border-radius: 0.5em 0.5em 0 0;
	padding: 0.2em 0.2em 0 0.2em;
	cursor: pointer;
}

.selected-tab {
	background-color: #00000020;
	color: #000000;
}

.inner-tab {
	background-color: #00000020;
	padding: 0.5em;
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
</style>