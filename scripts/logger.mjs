// import toast  from 'react-hot-toast';

// import { Console } from 'node:console'; 

const
  levels = 'trace debug info warn error fatal'.split(/\s/),
  [trace, debug, info, warn, error, fatal] = levels.map((_, i) => i),
  
  GLOBAL_OPTIONS = {
    auth: { level: error },
    color: {level:0, obj: new console({stdout: process.stdout, colorMode :true}) }
    // db: {obj: {log(...params)() } }
    // toast : { obj:{log:toast, ...toast}}
  };





class Channel {
  constructor({ level=2 , obj=console }={}) {
    // console.log('Channel constructor',{ level , obj });
    levels.map((_, i) => {
      if (i < level) return () => { };
      let x = i;
      while (!(levels[x] in obj) && --x in levels) {/* empty */ }
      if (x in levels) {
        return obj[levels[x]];
      } else if ('log' in obj) {
        return obj.log;
      }
      throw new Error('the log method must exist in obj');
    }).map((f, i) => this[levels[i]] = f);
  }
}


class Logger {
  #channelsCache = new Map();
  static #self;
  constructor(options={}) {
    if (!Logger.#self)
      Logger.#self = new Proxy(this, {
        get(target, prop) {
          // console.log('get', prop);
          return target.getKey(prop);
        }
      });
    for (const key in options)
      this.#channelsCache.set(key, new Channel(options[key]));
    return Logger.#self;
  }

  getKey(key) {
    if (!this.#channelsCache.has(key))
      this.#channelsCache.set(key, new Channel);
    return this.#channelsCache.get(key);
  }
}

const log = new Logger(GLOBAL_OPTIONS);

export default log;



log.auth.error('log.auth.info');
log.api.error('log.api.debug');

for (const m of levels){
  log.color[m](`log.color.${m}`);
}
