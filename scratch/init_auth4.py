import pty
import os
import sys
import time

def master_read(fd):
    return os.read(fd, 1024)

pid, fd = pty.fork()
if pid == 0:
    # Child process
    os.environ["TERM"] = "xterm-256color"
    if "CI" in os.environ:
        del os.environ["CI"]
    # Exec bash, then run npx inside it
    os.execvp("bash", ["bash", "-c", "npx firebase-tools init auth"])
else:
    # Parent process
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
                time.sleep(2)
                # Send space (select Email/Password)
                os.write(fd, b" ")
                time.sleep(1)
                # Send enter (confirm)
                os.write(fd, b"\r")
                buffer = b""
                
            if b"File auth.yaml already exists" in buffer:
                time.sleep(1)
                os.write(fd, b"y\r")
                buffer = b""
        except OSError:
            break
