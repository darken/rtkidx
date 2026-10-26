import { describe, expect, it } from 'vitest';
import { kanji } from './data/kanji';
import { filterKanji, isKanji } from './search';

const entries = Object.entries(kanji);
const ids = (search: string) => filterKanji(entries, search).map(([, e]) => e.id);

describe('filterKanji', () => {
	it('returns everything for an empty search', () => {
		expect(filterKanji(entries, '')).toHaveLength(entries.length);
	});

	it('matches a digits-only query to the exact ID', () => {
		expect(ids('1')).toEqual([1]);
		expect(ids('100')).toEqual([100]);
	});

	it('matches a-b as an inclusive ID range', () => {
		expect(ids('100-110')).toEqual([100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);
		expect(ids('110-100')).toHaveLength(11);
	});

	it('does not match IDs from text queries', () => {
		expect(ids('one').every((id) => id !== 0)).toBe(true);
	});

	it('matches any kanji in the query and orders by query position', () => {
		expect(
			filterKanji(entries, '二一')
				.map(([c]) => c)
				.slice(0, 2)
		).toEqual(['二', '一']);
	});

	it('matches keywords', () => {
		expect(filterKanji(entries, 'one').map(([c]) => c)).toContain('一');
	});
});

describe('isKanji', () => {
	it('accepts Han characters and 々', () => {
		expect(isKanji('母')).toBe(true);
		expect(isKanji('々')).toBe(true);
		expect(isKanji('㐀')).toBe(true);
	});

	it('rejects non-Han characters', () => {
		expect(isKanji('a')).toBe(false);
		expect(isKanji('あ')).toBe(false);
		expect(isKanji('1')).toBe(false);
	});
});
