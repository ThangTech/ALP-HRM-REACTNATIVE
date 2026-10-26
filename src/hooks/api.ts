import i18next from 'i18next';
import { useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import useSWR, { unstable_serialize, type SWRConfiguration } from 'swr';
import useSWRSubscription from 'swr/subscription';

import { Client, omitEmpty, RequestParams } from 'utils';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const UNAUTHORIZED_ERROR_CODE = 2;

const KEYCHAIN_QMS_TOKEN = 'qms.token';

let clientVersion = '';

// Singleton to manage app state
export class AppStateManager {
  private static instance: AppStateManager;
  private onUnauthorizedCallbacks: (() => void)[] = [];

  private constructor() {}

  static getInstance() {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  onUnauthorized(callback: () => void) {
    this.onUnauthorizedCallbacks.push(callback);
    return () => {
      this.onUnauthorizedCallbacks = this.onUnauthorizedCallbacks.filter((cb) => cb !== callback);
    };
  }

  handleUnauthorized() {
    this.onUnauthorizedCallbacks.forEach((callback) => callback());
  }
}

class API extends Client {
  private static instance?: API;

  private token = '';
  private tokenChangeCallbacks: Record<symbol, () => void> = {};
  // Flag ngăn ready() khôi phục token từ Keychain sau khi logout
  private isLoggedOut = false;

  static getInstance() {
    if (!API.instance) {
      API.instance = new API();
    }

    return API.instance;
  }

  private constructor() {
    super({
      baseURL: '',
      onUnauthorized: () => {
        // Chỉ xử lý logout khi đang có token (user đang trong phiên đăng nhập)
        // Nếu token rỗng = user chưa đăng nhập, 401 chỉ là lỗi sai mật khẩu thông thường
        if (!this.token) return;

        this.isLoggedOut = true; // Chặn ready() ngay lập tức (sync)
        // Clear token
        this.token = '';
        Keychain.resetGenericPassword({ service: KEYCHAIN_QMS_TOKEN }).catch(console.error);

        // Notify app state manager
        AppStateManager.getInstance().handleUnauthorized();
      },
    });

    void this.ready();
  }

  private async ready() {
    // Nếu đã logout, không đọc lại token từ Keychain (tránh race condition)
    if (this.isLoggedOut) return true;

    try {
      if (this.token) {
        return true;
      }

      const data = await Keychain.getGenericPassword({
        service: KEYCHAIN_QMS_TOKEN,
      });
      if (data) {
        this.token = data.password;
      }
    } catch (error) {
      console.error('KC: read token', error);
    }

    return true;
  }

  /**
   * @override
   */
  protected getAdditionHeaders() {
    return omitEmpty({
      Authorization: this.token ? `Bearer ${this.token}` : undefined,
      'X-Client-Lang': i18next.language,
      'X-Client-Version': clientVersion,
    });
  }

  protected async request<T>(params: RequestParams): Promise<T> {
    await this.ready();

    return super.request(params);
  }

  getToken() {
    return this.token;
  }

  async setToken(token: string) {
    this.token = token;
    this.isLoggedOut = false; // Cho phép gọi API trở lại sau khi đăng nhập
    const ok = await Keychain.setGenericPassword('token', token, {
      service: KEYCHAIN_QMS_TOKEN,
      storage: Keychain.STORAGE_TYPE.AES_GCM, // .FB not exists
    }).catch((e) => {
      console.error('KC: save token', e);
      Keychain.resetGenericPassword({ service: KEYCHAIN_QMS_TOKEN }).catch(console.error);
    });

    if (ok) {
      Object.getOwnPropertySymbols(this.tokenChangeCallbacks).forEach((k) =>
        this.tokenChangeCallbacks[k]?.(),
      );
    }
  }

  onTokenChange(callback: () => void, key?: string) {
    const id = key ? Symbol.for(key) : Symbol();
    this.tokenChangeCallbacks[id] = callback;

    return () => {
      delete this.tokenChangeCallbacks[id];
    };
  }
}

const api = API.getInstance();

export function useAPI<T>(
  path?: string | null | false,
  data?: RequestParams['data'],
  options?: RequestParams['options'] & { method?: Method },
  swrOptions?: SWRConfiguration,
) {
  const method = options?.method || 'GET';
  const key = path ? [{ path, data, options }, 'useAPI'] : null;
  const res = useSWR<T, Error>(key, async ([p]: [RequestParams]) => api[method](p), {
    revalidateOnFocus: true,
    revalidateIfStale: false,
    errorRetryCount: 1,
    errorRetryInterval: 10000,
    revalidateOnReconnect: true,
    ...swrOptions,
  });

  const kid = path ? `${path}__${unstable_serialize({ data, options })}` : '';

  useEffect(() => {
    if (!kid) {
      return;
    }

    // TODO: should we return unregister func?
    api.onTokenChange(() => res.mutate().catch(console.log), kid);
  }, [kid, res]);

  return {
    get data() {
      return res.data;
    },
    get error() {
      return res.error;
    },
    get loading() {
      return res.isLoading;
    },
    get validating() {
      return res.isValidating;
    },
    get mutate() {
      return res.mutate;
    },
    key,
  } as const;
}

export default api;

/**
 * @deprecated import and use api directly
 */
export const useAPIFetcher = () => api;

export function useAPISubscription<T>(
  path?: string | null | false,
  _next?: (
    prevParams?: RequestParams['data'],
    prevData?: T,
    newData?: T,
  ) => { nextParams: RequestParams['data']; nextData?: T },
  options?: RequestParams['options'],
) {
  const data = useSWRSubscription<T, Error, string | null>(path || null, (k, { next }) => {
    let controller: AbortController | undefined = new AbortController();
    const { nextParams: initParams } = _next?.() || {};
    const sub = async (params = initParams) => {
      if (!controller) {
        return;
      }

      const res = await api
        .GET<T>({
          path: k,
          data: params,
          options: { ...options, signal: controller.signal },
        })
        .catch(console.log);
      if (res) {
        next(null, (prev) => {
          const { nextParams, nextData } = _next?.(params, prev, res) || {};
          void sub(nextParams);

          return nextData;
        });
      }
    };

    void sub();

    return () => {
      controller?.abort();
      controller = undefined;
    };
  });

  return data;
}
