// Local dev entry point. In production on Netlify, netlify/functions/server.js
// imports app.js directly and wraps it as a serverless function instead.
import { spawn } from 'node:child_process';
import app from './app.js';

const PORT = process.env.PORT || 3000;

function openInBrowser(url) {
  if (process.env.CI || process.env.OPEN_BROWSER === '0') return;

  let child;
  if (process.platform === 'darwin') {
    child = spawn('open', [url], { detached: true, stdio: 'ignore' });
  } else if (process.platform === 'win32') {
    child = spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' });
  } else {
    child = spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
  }

  child.on('error', () => {
    console.error(`Could not open a browser tab automatically. Open this URL: ${url}`);
  });

  child.unref();
}

const server = app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`The Back Bar is open on ${url}`);
  openInBrowser(url);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process (lsof -ti :${PORT} | xargs kill) or run on another port (PORT=4000 npm run dev).`
    );
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
