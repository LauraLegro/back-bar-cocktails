// Local dev entry point. In production on Netlify, netlify/functions/server.js
// requires app.js directly and wraps it as a serverless function instead.
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The Back Bar is open on http://localhost:${PORT}`);
});
