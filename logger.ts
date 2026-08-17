class Logger {
  info(msg: string) {
    console.log(`\x1b[36m[INFO]\x1b[0m ${new Date().toISOString()} - ${msg}`);
  }

  warn(msg: string) {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${msg}`);
  }

  error(msg: string) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${msg}`);
  }

  debug(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`\x1b[34m[DEBUG]\x1b[0m ${new Date().toISOString()} - ${msg}`);
    }
  }
}

export default new Logger();
