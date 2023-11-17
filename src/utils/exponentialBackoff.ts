import * as moment from 'moment-timezone';
import * as retry from 'retry';

import { log } from '.';

type ExponentialBackOffOptions = {
  // The maximum amount of times to retry the operation. Default is 10. Seting this to 1 means do it once, then retry it once.
  retries?: number;
  // The exponential factor to use. Default is 2.
  factor?: number;
  // The number of milliseconds before starting the first retry. Default is 1000.
  minTimeout?: number;
  // The maximum number of milliseconds between two retries. Default is Infinity.
  maxTimeout?: number;
  // Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
  randomize?: boolean;

  // Custom options to catch error
  retryErrorKey?: string;
  retryErrorValue?: string[];
  // The maximum number of milliseconds to stop retry. If defined, retries param is ignored. Default is null.
  retryTimeout?: number;
};

type ExponentialBackOffResponse<T> = {
  attempts: number;
  result: T;
};

export const exponentialBackOff = async <T>(
  funcPromise: () => Promise<T>,
  options: ExponentialBackOffOptions = {
    factor: 1,
    retries: 5,
    retryErrorKey: 'message',
    retryErrorValue: [
      'nonce too low',
      'request failed or timed out', // from getTransactionReceipt
      'Request failed with status code', // from executeMetaTransaction
      'socket hang up', // from updateChickens
      'connect ETIMEDOUT', // from updateChickens
      'Your app has exceeded', // alchemy rate limit
      '504 Gateway Time-out', // from contract races func
      'ECONNRESET', // from getTransactionReceipt
      'Invalid JSON RPC response', // from contract calls
      'aborted', // alchemy getOwnersForCollection
    ],
    retryTimeout: null,
  },
): Promise<ExponentialBackOffResponse<T>> => {
  const {
    retryErrorKey, retryErrorValue, retryTimeout, ...retryOptions
  } = options;

  const retryOperation = retry.operation(retryOptions || {});
  const startTime = moment.utc();

  return new Promise((resolve, reject) => {
    retryOperation.attempt(async (currentAttempt) => {
      let result = null;
      let lastError: any = null;

      try {
        result = await funcPromise();
      } catch (err) {
        lastError = err;

        const isRetryErrorMismatch = retryErrorKey
          && retryErrorValue
          && !retryErrorValue.find(
            (value) => lastError[retryErrorKey] === value
              || (lastError[retryErrorKey]?.includes
                && lastError[retryErrorKey].toLowerCase()?.includes(value.toLowerCase())),
          );
        const isRetryTimeout = retryTimeout
          && moment
            .utc()
            .isAfter(startTime.clone().add(retryTimeout, 'milliseconds'));

        log.info({
          func: 'exponentialBackOff',
          isRetryErrorMismatch,
          isRetryTimeout,
          currentAttempt,
          retryErrorKey,
          retryErrorValue,
          lastError,
          retryFunc: funcPromise.name,
        }, 'exponentialBackOff');

        if (isRetryErrorMismatch || isRetryTimeout) {
          retryOperation.stop();

          reject(lastError);
          return;
        }

        if (retryOperation.retry(lastError)) {
          return;
        }
      }

      if (lastError) {
        reject(retryOperation.mainError());
        return;
      }

      resolve({
        attempts: currentAttempt,
        result,
      });
    });
  });
};
