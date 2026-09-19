const { spawn } = require('child_process');

const run = (cmd, args, prefix) => {
  const child = spawn(cmd, args, { stdio: 'pipe', shell: true });
  child.stdout.on('data', data => process.stdout.write(`[${prefix}] ${data}`));
  child.stderr.on('data', data => process.stderr.write(`[${prefix}] ${data}`));
  child.on('close', code => console.log(`[${prefix}] exited with code ${code}`));
  return child;
};

const frontend = run('npm', ['run', 'dev:frontend'], 'VITE');
const backend = run('npm', ['run', 'dev:backend'], 'EXPRESS');

process.on('SIGINT', () => {
  frontend.kill('SIGINT');
  backend.kill('SIGINT');
  process.exit();
});
