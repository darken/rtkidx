<script lang="ts">
	import type { KanjiEntry } from '../types';

	let {
		character,
		entry,
		visibleField,
		showAll,
		checked,
		onToggle
	}: {
		character: string;
		entry: KanjiEntry;
		visibleField: number;
		showAll: boolean;
		checked: boolean;
		onToggle: () => void;
	} = $props();

	let revealed = $derived(showAll || checked);
</script>

<article class="result">
	<div class="row">
		{#if visibleField !== 1 || revealed}
			<a class="title" target="_blank" href="https://jisho.org/search/{character}%20%23kanji"
				>{entry.kanji}</a
			>
		{/if}
		<div class="column">
			<div class="row">
				<span class="num">{entry.id.toString().padStart(4, '0')}</span>
				{#if visibleField !== -1}
					<input type="checkbox" {checked} onchange={onToggle} aria-label="Select {entry.kanji}" />
				{/if}
			</div>
			{#if visibleField !== 0 || revealed}
				<a class="keyword" target="_blank" href="https://wordnik.com/words/{entry.keyword}"
					>{entry.keyword}</a
				>
			{/if}
		</div>
	</div>
	{#if visibleField !== 0 || revealed}
		<div class="components">{entry.components}</div>
	{/if}
	{#if visibleField !== 0 || revealed}
		<div class="words">
			{#each entry.words as [word, reading]}
				<span class="word" title={reading}>{word}</span>
			{/each}
		</div>
	{/if}
</article>

<style>
	.result {
		display: block;
		flex: 1em;
		padding: 12px;
		margin-bottom: 18px;
		border-radius: 8px;
		word-wrap: break-word;
		min-width: 9em;
	}

	@media screen and (max-width: 387px) {
		.result {
			min-width: 6em;
		}
	}

	.result .row {
		display: flex;
		gap: 6px;
	}
	.result .column {
		display: flex;
		flex-direction: column;
	}

	.result .title {
		font-size: 26px;
		font-weight: bold;
		color: inherit;
		text-decoration: none;
	}
	.result .num {
		font-size: 18px;
		font-weight: bold;
		color: indianred;
	}
	.result .keyword {
		font-size: 18px;
		font-weight: bold;
		text-decoration: none;
	}
	.result .components {
		font-size: 14px;
		color: #727272;
		margin-top: 2px;
	}
	.result .words {
		margin-top: 2px;
	}
	.result .words .word {
		display: inline-block;
		font-size: 16px;
		color: #333d53;
		background: #f9fafb;
		padding: 0.05rem 0.25rem;
		margin: 0 0.35rem 0.2rem 0;
		border-radius: 8px;
	}
	.result .row input[type='checkbox'] {
		margin-left: auto;
	}
</style>
