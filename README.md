# RTK Index

A searchable index of the kanji from _Remembering the Kanji_ (RTK), with a study mode for drilling them in batches. Built with SvelteKit (Svelte 5) and [Pico CSS](https://picocss.com), and prerendered as a static site.

## Features

- **Search** by kanji, keyword (meaning), components, or on/kun reading.
  - `12` matches the kanji with ID 12.
  - `10-20` matches IDs 10 through 20.
  - Pasting a word such as `母親` shows each kanji it contains.
  - Punctuation and spaces are ignored, so `ひと.つ` and `ひとつ` are equivalent.
- **Shareable URLs**: the search is kept in the `?q=` query parameter.
- **Study mode**: pick a starting ID and batch size, step through batches with the `+N` button, and hide the kanji (or show everything) to test yourself. Select cards you've learned and use **Delete selected** to drop them from the current batch.
- **Kanji cards** with readings and example words.

## Getting started

Requires Node.js and npm.

```sh
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the dev server                   |
| `npm run build`   | Build the static site into `build/`    |
| `npm run preview` | Preview the production build           |
| `npm run test`    | Run the Vitest suite                   |
| `npm run check`   | Type-check with `svelte-check`         |
| `npm run lint`    | Check formatting (Prettier) and ESLint |
| `npm run format`  | Format the code with Prettier          |

## Project structure

```
src/
├── lib/
│   ├── components/KanjiCard.svelte   # Single kanji card
│   ├── data/kanji.ts                 # Kanji dataset, keyed by character
│   ├── search.ts                     # Search/filter logic (tested in search.test.ts)
│   └── types.ts                      # KanjiEntry type
└── routes/
    └── +page.svelte                  # Search UI and study mode
```

Each entry in `src/lib/data/kanji.ts` looks like:

```ts
'一': {
  id: 1,
  keyword: 'one',
  components: '',
  on_reading: 'イチ, イツ',
  kun_reading: 'ひと-, ひと.つ',
  kanji: '一',
  words: [['一緒に', 'いっしょに'] /* ... */]
}
```

## Deployment

The app uses `@sveltejs/adapter-static`, so `npm run build` outputs plain static files to `build/` that can be hosted anywhere.

## License

[GPL-3.0](LICENSE)
