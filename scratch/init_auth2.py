import pty
import os
import sys
import time

pid, fd = pty.fork()
if pid == 0:
    if "CI" in os.environ:
        del os.environ["CI"]
    os.environ["FORCE_COLOR"] = "1"
    # Ensure npx is executed as a login shell or with a TTY
    os.execvp("node", ["node", "./node_modules/.bin/firebase", "init", "auth"])
else:
    buffer = b""
    while True:
        try:
            data = os.read(fd, 1024)
            if not data:
                break
            sys.stdout.write(data.decode('utf-8', errors='replace'))
            sys.stdout.flush()
            buffer += data
            if b"Which providers would you like to enable?" in buffer:
                time.sleep(1)
                os.write(fd, b" \r")
                buffer = b"" 
        except OSError:
            break
