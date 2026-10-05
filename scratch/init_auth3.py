import pty
import os
import sys
import time
import subprocess

pid, fd = pty.fork()
if pid == 0:
    if "CI" in os.environ:
        del os.environ["CI"]
    if "NONINTERACTIVE" in os.environ:
        del os.environ["NONINTERACTIVE"]
    os.environ["FORCE_COLOR"] = "1"
    os.environ["IS_TTY"] = "true"
    os.execvp("npx", ["npx", "firebase-tools", "init", "auth"])
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
