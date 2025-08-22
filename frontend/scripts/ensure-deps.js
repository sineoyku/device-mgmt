const { existsSync } = require('fs');
const { spawnSync } = require('child_process');

const has = (p) => { try { return existsSync(p); } catch { return false; } };

const needInstall =
  !has('node_modules/.bin/next') ||
  !has('node_modules/react') ||
  !has('node_modules/react-dom');

if (!needInstall) process.exit(0);

const useCi = has('package-lock.json');
const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = [useCi ? 'ci' : 'install'];

console.log(`🧰 Installing dependencies: ${cmd} ${args.join(' ')} …`);
const res = spawnSync(cmd, args, { stdio: 'inherit' });
process.exit(res.status ?? 0);
