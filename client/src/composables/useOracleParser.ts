import mana_symbols from '../symbols';

const keywords = {
	// Disabled for now: This should be made optional, or even explicitly specified (like "{Flash}" instead of "Flash")
	// Flash: "You may cast this spell any time you could cast an instant.",
};

const mana_regex = /{([^}]+)}/g;

export function useOracleParser() {
	const gen_mana_symbol = (str: string, classes: string[] = []): HTMLImageElement | null => {
		if ('{' + str + '}' in mana_symbols) {
			const el = new Image();
			el.src = mana_symbols['{' + str + '}'].svg_uri;
			el.className = 'ms';
			return el;
		}
		return null;
	};

	const parse_oracle = (str: string): string => {
		if (str in keywords) {
			return `${str} <span class="oracle-reminder">(${keywords[str]})</span>`;
		}
		str = str.replace(
			mana_regex,
			(match, group) => gen_mana_symbol(group)?.outerHTML ?? match
		);
		// Included reminder text
		str = str.replace(
			/\([^)]+\)/g,
			(match) => `<span class="oracle-reminder">${match}</span>`
		);
		return str;
	};

	return {
		gen_mana_symbol,
		parse_oracle,
	};
}
