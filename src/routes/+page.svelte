<script lang="ts">
	import { kanji } from '$lib/data/kanji';
	import KanjiCard from '$lib/components/KanjiCard.svelte';

	let studyMode = $state(false);
	let search = $state('');
	let studyStartIndex = $state(1);
	let studyItemsSize = $state(20);

	let kanjiHidden = $state(false);
	let kanjiVisibleField = $state(-1);
	let kanjiShowAll = $state(false);

	const entries = Object.entries(kanji);

	function normalize(text: string) {
		return text.toLowerCase().replaceAll('.', '').replaceAll('-', '').replaceAll(' ', '');
	}

	function isKanji(char: string) {
		return /[\u4e00-\u9faf]/.test(char);
	}

	$effect(() => {
		if (studyMode) {
			// Study mode
			let start = studyStartIndex - 1;
			search = entries.slice(start, start + studyItemsSize).reduce((acc, v) => acc + v[0], '');

			kanjiVisibleField = kanjiHidden ? 1 : 0;
			kanjiShowAll = false;
		} else {
			kanjiVisibleField = -1;
			kanjiShowAll = false;
		}
	});

	let filtered = $derived(
		(() => {
			const q = normalize(search);

			if (!q) {
				return entries;
			}

			// Split "母親" -> ["母", "親"]
			const terms = [...q].filter(isKanji);

			return entries.filter(([char, item]) => {
				const haystack = normalize(
					[char, item.keyword, item.components, item.on_reading, item.kun_reading, item.id].join(
						' '
					)
				);

				// If searching kanji, match ANY kanji
				if (terms.length > 0) {
					return terms.some((term) => haystack.includes(term));
				}

				// Normal text search
				return haystack.includes(q);
			});
		})()
	);
</script>

<main class="container">
	<nav>
		<ul>
			<li><h1>RTK Index</h1></li>
		</ul>
		<ul>
			<li>
				<label for="study">
					<input type="checkbox" name="study" id="study" role="switch" bind:checked={studyMode} />
					Study mode
				</label>
			</li>
		</ul>
	</nav>

	<input type="search" placeholder="Search kanji, meaning, reading..." bind:value={search} />
	<small id="search-helper">{filtered.length} results</small>
	{#if studyMode}
		<article class="grid">
			<fieldset>
				<legend><strong>First kanji</strong></legend>
				<fieldset role="group">
					<input type="number" bind:value={studyStartIndex} />
					<input type="submit" value="+{studyItemsSize}" onclick={() => studyStartIndex += studyItemsSize} />
				</fieldset>
			</fieldset>
			<fieldset>
				<legend><strong>Kanji amount</strong></legend>
				<input type="number" bind:value={studyItemsSize} />
			</fieldset>
			<fieldset class="switch-set">
				<label for="studyFront">
					Hide kanji
					<input
						type="checkbox"
						name="studyFront"
						id="studyFront"
						role="switch"
						bind:checked={kanjiHidden}
					/>
				</label>
				<label for="studyShowAll">
					Show all
					<input
						type="checkbox"
						name="studyShowAll"
						id="studyShowAll"
						role="switch"
						bind:checked={kanjiShowAll}
					/>
				</label>
			</fieldset>
		</article>
	{/if}

	<section class="kanjiOutput">
		{#each filtered as [char, entry]}
			<KanjiCard character={char} {entry} visibleField={kanjiVisibleField} showAll={kanjiShowAll} />
		{/each}
	</section>
</main>

<style>
	main {
		padding-top: 1rem;
	}

	.switch-set {
		padding-top: 1.7rem;
	}
	@media (max-width: 769px) {
		.switch-set {
			padding-top: 0;
		}
	}

	.kanjiOutput {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
</style>
