import type { Server } from 'http';

export function createShutdown(server: Pick<Server, 'close' | 'closeIdleConnections' | 'closeAllConnections'>, destroy: () => Promise<void>, exit: (code: number) => void) {
  let started = false;
  let forced = false;
  let exited = false;
  let cleanup: Promise<void> | undefined;
  const destroyOnce = () => cleanup ??= Promise.resolve().then(destroy);
  return () => {
    if (started) return;
    started = true;
    const finish = (code: number) => {
      if (exited) return;
      exited = true;
      clearTimeout(forceTimer);
      clearTimeout(hardTimer);
      exit(code);
    };
    const complete = async () => {
      try { await destroyOnce(); finish(forced ? 1 : 0); }
      catch { finish(1); }
    };
    // Keep this timer referenced so pending cleanup cannot silently end the process.
    const hardTimer = setTimeout(() => finish(1), 15000);
    const forceTimer = setTimeout(() => {
      forced = true;
      server.closeAllConnections?.();
      void complete();
    }, 10000);
    server.close(() => { clearTimeout(forceTimer); void complete(); });
    server.closeIdleConnections?.();
  };
}
