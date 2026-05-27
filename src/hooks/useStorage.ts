import dayjs from 'dayjs';
import { useCallback } from 'react';
import { MMKV, createMMKV } from 'react-native-mmkv';
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';

import storageKeys from '../configs/storage';
import { makeError } from '../utils/utils';

import RNFS from 'react-native-fs';

const appStorage = createMMKV({ id: 'education.kv' });
const cacheStorage = createMMKV({ id: 'cache.kv' });

// appStorage.getAllKeys().forEach(k => {
//   console.log('mmkv', k, appStorage.getString(k));
// });

// TODO: seperate app data & user data and encrypt user data
// const walletStorage = new MMKV({ id: 'wallet.db', encryptionKey: '' });

// console.log('appStorage', appStorage.getAllKeys());
// console.log('cacheStorage', cacheStorage.getAllKeys());

const base = z.object({
  v: z.number().optional(),
  ts: z.number().optional(),
  exp: z.number().optional(),
});

type StorageKeys = typeof storageKeys;
type Prefix = keyof StorageKeys;
type KeyIdentity<T extends Prefix> = keyof StorageKeys[T];
type KeyIdentityParams<T extends Prefix, R extends KeyIdentity<T>> = StorageKeys[T][R] extends {
  id: (...params: infer P) => any;
}
  ? P
  : never;
type StorageData<T extends Prefix, R extends KeyIdentity<T>> = StorageKeys[T][R] extends z.ZodType
  ? z.infer<StorageKeys[T][R]>
  : StorageKeys[T][R] extends {
        schema: z.ZodType;
      }
    ? z.infer<StorageKeys[T][R]['schema']>
    : never;

/**
 * if storage conf has id function and options.params is undefined, data will not be loaded
 */
function useStorage<T extends Prefix, R extends KeyIdentity<T>>(
  prefix: T,
  key: R,
  options?: {
    params?: KeyIdentityParams<T, R>;
    initValue?: StorageData<T, R>;
  },
) {
  const getConfig = () => {
    const conf = storageKeys[prefix][key] as {
      id?: (...p: any[]) => string | number | Array<string | number>;
      schema: z.ZodType<StorageData<T, R>>;
    };
    let more = options?.params && conf.id?.(...options.params);
    if (conf.id && !more) {
      return;
    }

    more = more || [];
    if (!Array.isArray(more)) {
      more = [more];
    }
    const parts = [prefix, key, ...more];

    return {
      storageKey: parts.join(':'),
      schema: conf.schema || conf,
    };
  };

  const conf = getConfig();
  const storage = prefix === 'cache' ? cacheStorage : appStorage;

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWRImmutable(conf ? [conf.storageKey, 'useStorage'] : null, ([k]) => {
    const str = storage.getString(k);
    const rawData = base
      .extend({ data: conf!.schema })
      .parse(str !== undefined ? JSON.parse(str) : { data: options?.initValue });

    if (rawData.exp && rawData.exp <= dayjs().unix()) {
      setTimeout(() => storage.remove(k));
      rawData.data = undefined;
    } else if (str === undefined && rawData.data) {
      // save the init data
      storage.set(k, JSON.stringify(rawData));
    }

    return rawData;
  });

  error && console.error('useStorage', conf?.storageKey, error);

  type DataGenerator = (prev?: StorageData<T, R>) => StorageData<T, R>;

  /** @param exp: expiry unix timestamp */
  const save = useCallback(
    async (newData: StorageData<T, R> | DataGenerator, exp?: number) => {
      if (!conf) {
        return;
      }

      const now = dayjs().unix();
      if (exp && exp < now) {
        throw new Error('exp should be > now');
      }

      await mutate(
        (prev) => {
          const nextData =
            typeof newData === 'function' ? (newData as DataGenerator)(prev?.data) : newData;
          const raw = {
            v: 1,
            ts: now,
            data: conf.schema.parse(nextData), // validate & strip out unrecognized fields,
            exp,
          };

          storage.set(conf.storageKey, JSON.stringify(raw));

          return raw;
        },
        // { revalidate: false },
      );
    },
    [conf, mutate, storage],
  );

  const remove = () => {
    if (!conf) {
      return;
    }

    storage.remove(conf.storageKey);
    void mutate(undefined, { revalidate: false });
  };

  return [
    {
      data: data?.data,
      error: makeError(error),
      loading: conf ? loading : undefined,
      schema: conf?.schema,
    },
    { save, remove },
  ] as const;
}

export default useStorage;

const MIGARATION_KEY = '_migration_';

const migration = appStorage.getNumber(MIGARATION_KEY);
if (!migration || migration < 1) {
  // clear wallet assets
  appStorage.getAllKeys().forEach((k) => {
    if (k.startsWith('wallet:assets:')) {
      appStorage.remove(k);
    }
  });
  appStorage.set(MIGARATION_KEY, 1);
}

setTimeout(() => {
  cleanup(cacheStorage);
  cleanupImageCacheIfNeeded();
}, 60000);

function cleanup(storage: MMKV) {
  const now = dayjs().unix();
  let count = 0;
  storage.getAllKeys().forEach((k) => {
    try {
      const str = storage.getString(k);
      if (!str) {
        storage.remove(k);
        count++;
        return;
      }
      const { exp, ts } = base.parse(JSON.parse(str));
      if ((exp && exp < now) || !ts || (k.startsWith('cache') && ts < now - 86400)) {
        storage.remove(k);
        count++;
      }
    } catch (e) {
      // If JSON is malformed, delete the key
      console.warn(`Failed to parse storage key ${k}:`, e);
      storage.remove(k);
      count++;
    }
  });
  console.debug(`storage: cleanup ${count} keys`);
}

async function cleanupImageCacheIfNeeded() {
  const KEY = 'cache:image_cleanup_ts';
  const last = cacheStorage.getNumber(KEY);
  const now = dayjs().unix();

  if (!last || now - last > 7 * 86400) {
    try {
      const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
      let count = 0;
      for (const file of files) {
        if (file.isFile() && /\.(jpe?g|png)$/i.test(file.name)) {
          await RNFS.unlink(file.path);
          count++;
        }
      }

      cacheStorage.set(KEY, now);
      console.debug(`[Cache] Deleted ${count} image files from cache`);
    } catch (err) {
      console.warn('[Cache] Error deleting image cache:', err);
    }
  }
}
