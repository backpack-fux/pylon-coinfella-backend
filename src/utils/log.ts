import * as bunyan from 'bunyan';

export const log = bunyan.createLogger({
  name: 'NDJ-CHECKOUT',
  serializers: {
    err: bunyan.stdSerializers.err,
  },
});