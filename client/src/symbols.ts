export const mana_symbols = {};
import mana_symbols_list from "./assets/data/symbology.json";

function getImage(svg_uri) {
	return new URL(`/src/assets/img/symbols/${svg_uri}`, import.meta.url).href;
}

for (let symbol of mana_symbols_list) {
	mana_symbols[symbol.symbol] = symbol;

	mana_symbols[symbol.symbol].svg_uri = getImage(
		mana_symbols[symbol.symbol].svg_uri
	);
}

export default mana_symbols;
