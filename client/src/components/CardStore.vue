<template>
	<div>
		<button @click="render_all">Render All</button>
		{{ used_local_storage }}KB used
		<div class="card-list-container">
			<ol class="card-list">
				<li
					v-for="(card, idx) in cards"
					:key="idx"
					@click="load(card)"
					:class="{ 'selected-card': card.name === currentCard.name }"
				>
					<div class="name">{{ card.name }}</div>
					<span class="card-controls"><span @click="remove(idx)">🗑</span></span>
				</li>
			</ol>
		</div>
	</div>
</template>

<script>
// Returns used storage space in KB
function used_local_storage() {
	let _lsTotal = 0,
		_xLen,
		_x;
	for (_x in localStorage) {
		if (!localStorage.hasOwnProperty(_x)) {
			continue;
		}
		_xLen = (localStorage[_x].length + _x.length) * 2;
		_lsTotal += _xLen;
		//console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB");
	}
	return (_lsTotal / 1024).toFixed(2);
}

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
			if (
				confirm(`Are you sure you want to delete '${this.cards[idx].name}'?`)
			) {
				this.cards.splice(idx, 1);
				this.store();
			}
		},
		store() {
			try {
				localStorage.setItem("cards", JSON.stringify(this.cards));
			} catch (err) {
				alert("Error saving in localStorage:", err);
			}
			// TODO: Notify user
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
};
</script>

<style>
.card-list-container {
	overflow: hidden;
	overflow-y: auto;
	max-height: 80vh;
}

.card-list {
	padding: 0;
	padding-left: 0.5em;
	margin: 0.5em;
}

.card-list li {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	cursor: pointer;
	padding: 0.3em 0.5em;
	background-color: #ffffff60;
	width: 100%;
	list-style: none;
}

.card-list li .name {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 10em;
}

.card-list li:nth-child(odd) {
	background-color: #ffffff80;
}

.selected-card::before {
	content: "▶";
	position: absolute;
	left: -0.5em;
	width: 1em;
	height: 1em;
}
</style>