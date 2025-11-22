import { computed, type ComputedRef } from 'vue';

export interface CardTypeSpecificsResult {
	planeswalker_abilities: ComputedRef<
		{ html: string; cost: number | null }[] | null
	>;
	is_large_planeswalker: ComputedRef<boolean>;
	saga_reminder: ComputedRef<string>;
	saga_steps: ComputedRef<{ steps: string[]; html: string }[]>;
	class_reminder: ComputedRef<string>;
	class_steps: ComputedRef<{ class: string; html: string }[]>;
	levels: ComputedRef<
		| {
				level_text: string;
				level: number | string;
				power?: string;
				toughness?: string;
				oracle_lines: string[];
				color: string;
				box_color: string;
		  }[]
		| null
	>;
}

export function useCardTypeSpecifics(
	card_face: ComputedRef<any>,
	is_planeswalker: ComputedRef<boolean>,
	is_levelup: ComputedRef<boolean>,
	colors: ComputedRef<string>,
	frame_colors: ComputedRef<{ left: string; right: string }>,
	parse_oracle: (str: string) => string
): CardTypeSpecificsResult {
	const planeswalker_abilities = computed(() => {
		if (!is_planeswalker.value) return null;
		return card_face.value.oracle_text
			.split('\n')
			.map(parse_oracle)
			.map((line: string) => {
				const r: { html: string; cost: number | null } = { html: line, cost: null };
				const m = line.match(/^[+-−]?(\d+):/);
				if (m) {
					if (line[0] === '0') {
						r.cost = 0;
					} else if (line[0] === '+') {
						r.cost = parseInt(m[1]);
					} else r.cost = -parseInt(m[1]);
					r.html = line.substr(m[0].length + 1);
				}
				return r;
			});
	});

	const saga_reminder = computed(() => {
		if (!card_face.value?.oracle_text) return '';
		return parse_oracle(card_face.value.oracle_text.split('\n')[0]);
	});

	const saga_steps = computed(() => {
		if (!card_face.value?.oracle_text) return [];
		return card_face.value.oracle_text
			.split('\n')
			.filter((s: string) => s.match(/^(.+) — /))
			.map(parse_oracle)
			.map((str: string) => {
				const m = str.match(/(.+) — (.+)/);
				return {
					steps: m![1]
						.split(',')
						.map(
							(s: string) =>
									`/assets/img/saga/${s.trim()}.webp`
						),
					html: m![2],
				};
			});
	});

	const class_reminder = computed(() => {
		if (!card_face.value?.oracle_text) return '';
		return parse_oracle(card_face.value.oracle_text.split('\n')[0]);
	});

	const class_steps = computed(() => {
		const lines = card_face.value?.oracle_text?.split('\n') || [];
		const r = [];
		for (let i = 1; i < lines.length; ++i) {
			const m = lines[i].match(/({[^:]+}): (Level|Niveau) (\d)/);
			if (m) {
				r.push({
					class: 'level-header',
					html: parse_oracle(`<div>${m[1]}:</div><div>${m[2]} ${m[3]}</div>`),
				});
			} else
				r.push({
					class: 'normal',
					html: parse_oracle(lines[i]),
				});
		}
		return r;
	});

	const levels = computed(() => {
		if (!is_levelup.value) return null;
		const levelstext = card_face.value.oracle_text.split(/(LEVEL|NIVEAU) ([^\n]+)\n/);
		const box_color =
			{
				W: '#dcc8af',
				U: '#b9c0da',
				B: '#af9aa5',
				R: '#d7a67c',
				G: '#b2c0b0',
			}[colors.value?.[0] ?? 'W'] || '#dcc8af';

		const levels = [
			{
				level_text: '',
				level: 0,
				power: card_face.value.power,
				toughness: card_face.value.toughness,
				oracle_lines: levelstext[0].split('\n').map(parse_oracle),
				color: '#00000000',
				box_color,
			},
		];

		for (let i = 1; i < levelstext.length; i += 3) {
			const pt = card_face.value.power
				? levelstext[i + 2].split('\n')[0].split('/')
				: null;
			const oracle = pt
				? levelstext[i + 2].substr(levelstext[i + 2].indexOf('\n') + 1)
				: levelstext[i + 2];
			levels.push({
				level_text: levelstext[i + 0],
				level: levelstext[i + 1],
				power: pt?.[0],
				toughness: pt?.[1],
				oracle_lines: oracle.split('\n').map(parse_oracle),
				color:
					frame_colors.value.left +
					((1 + i / 3) * 25).toFixed(0).toString(16),
				box_color,
			});
		}

		return levels;
	});

	const is_large_planeswalker = computed(() => {
		return is_planeswalker.value && (planeswalker_abilities.value?.length ?? 0) > 3;
	});

	return {
		planeswalker_abilities,
		is_large_planeswalker,
		saga_reminder,
		saga_steps,
		class_reminder,
		class_steps,
		levels,
	};
}
