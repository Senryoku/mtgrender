<template>
	<div>
		<form @submit.prevent="load_card">
			<input type="text" placeholder="Card Name..." />
			<button type="submit">Load</button>
		</form>
		<button @click="render" :disabled="rendering">Render to PNG</button>
		<button @click="upscale" :disabled="upscaling">Upscale Illustration</button>
	</div>
	<MTGCard :card="card" />
</template>

<script lang="ts">
import domtoimage from "dom-to-image";

import MTGCard from "./components/MTGCard.vue";

export default {
	name: "App",
	components: {
		MTGCard,
	},
	data() {
		return {
			card: {},
			rendering: false,
			upscaling: false,
		};
	},
	mounted() {
		//this.load_card("Old Stickfingers");
		this.load_card("Displacer Beast");
	},
	methods: {
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
		async upscale() {
			this.upscaling = true;
			const formdata = new FormData();
			formdata.append("image", this.card.image_uris.art_crop);
			await fetch("https://api.deepai.org/api/waifu2x", {
				method: "POST",
				headers: { "api-key": "quickstart-QUdJIGlzIGNvbWluZy4uLi4K" },
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
			const scale = 3288 / card_el.clientWidth;
			domtoimage
				.toPng(document.querySelector(".mtg-card"), {
					width: scale * card_el.clientWidth,
					height: scale * card_el.clientHeight,
					style: {
						"transform-origin": "top left",
						transform: `scale(${scale})`,
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
		},
	},
};
</script>
