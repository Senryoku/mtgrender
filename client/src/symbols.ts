export const mana_symbols = {};
import mana_symbols_list from "./assets/data/symbology.json";
for (let symbol of mana_symbols_list) {
	mana_symbols[symbol.symbol] = symbol;

	mana_symbols[symbol.symbol].svg_uri = new URL(
		"assets/img/symbols/" + mana_symbols[symbol.symbol].svg_uri,
		import.meta.url
	).href;
}

export default mana_symbols;
