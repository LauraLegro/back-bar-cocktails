import axios from 'axios';

// TheCocktailDB's free test tier (key "1") - no signup, no auth header,
// and CORS-enabled. Docs: https://www.thecocktaildb.com/api.php
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// The API returns each drink's ingredients/measures as up to 15 numbered
// fields (strIngredient1..strIngredient15, strMeasure1..strMeasure15)
// instead of an array, and pads the unused ones with null. This walks
// those fields and returns a clean, render-ready list.
function extractIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i += 1) {
    const ingredient = drink[`strIngredient${i}`];
    if (!ingredient || !ingredient.trim()) continue;
    const measure = drink[`strMeasure${i}`];
    ingredients.push({
      ingredient: ingredient.trim(),
      measure: measure ? measure.trim() : '',
    });
  }
  return ingredients;
}

// Search drinks by name, e.g. "margarita"
async function searchByName(name) {
  const { data } = await client.get('/search.php', { params: { s: name } });
  return data.drinks || [];
}

// Full recipe detail for a single drink by its CocktailDB id
async function lookupById(id) {
  const { data } = await client.get('/lookup.php', { params: { i: id } });
  return data.drinks ? data.drinks[0] : null;
}

// One random drink, full detail
async function getRandom() {
  const { data } = await client.get('/random.php');
  return data.drinks ? data.drinks[0] : null;
}

// The full list of drink categories (Cocktail, Shot, Ordinary Drink, ...)
// used to build the "browse the shelf" chips on the homepage
async function listCategories() {
  const { data } = await client.get('/list.php', { params: { c: 'list' } });
  return (data.drinks || []).map((entry) => entry.strCategory);
}

// Drinks in a given category. Note: this endpoint only returns
// id/name/thumbnail, not the full recipe - callers still need
// lookupById() for ingredients and instructions.
async function filterByCategory(category) {
  const { data } = await client.get('/filter.php', { params: { c: category } });
  return data.drinks || [];
}

export default {
  extractIngredients,
  searchByName,
  lookupById,
  getRandom,
  listCategories,
  filterByCategory,
};
