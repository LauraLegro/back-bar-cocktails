// Wraps the whole Express app as a single Netlify Function so every
// route (search, category, random, cocktail detail) is handled by the
// same app that runs locally - see netlify.toml for the catch-all
// redirect that routes requests here.
import serverless from 'serverless-http';
import app from '../../app.js';

export const handler = serverless(app);
