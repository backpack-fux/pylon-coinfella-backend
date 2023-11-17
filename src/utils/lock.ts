import AsyncLock from 'async-lock';

let lock: AsyncLock;

export const asyncLock = (resource: string | string[], funcPromise: () => Promise<any>) => {
  if (!lock) {
    lock = new AsyncLock();
  }

  return lock.acquire(resource, funcPromise);
};
