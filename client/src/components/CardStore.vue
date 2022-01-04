<template>
	<div>
		<div
			style="
				display: flex;
				flex-direction: column;
				gap: 0.2em;
				max-height: 100%;
			"
		>
			<div style="display: flex; justify-content: space-around">
				<button @click="render_all">Render All</button>
				<button @click="download_all">⤓ Download All</button>
				<button @click="remove_all">🗑 Delete All</button>
			</div>
			<div class="card-list-container">
				<table class="card-list">
					<draggable v-model="cards" item-key="name" @end="save">
						<template #item="{element, index}">
							<tr
								:key="index"
								@click="load(element)"
								:class="{ 'selected-card': element.name === currentCard.name }"
							>
								<td class="name">{{ element.name }}</td>
								<td>
									<Mana
										:cost="element.mana_cost ?? element.card_faces?.[0].mana_cost"
										:archive="
											['archive', 'japanese-archive'].includes(element.art_variant)
										"
									/>
								</td>
								<td class="card-controls">
									<div @click="download(index)">⤓</div>
									<div @click="remove(index)">🗑</div>
								</td>
							</tr>
						</template>
					</draggable>
				</table>
			</div>
			<div
				style="display: flex; justify-content: space-around"
				:title="
					used_local_storage.properties
						.map((p) => `${(p.size / 1024).toFixed(2)}KB\t${p.name}`)
						.join('\n')
				"
			>
				{{ (used_local_storage.total / 1024).toFixed(2) }}KB used
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { downloadZip } from "client-zip";
import { download } from "../utils";
import Mana from "./Mana.vue";
import draggable from 'vuedraggable';
import { defineComponent } from "vue";

// Returns used storage space in KB
function used_local_storage() {
	let _lsTotal = 0,
		_xLen,
		_x;
	let properties = [];
	for (_x in localStorage) {
		if (!localStorage.hasOwnProperty(_x)) {
			continue;
		}
		_xLen = (localStorage[_x].length + _x.length) * 2;
		_lsTotal += _xLen;
		properties.push({ name: _x, size: _xLen }); //console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB");
	}
	return { total: _lsTotal, properties };
}

export default defineComponent({
	props: {
		currentCard: Object,
	},
	components: {
		Mana,
		draggable
	},
	data() {
		const cards = JSON.parse(localStorage.getItem("cards") ?? "[]");
		return { cards: cards };
	},
	mounted() {
		document.addEventListener("keydown", this.keydown);
	},
	unmounted() {
		document.removeEventListener("keydown", this.keydown);
	},
	methods: {
		save() {
			const idx = this.cards.findIndex((c) => c.name === this.currentCard.name);
			if (idx >= 0) {
				this.cards[idx] = JSON.parse(JSON.stringify(this.currentCard));
			} else {
				this.cards.push(this.currentCard);
			}
			this.store();
		},
		load(card) {
			this.$emit("load", JSON.parse(JSON.stringify(card)));
		},
		remove(idx) {
			if (
				confirm(`Are you sure you want to delete '${this.cards[idx].name}'?`)
			) {
				this.cards.splice(idx, 1);
				this.store();
			}
		},
		remove_all() {
			if (
				confirm(
					`Are you sure you want to delete all ${this.cards.length} cards?`
				)
			) {
				this.cards = [];
				this.store();
			}
		},
		store() {
			try {
				localStorage.setItem("cards", JSON.stringify(this.cards));
				this.toast("Saved!");
			} catch (err) {
				this.toast({
					type: "error",
					text: `Error saving in localStorage: ${err}`,
				});
				console.error(err);
			}
		},
		download(idx) {
			const blob = new Blob([JSON.stringify(this.cards[idx])], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = this.card.name + ".json";
			document.body.appendChild(a);
			a.click();
		},
		async download_all() {
			let files = [];
			for (let card of this.cards) {
				files.push({
					name: card.name.replace(/[^a-zA-Z0-9]+/g, "_") + ".json",
					lastModified: new Date(),
					input: new Blob([JSON.stringify(card)], {
						type: "application/json",
					}),
				});
			}
			const blob = await downloadZip(files).blob();
			download("Cards.zip", URL.createObjectURL(blob));
		},
		keydown(e) {
			if (e.ctrlKey && e.key === "s") {
				e.preventDefault(); // Prevent the Save dialog to open
				this.save();
			}
		},
		load_default() {
			if (this.cards.length > 0) {
				this.$emit("load", JSON.parse(JSON.stringify(this.cards[0])));
				return true;
			}
			return false;
		},
		render_all() {
			this.$emit("renderAll", this.cards);
		},
	},
	computed: {
		used_local_storage() {
			return used_local_storage();
		},
	},
});
</script>

<style>
.card-list-container {
	overflow: hidden;
	overflow-y: auto;
	max-height: 80vh;
}

.card-list {
	padding: 0 0.5em;
	margin: 0 0.7em 0 0.35em;
}

.card-list tr {
	position: relative;
	cursor: pointer;
	padding: 0.3em 0.5em;
	background-color: #ffffff60;
	width: 100%;
	list-style: none;
}

.card-list tr .name {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 10em;
}

.card-list tr:nth-child(odd) {
	background-color: #ffffff80;
}

.card-list td {
	padding: 0.2em 0.4em;
}

.card-list tr.selected-card {
	background-color: #b8e5f0;
}

.card-list tr:hover {
	background-color: #d4f3fa;
}

.card-list tr.selected-card::after {
	content: "▶";
	position: absolute;
	left: -0.5em;
	top: 50%;
	transform: translateY(-50%);
}

.card-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.card-controls div {
	cursor: pointer;
	font-size: 1.2em;
	padding: 0 0.2em;
	transition: all 0.1s ease-in-out;
}

.card-controls div:hover {
	color: #274853;
}
</style>