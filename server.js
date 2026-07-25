const express = require('express');
const path = require('path');
const cocktailRoutes = require('./routes/cocktails');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS as the view/templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (css)
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

app.listen(PORT, () => {
  console.log(`The Back Bar is open on http://localhost:${PORT}`);
});
