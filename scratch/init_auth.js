const pty = require('node-pty');
const ptyProcess = pty.spawn('npx', ['firebase-tools', 'init', 'auth'], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});

ptyProcess.on('data', function(data) {
  process.stdout.write(data);
  if (data.includes('Which providers would you like to enable?')) {
    // Select Email/Password
    // Usually it's the first one. Let's send Space and then Enter
    setTimeout(() => {
        ptyProcess.write(' \r');
    }, 1000);
  }
});
