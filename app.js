const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cocktailRoutes = require('./routes/cocktails');

const app = express();

// EJS as the view/templating engine. Registered with an explicit require
// (rather than letting Express dynamically require('ejs') by name) so
// Netlify's function bundler can trace the dependency and package it -
// bundlers that only statically analyze require()/import calls otherwise
// miss it entirely, since Express's default lookup happens at render time.
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (css). In production (Netlify) these are served
// directly by the CDN from the publish directory - this middleware
// only matters when running the app locally via `node server.js`.
app.use(express.static(path.join(__dirname, 'public')));

// All pages live behind this router
app.use('/', cocktailRoutes);

// 404 - reached when nothing above matched the request
app.use((req, res) => {
  res.status(404).render('error', {
    title: "86'd",
    message: "There's no page behind this bar by that name.",
    backHref: '/',
  });
});

// Centralized error handler - any route that calls next(err) (e.g. a
// failed Axios request to TheCocktailDB) ends up here instead of
// crashing the app or leaking a stack trace to the user.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: "86'd",
    message: 'Something spilled on our end. Give it another go in a moment.',
    backHref: '/',
  });
});

module.exports = app;
