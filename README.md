# The Back Bar 🍸

A small Express/Node.js site that pulls recipes live from [TheCocktailDB](https://www.thecocktaildb.com/api.php)
using Axios and renders them with EJS. Search a cocktail by name, browse by
category, or hit "pour me something random" for a surprise.

**Live demo:** https://back-bar-cocktails.netlify.app

TheCocktailDB's free tier needs no signup, no API key, and no auth headers,
so there's nothing to configure — clone it and run it.

## Features

- Search cocktails by name (`GET /search?q=...`)
- Browse by category from a live list pulled from the API (`GET /category/:name`)
- Get a random cocktail (`GET /random`)
- View full recipe detail — ingredients, measurements, glass, and
  instructions — styled like a bartender's order ticket (`GET /cocktail/:id`)
- Graceful error handling: a failed API call or an empty result set renders
  a friendly "86'd" (bar slang for "we're out of that") message instead of
  crashing or showing a raw stack trace

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` uses `nodemon` to restart the server on file changes. To run
it without nodemon:

```bash
npm start
```

Then open **http://localhost:3000** in your browser.

Optional: set a `PORT` environment variable to run on something other than
3000 (e.g. `PORT=4000 npm run dev`).

## Project structure

```
back-bar-cocktails/
├── app.js                  # Express app setup: view engine, static files, routes, error handlers
├── server.js               # Local dev entry point (requires app.js, calls .listen())
├── netlify.toml             # Netlify build/redirect config
├── netlify/functions/
│   └── server.js           # Wraps app.js as a Netlify Function via serverless-http
├── routes/
│   └── cocktails.js        # All page routes (home, search, category, random, detail)
├── services/
│   └── cocktailApi.js      # Axios calls to TheCocktailDB + ingredient parsing
├── views/
│   ├── partials/
│   │   ├── header.ejs      # <head>, site header, nav search
│   │   └── footer.ejs      # site footer, closing tags
│   ├── index.ejs           # home page: search, random button, category shelf
│   ├── results.ejs         # search/category results grid
│   ├── cocktail.ejs        # full recipe detail ("order ticket")
│   └── error.ejs           # 404 / API failure / empty-result page
└── public/
    └── css/style.css       # all styling
```

## Deploying to Netlify

This app is a normal Express server, but Netlify only hosts static files and
serverless functions - it doesn't run a persistent Node process. `app.js`
holds the Express app itself (no `.listen()`), so it can be reused two ways:

- **Locally:** `server.js` requires `app.js` and calls `.listen()`.
- **On Netlify:** `netlify/functions/server.js` wraps the same `app.js` with
  [`serverless-http`](https://github.com/dougmoscrop/serverless-http) so it
  runs as a single Netlify Function.

`netlify.toml` publishes `public/` directly (so `/css/style.css` is served
by the CDN, not the function) and redirects every other path to the
function, which handles all the dynamic routes exactly like it does locally.

To deploy your own copy:

```bash
npm install -g netlify-cli
netlify login
netlify init      # or: netlify sites:create --name your-site-name
netlify deploy --prod
```

One gotcha worth knowing: Express loads the EJS view engine dynamically by
name, which Netlify's function bundler can't trace statically - without an
explicit `require('ejs')` in `app.js`, the deployed function fails with
`Cannot find module 'ejs'` even though it works fine locally.

## API used

[TheCocktailDB](https://www.thecocktaildb.com/api.php) v1 (free/test key `1`):

| Purpose            | Endpoint                                  |
| ------------------ | ------------------------------------------ |
| Search by name     | `/search.php?s={name}`                     |
| Lookup by id       | `/lookup.php?i={id}`                       |
| Random drink       | `/random.php`                              |
| List categories    | `/list.php?c=list`                         |
| Filter by category | `/filter.php?c={category}`                 |

## Notes

- Built for a course project on integrating public APIs with Express,
  Axios, and EJS.
- No `.env` or API key needed for this API, so there's no `.env.example`
  here — if you swap in an API that requires a key, add one and load it
  with `dotenv`.
