<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { kanji } from '$lib/data/kanji';
	import { filterKanji } from '$lib/search';
	import KanjiCard from '$lib/components/KanjiCard.svelte';

	let studyMode = $state(false);
	let search = $state('');
	let studyStartIndex = $state<number | null>(1);
	let studyItemsSize = $state<number | null>(20);

	const STUDY_MIN = 1;
	const STUDY_MAX = 3000;

	let kanjiHidden = $state(false);
	let kanjiVisibleField = $state(-1);
	let kanjiShowAll = $state(false);

	const entries = Object.entries(kanji);

	function blurOnEnter(node: any) {
		const handleKeydown = (event: any) => {
			if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229) {
				node.blur();
			}
		};

		node.addEventListener('keydown', handleKeydown);

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
			}
		};
	}

	function clamp(value: number | null, fallback: number) {
		if (value === null || !Number.isFinite(value)) {
			return fallback;
		}

		return Math.min(STUDY_MAX, Math.max(STUDY_MIN, Math.trunc(value)));
	}

	function nextBatch() {
		const next = clamp(studyStartIndex, 1) + clamp(studyItemsSize, 20);
		studyStartIndex = next > STUDY_MAX || next > entries.length ? 1 : next;
	}

	let mounted = $state(false);

	onMount(() => {
		// Runs strictly in the browser after static HTML has mounted
		search = page.url.searchParams.get('q') ?? '';
		mounted = true;
	});

	// Keep `q` in the URL in sync with the search, once the initial `q` has been read
	$effect(() => {
		if (!mounted) {
			return;
		}

		const value = search;
		const timer = setTimeout(() => {
			const url = new URL(page.url);
			if (value) {
				url.searchParams.set('q', value);
			} else {
				url.searchParams.delete('q');
			}
			replaceState(url, page.state);
		}, 300);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (studyMode) {
			// Study mode
			const start = clamp(studyStartIndex, 1) - 1;
			const size = clamp(studyItemsSize, 20);
			search = entries.slice(start, start + size).reduce((acc, v) => acc + v[0], '');

			kanjiVisibleField = kanjiHidden ? 1 : 0;
			kanjiShowAll = false;
		} else {
			kanjiVisibleField = -1;
			kanjiShowAll = false;
		}
	});

	let filtered = $derived(filterKanji(entries, search));
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

	<input
		type="search"
		placeholder="Search kanji, meaning, reading..."
		bind:value={search}
		use:blurOnEnter
	/>
	<small id="search-helper">{filtered.length} results</small>
	{#if studyMode}
		<article class="grid">
			<fieldset>
				<legend><strong>First kanji</strong></legend>
				<fieldset role="group">
					<input
						type="number"
						min={STUDY_MIN}
						max={STUDY_MAX}
						bind:value={studyStartIndex}
						use:blurOnEnter
					/>
					<button type="button" onclick={nextBatch}>+{clamp(studyItemsSize, 20)}</button>
				</fieldset>
			</fieldset>
			<fieldset>
				<legend><strong>Kanji amount</strong></legend>
				<input
					type="number"
					min={STUDY_MIN}
					max={STUDY_MAX}
					bind:value={studyItemsSize}
					use:blurOnEnter
				/>
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
			<fieldset>
				<input type="submit" value="Delete selected" onclick={() => console.log('REMOVE')} />
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
