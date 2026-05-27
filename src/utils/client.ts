import { showToast } from 'components';
import { omitBy } from 'lodash';
import env from 'configs/env';

export type RequestParams = {
  path: string;
  data?: Record<string, any> | FormData;
  options?: RequestInit;
};

type ErrorHandler = (e: Error) => any;
type APIOptions = {
  baseURL?: string;
  onUnauthorized?: () => void;
};

class Client {
  private baseURL = env.apiUrl;
  private onErrors: Record<symbol, ErrorHandler> = {};
  private onUnauthorized?: () => void;

  constructor(options: APIOptions) {
    if (options.baseURL) {
      this.baseURL = options.baseURL;
    }
    this.onUnauthorized = options.onUnauthorized;
  }

  protected getAdditionHeaders(_path?: string): Record<string, string> {
    return {};
  }

  protected async request<T>({ path = '', data, options }: RequestParams) {
    let url = `${this.baseURL}${path}`;
    const method = options?.method || 'GET';
    const headers = new Headers({ ...this.getAdditionHeaders(), ...options?.headers });

    if (!(data instanceof FormData)) {
      data = data ? omitBy(data, (v) => v === undefined) : data;
    }

    let body: RequestInit['body'];
    if (method === 'POST' || method === 'PUT') {
      if (data) {
        if (data instanceof FormData) {
          body = data;
        } else {
          body = JSON.stringify(Array.isArray(data) ? data : data);
          headers.set('Content-Type', 'application/json');
        }
      }
    } else if (data && !(data instanceof FormData)) {
      const params = new URLSearchParams(data);
      url += `?${params}`;
    }
    const res = await fetch(url, { ...options, headers, body, method });

    let resData: Record<string, unknown> = {};
    try {
      resData = (await res.json()) as Record<string, unknown>;
    } catch {
      resData = {};
    }

    if (!res.ok) {
      const message =
        (typeof resData.message === 'string' && resData.message) ||
        (typeof resData.error === 'string' && resData.error) ||
        `Request failed with status ${res.status}`;

      const err = new Error(message);
      Object.assign(err, {
        code: typeof res.status === 'number' ? res.status : -1,
        detail: typeof resData.error === 'string' ? resData.error : '',
        url,
      });

      // Handle 401 Unauthorized
      if (res.status === 401 && this.onUnauthorized) {
        showToast(
          'error',
          'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục.',
        );
        this.onUnauthorized();
      }

      Object.getOwnPropertySymbols(this.onErrors).forEach((i) => {
        this.onErrors[i]?.(err);
      });

      throw err;
    }

    return resData as T;
  }

  GET<T = any>({ path, data, options }: RequestParams) {
    return this.request<T>({ path, data, options: { ...options, method: 'GET' } });
  }

  POST<T = any>({ path, data, options }: RequestParams) {
    return this.request<T>({ path, data, options: { ...options, method: 'POST' } });
  }

  PUT<T = any>({ path, data, options }: RequestParams) {
    return this.request<T>({ path, data, options: { ...options, method: 'PUT' } });
  }

  DELETE<T = any>({ path, data, options }: RequestParams) {
    return this.request<T>({ path, data, options: { ...options, method: 'DELETE' } });
  }

  onError(handler: (err: Error) => any) {
    const id = Symbol();
    this.onErrors[id] = handler;

    return () => {
      delete this.onErrors[id];
    };
  }
}

export default Client;
