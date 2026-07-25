// Wraps the whole Express app as a single Netlify Function so every
// route (search, category, random, cocktail detail) is handled by the
// same app that runs locally - see netlify.toml for the catch-all
// redirect that routes requests here.
const serverless = require('serverless-http');
const app = require('../../app');

module.exports.handler = serverless(app);
