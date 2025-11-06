#!/usr/bin/env node
// Simple helper to start Expo on a free port without interactive prompts.
// Usage:
//   npm run dev        # native/web dev tools
//   npm run dev:web    # web-only

const net = require('net');
const http = require('http');
const https = require('https');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const webOnly = args.includes('--web') || process.env.EXPO_WEB === '1';
const checksOnly = args.includes('--check') || process.env.DEV_CHECK_ONLY === '1';

const startFrom = Number(process.env.RCT_METRO_PORT || 8081);

async function findFreePort(from) {
  function tryPort(port) {
    return new Promise((resolve) => {
      const srv = net.createServer();
      srv.once('error', () => resolve(false));
      srv.once('listening', () => srv.close(() => resolve(true)));
      srv.listen(port, '0.0.0.0');
    });
  }
  let port = from;
  // Try up to 50 ports
  for (let i = 0; i < 50; i++) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await tryPort(port);
    if (ok) return port;
    port++;
  }
  throw new Error('Could not find a free port near ' + from);
}

(async () => {
  try {
    const port = await findFreePort(startFrom);
    // Ensure non-interactive var won't block us
    delete process.env.EXPO_NO_INTERACTIVE;
    process.env.RCT_METRO_PORT = String(port);

    // Determine API base to sanity-check reachability
    const WEB_BASE = process.env.EXPO_PUBLIC_API_WEB_BASE_URL || 'http://127.0.0.1:8000/api';
    const NATIVE_BASE = process.env.EXPO_PUBLIC_API_NATIVE_BASE_URL || 'http://192.168.1.47:8000/api';
    const apiBase = webOnly ? WEB_BASE : NATIVE_BASE;

    // Lightweight health check (does not block startup)
    await (async function checkApi(base) {
      try {
        const u = new URL(base);
        const isHttps = u.protocol === 'https:';
        const mod = isHttps ? https : http;

        const TEST_TOKEN = process.env.EXPO_PUBLIC_TEST_TOKEN;
        const commonHeaders = { Accept: 'application/json' };
        const authHeaders = TEST_TOKEN ? { ...commonHeaders, Authorization: `Bearer ${TEST_TOKEN}` } : commonHeaders;

        async function pingPath(path, opts = {}) {
          const url = new URL(base);
          // Normalize base path and append
          const clean = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
          url.pathname = `${clean}${path.startsWith('/') ? path : `/${path}`}`;
          const headers = opts.auth ? authHeaders : commonHeaders;
          await new Promise((resolve) => {
            const req = mod.request({
              method: 'GET',
              host: url.hostname,
              port: url.port || (isHttps ? 443 : 80),
              path: url.pathname + (url.search || ''),
              timeout: 3000,
              headers,
            }, (res) => {
              const ok = res.statusCode && res.statusCode < 500;
              if (!ok) {
                console.warn(`[dev] ${url.pathname} -> ${res.statusCode}. ${opts.note || ''}`.trim());
              } else if (res.statusCode >= 400) {
                console.warn(`[dev] ${url.pathname} -> ${res.statusCode}. ${opts.note || ''}`.trim());
              }
              res.resume();
              resolve();
            });
            req.on('error', () => {
              console.warn(`[dev] Could not reach ${url.href}. ${opts.note || ''}`.trim());
              resolve();
            });
            req.on('timeout', () => { req.destroy(new Error('timeout')); });
            req.end();
          });
        }

        // Base root
        await new Promise((resolve) => {
          const req = mod.request({
            method: 'GET',
            host: u.hostname,
            port: u.port || (isHttps ? 443 : 80),
            path: u.pathname || '/',
            timeout: 3000,
            headers: commonHeaders,
          }, (res) => {
            const ok = res.statusCode && res.statusCode < 500;
            if (!ok) console.warn(`[dev] API responded with status ${res.statusCode} at ${base}`);
            res.resume();
            resolve();
          });
          req.on('error', () => { console.warn(`[dev] Could not reach API at ${base}.`); resolve(); });
          req.on('timeout', () => { req.destroy(new Error('timeout')); });
          req.end();
        });

        // Endpoints used by the app (best-effort checks)
        const endpoints = [
          { path: '/markers', note: 'Map markers' },
          { path: '/posts', note: 'Feed posts (may require auth)', auth: true },
          { path: '/user', note: 'Current user (requires auth)', auth: true },
          { path: '/comments?post_id=1', note: 'Comments sample (may require auth and a valid post_id)', auth: true },
        ];
        // Run sequentially to keep logs readable
        for (const ep of endpoints) {
          // eslint-disable-next-line no-await-in-loop
          await pingPath(ep.path, { note: ep.note, auth: ep.auth });
        }
      } catch (e) {
        console.warn(`[dev] Could not reach API at ${base}. Is your backend running and accessible?`);
      }
    })(apiBase);

    if (checksOnly) {
      console.log('[dev] Checks completed. Skipping Expo start due to --check flag.');
      process.exit(0);
    }

    const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const expoArgs = ['expo', 'start', '-c', '--port', String(port)];
    if (webOnly) expoArgs.splice(2, 0, '--web');

    console.log(`Starting Expo on port ${port} ${webOnly ? '(web only)' : ''}...`);
    const child = spawn(bin, expoArgs, { stdio: 'inherit', env: process.env });
    child.on('exit', (code) => process.exit(code ?? 0));
  } catch (e) {
    console.error('[dev] ' + e.message);
    process.exit(1);
  }
})();
