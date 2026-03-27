// Waits for any Vite dev port (5173-5180) then launches Electron
import { createConnection } from 'net';
import { spawn } from 'child_process';

const PORTS = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180];
const TIMEOUT = 30000;
const POLL_INTERVAL = 300;

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = createConnection(port, '127.0.0.1');
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.setTimeout(200, () => { socket.destroy(); resolve(false); });
  });
}

async function waitForVite() {
  const deadline = Date.now() + TIMEOUT;
  while (Date.now() < deadline) {
    for (const port of PORTS) {
      if (await checkPort(port)) return port;
    }
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
  return null;
}

const port = await waitForVite();
if (!port) {
  console.error('[start-electron] Timed out waiting for Vite');
  process.exit(1);
}

console.log(`[start-electron] Vite on port ${port}, launching Electron...`);

// Pass port to Electron via env
const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['electron', '.'],
  {
    stdio: 'inherit',
    env: { ...process.env, VITE_DEV_PORT: String(port) },
  }
);

child.on('exit', (code) => process.exit(code ?? 0));
