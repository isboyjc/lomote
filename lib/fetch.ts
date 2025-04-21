import { toast } from 'react-hot-toast';
import { ApiResponse, PaginatedResponse } from '@/lib/server/types';

interface RequestOptions extends RequestInit {
  // 请求超时时间（毫秒）
  timeout?: number;
  // 自定义请求头
  customHeaders?: Record<string, string>;
  // 是否显示错误提示
  showErrorToast?: boolean;
  // 是否带上认证信息
  withAuth?: boolean;
  // 请求携带的数据
  data?: Record<string, any> | FormData;
  // 是否允许重复请求
  allowDuplicate?: boolean;
  // 请求标识符（用于区分相同URL的不同请求）
  requestId?: string;
}

// 错误类型
export class ApiError extends Error {
  public code: number;
  public success: boolean;
  public data: any;
  public timestamp: number;
  public errorCode?: string;
  public errorDetail?: any;
  
  constructor(message: string, code: number = 500, data?: any, errorCode?: string, errorDetail?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.success = false;
    this.data = data;
    this.timestamp = Date.now();
    this.errorCode = errorCode;
    this.errorDetail = errorDetail;
  }
}

// 默认配置
const DEFAULT_OPTIONS: RequestOptions = {
  timeout: 10000,
  showErrorToast: true,
  withAuth: true,
  allowDuplicate: false,
};

// 基础请求URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 用于存储正在进行的请求
const pendingRequests = new Map<string, Promise<ApiResponse<any>>>();

// 生成请求的唯一标识
function getRequestKey(url: string, method: string = 'GET', requestId?: string): string {
  return `${method}:${url}${requestId ? `:${requestId}` : ''}`;
}

// 清除已完成的请求
function removePendingRequest(key: string): void {
  setTimeout(() => {
    pendingRequests.delete(key);
  }, 0);
}

/**
 * 通用请求方法
 * @param url 请求路径
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  // 合并默认选项
  const mergedOptions: RequestOptions = { ...DEFAULT_OPTIONS, ...options };
  const { 
    timeout, 
    customHeaders, 
    showErrorToast, 
    withAuth, 
    data, 
    allowDuplicate,
    requestId,
    ...fetchOptions 
  } = mergedOptions;
  
  // 构建完整URL
  const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
  const fullUrl = isAbsoluteUrl ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // 检查是否有相同的请求正在进行
  const method = fetchOptions.method || 'GET';
  const requestKey = getRequestKey(fullUrl, method, requestId);
  
  if (!allowDuplicate && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey) as Promise<ApiResponse<T>>;
  }
  
  // 构建请求头
  const headers = new Headers(fetchOptions.headers);
  
  // 设置内容类型
  if (!headers.has('Content-Type') && !(data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // 设置接受类型
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  
  // 添加认证信息
  // if (withAuth && typeof window !== 'undefined') {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     headers.set('Authorization', `Bearer ${token}`);
  //   }
  // }
  
  // 添加自定义请求头
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
  
  // 处理请求体
  let body: any = undefined;
  if (data) {
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
    }
  }
  
  // 创建请求配置
  const config: RequestInit = {
    ...fetchOptions,
    headers,
    body,
  };
  
  // 创建请求Promise
  const requestPromise = (async () => {
    try {
      // 创建超时Promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new ApiError('Request timeout', 408));
        }, timeout);
      });
      
      // 竞争Promise，处理超时
      const response = await Promise.race([
        fetch(fullUrl, config),
        timeoutPromise
      ]);
      
      // 获取响应体
      let result: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        // 对于非JSON响应，创建一个标准格式的响应对象
        const rawData = await response.text();
        result = {
          success: response.ok,
          data: rawData as unknown as T,
          error: response.ok ? undefined : response.statusText
        };
      }
      
      // 检查HTTP状态码
      if (!response.ok) {
        throw new ApiError(
          result.message || `Request failed: ${response.status}`,
          result.code || response.status,
          result.data,
          result.errorCode,
          result.errorDetail
        );
      }
      
      // 返回响应结果
      return result as ApiResponse<T>;
    } catch (error) {
      // 处理错误
      const apiError = error instanceof ApiError
        ? error
        : new ApiError(
            error instanceof Error ? error.message : 'Network request error',
            500
          );
      
      // 显示错误提示
      if (showErrorToast) {
        toast.error(apiError.message);
      }
      
      // 抛出错误，让调用者可以捕获
      throw apiError;
    } finally {
      // 清除已完成的请求
      removePendingRequest(requestKey);
    }
  })();
  
  // 存储请求Promise
  if (!allowDuplicate) {
    pendingRequests.set(requestKey, requestPromise);
  }
  
  return requestPromise;
}

/**
 * 取消所有正在进行的请求
 */
export function cancelAllRequests(): void {
  pendingRequests.clear();
}

/**
 * GET请求
 */
export function get<T = any>(
  url: string, 
  data?: Record<string, any>,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  // 如果传入data参数，将其转换为查询参数
  if (data && Object.keys(data).length > 0) {
    const queryParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    // 如果URL已经包含查询参数，则使用&连接，否则使用?开头
    url = url + (url.includes('?') ? '&' : '?') + queryParams.toString();
  }
  
  return request<T>(url, { ...options, method: 'GET' });
}

/**
 * POST请求
 */
export function post<T = any>(
  url: string, 
  data?: Record<string, any> | FormData, 
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'POST', data });
}

/**
 * PUT请求
 */
export function put<T = any>(
  url: string, 
  data?: Record<string, any> | FormData, 
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PUT', data });
}

/**
 * DELETE请求
 */
export function del<T = any>(
  url: string, 
  data?: Record<string, any>, 
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  // 如果传入data参数，将其转换为查询参数
  if (data && Object.keys(data).length > 0) {
    const queryParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    // 如果URL已经包含查询参数，则使用&连接，否则使用?开头
    url = url + (url.includes('?') ? '&' : '?') + queryParams.toString();
  }
  
  return request<T>(url, { ...options, method: 'DELETE' });
}

/**
 * PATCH请求
 */
export function patch<T = any>(
  url: string, 
  data?: Record<string, any> | FormData, 
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PATCH', data });
}

// 导出默认方法
export default {
  request,
  get,
  post,
  put,
  delete: del,
  patch,
  cancelAllRequests
};
