const express = require('express');
const cocktailApi = require('../services/cocktailApi');

const router = express.Router();

// Home page: search box, "random pour" button, and a shelf of categories
// to browse. Categories are fetched live so the shelf never goes stale,
// but the page still has to work if that one call fails.
router.get('/', async (req, res) => {
  try {
    const categories = await cocktailApi.listCategories();
    res.render('index', { categories, shelfError: null });
  } catch (err) {
    console.error('Failed to load categories:', err.message);
    res.render('index', {
      categories: [],
      shelfError: "The shelf's out of view right now, but search still works.",
    });
  }
});

// Search results by drink name (?q=margarita)
router.get('/search', async (req, res, next) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.redirect('/');

  try {
    const drinks = await cocktailApi.searchByName(query);
    res.render('results', { heading: `Results for "${query}"`, drinks });
  } catch (err) {
    next(err);
  }
});

// Browse by category, e.g. /category/Cocktail (from the homepage shelf)
router.get('/category/:name', async (req, res, next) => {
  try {
    const drinks = await cocktailApi.filterByCategory(req.params.name);
    res.render('results', { heading: req.params.name, drinks });
  } catch (err) {
    next(err);
  }
});

// A random drink. Redirects into the shared detail route rather than
// rendering directly, so the resulting URL is bookmarkable/shareable.
router.get('/random', async (req, res, next) => {
  try {
    const drink = await cocktailApi.getRandom();
    if (!drink) {
      return res.status(502).render('error', {
        title: "86'd",
        message: 'The bar came back empty-handed. Try pouring again.',
        backHref: '/',
      });
    }
    res.redirect(`/cocktail/${drink.idDrink}`);
  } catch (err) {
    next(err);
  }
});

// Full recipe detail for one drink
router.get('/cocktail/:id', async (req, res, next) => {
  try {
    const drink = await cocktailApi.lookupById(req.params.id);
    if (!drink) {
      return res.status(404).render('error', {
        title: "86'd",
        message: "We're out of that one - it's not on the menu.",
        backHref: '/',
      });
    }
    const ingredients = cocktailApi.extractIngredients(drink);
    res.render('cocktail', { drink, ingredients });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
