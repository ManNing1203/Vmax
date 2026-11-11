// Starts the backend (server/) and the Expo app (mobile/) together.
// Server logs are prefixed with [server]; Expo keeps the terminal so its
// shortcuts (a = Android, w = web, r = reload) still work.
const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function stop(code) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

const server = spawn(npm, ['run', 'dev'], {
  cwd: path.join(root, 'server'),
  shell: process.platform === 'win32',
  stdio: ['ignore', 'pipe', 'pipe'],
});
children.push(server);
for (const stream of [server.stdout, server.stderr]) {
  stream.on('data', (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) console.log(`[server] ${line}`);
    }
  });
}
server.on('exit', (code) => {
  console.log(`[server] stopped (exit code ${code})`);
});

const mobile = spawn(npm, ['start'], {
  cwd: path.join(root, 'mobile'),
  shell: process.platform === 'win32',
  stdio: 'inherit',
});
children.push(mobile);
mobile.on('exit', (code) => stop(code ?? 0));

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
