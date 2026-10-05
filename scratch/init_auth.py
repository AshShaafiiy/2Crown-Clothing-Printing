import pty
import os
import sys
import time

def read(fd):
    data = os.read(fd, 1024)
    sys.stdout.write(data.decode('utf-8'))
    return data

pid, fd = pty.fork()
if pid == 0:
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
                # Send Space (to select Email/Password), then Enter
                time.sleep(1)
                os.write(fd, b" \r")
                buffer = b"" # Reset buffer to not send it again
        except OSError:
            break
