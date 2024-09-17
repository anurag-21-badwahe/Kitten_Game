const cache = new Map();
const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

function getOrSetCache(key, cb) {
  return new Promise(async (resolve, reject) => {
    const now = Date.now();
    
    if (cache.has(key)) {
      const { data, expiration } = cache.get(key);
      if (now < expiration) {
        return resolve(data);
      }
      cache.delete(key);
    }

    try {
      const freshData = await cb();
      cache.set(key, {
        data: freshData,
        expiration: now + DEFAULT_EXPIRATION * 1000
      });
      resolve(freshData);
    } catch (error) {
      reject(error);
    }
  });
}