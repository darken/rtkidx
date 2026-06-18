<script lang="ts">
	import type { KanjiEntry } from '../types';

	let {
		character,
		entry,
		visibleField,
		showAll
	}: {
		character: string;
		entry: KanjiEntry;
		visibleField: number;
		showAll: boolean;
	} = $props();
</script>

<article class="result">
	<div class="row">
		{#if visibleField !== 1 || showAll}
			<a class="title" target="_blank" href="https://jisho.org/search/{character}%20%23kanji"
				>{entry.kanji}</a
			>
		{/if}
		<div class="column">
			<div class="row">
				<span class="num">{entry.id.toString().padStart(4, '0')}</span>
				{#if visibleField !== -1}
					<input type="checkbox" bind:checked={showAll} />
				{/if}
			</div>
			{#if visibleField !== 0 || showAll}
				<a class="keyword" target="_blank" href="https://wordnik.com/words/{entry.keyword}"
					>{entry.keyword}</a
				>
			{/if}
		</div>
	</div>
	{#if visibleField !== 0 || showAll}
		<div class="components">{entry.components}</div>
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
		color: darkgrey;
		margin-top: 2px;
	}
	.result .row input[type='checkbox'] {
		margin-left: auto;
	}
</style>
