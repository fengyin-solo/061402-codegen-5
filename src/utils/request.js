// 基于 Fetch 的 HTTP 请求封装

class Request {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = 10000;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
    return this;
  }

  removeToken() {
    delete this.headers.Authorization;
    return this;
  }

  async request(options) {
    const { url, method = 'GET', data, headers } = options;
    
    let fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
    
    const config = {
      method,
      headers: { ...this.headers, ...headers },
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data) {
      if (method === 'GET' || method === 'DELETE') {
        const searchParams = new URLSearchParams(data);
        fullUrl += `?${searchParams.toString()}`;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(fullUrl, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.code !== 200) {
        throw new Error(responseData.message || 'Request failed');
      }

      return responseData;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  get(url, params, headers) {
    return this.request({ url, method: 'GET', data: params, headers });
  }

  post(url, data, headers) {
    return this.request({ url, method: 'POST', data, headers });
  }

  put(url, data, headers) {
    return this.request({ url, method: 'PUT', data, headers });
  }

  delete(url, params, headers) {
    return this.request({ url, method: 'DELETE', data: params, headers });
  }
}

const request = new Request(import.meta.env.VITE_API_BASE_URL || '/api');

export default request;