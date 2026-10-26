import type { KanjiEntry } from './types';

export type KanjiRow = [string, KanjiEntry];

export function normalize(text: string) {
	return text.toLowerCase().replaceAll('.', '').replaceAll('-', '').replaceAll(' ', '');
}

export function isKanji(char: string) {
	return /\p{Script=Han}/u.test(char) || char === '々';
}

export function filterKanji(entries: KanjiRow[], search: string): KanjiRow[] {
	const trimmed = search.trim();

	// "12" matches exactly ID 12
	if (/^\d+$/.test(trimmed)) {
		const id = Number(trimmed);
		return entries.filter(([, item]) => item.id === id);
	}

	// "10-20" matches IDs 10 through 20
	const range = /^(\d+)\s*-\s*(\d+)$/.exec(trimmed);
	if (range) {
		const a = Number(range[1]);
		const b = Number(range[2]);
		const [from, to] = a <= b ? [a, b] : [b, a];
		return entries.filter(([, item]) => item.id >= from && item.id <= to);
	}

	const q = normalize(search);

	if (!q) {
		return entries;
	}

	// Split "母親" -> ["母", "親"]
	const terms = [...q].filter(isKanji);

	return entries
		.filter(([char, item]) => {
			const haystack = normalize(
				[char, item.keyword, item.components, item.on_reading, item.kun_reading].join(' ')
			);

			// If searching kanji, match ANY kanji
			if (terms.length > 0) {
				return terms.some((term) => haystack.includes(term));
			}

			// Normal text search
			return haystack.includes(q);
		})
		.sort(([charA], [charB]) => terms.indexOf(charA) - terms.indexOf(charB));
}
