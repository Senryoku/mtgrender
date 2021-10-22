<template>
	<div>
		<button @click="save">Save</button>
		<ol class="card-list">
			<li
				v-for="(card, idx) in cards"
				:key="idx"
				@click="load(card)"
				:class="{ 'selected-card': card.name === currentCard.name }"
			>
				<span>{{ card.name }}</span>
				<span class="card-controls"><span @click="remove(idx)">🗑</span></span>
			</li>
		</ol>
	</div>
</template>

<script>
export default {
	props: {
		currentCard: Object,
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
			if (confirm(`Are you sure you want to delete '${this.cards[idx].name}'?`))
				this.cards.splice(idx, 1);
		},
		store() {
			localStorage.setItem("cards", JSON.stringify(this.cards));
			// TODO: Notify user
		},
		keydown(e) {
			if (e.ctrlKey && e.key === "s") {
				e.preventDefault(); // Prevent the Save dialog to open
				this.store();
			}
		},
	},
};
</script>

<style>
.card-list {
	padding: 0;
	margin: 0.5em;
}

.card-list li {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	cursor: pointer;
	padding: 0.3em 0.5em;
	background-color: #00000015;
	width: 100%;
	list-style: none;
}

.card-list li:nth-child(odd) {
	background-color: #00000020;
}

.selected-card::before {
	content: "▶";
	position: absolute;
	left: -0.5em;
	width: 1em;
	height: 1em;
}
</style>