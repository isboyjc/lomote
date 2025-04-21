import { NextRequest, NextResponse } from 'next/server';
import { ApiMiddleware, ApiHandler } from '../types';
// import { corsMiddleware } from './network';
import { loggerMiddleware, performanceMiddleware } from './logger';
import { errorHandlerMiddleware } from './error';
import { rateLimitMiddleware } from './network';

/**
 * 组合多个中间件
 * @param middlewares 要组合的中间件列表
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function withMiddleware(
  middlewares: ApiMiddleware[],
  handler: ApiHandler
): ApiHandler {
  return async function(req: NextRequest): Promise<NextResponse> {
    // 创建中间件链
    const executeMiddleware = async (index: number): Promise<NextResponse> => {
      if (index >= middlewares.length) {
        return handler(req);
      }
      
      const nextMiddleware = () => executeMiddleware(index + 1);
      return middlewares[index](req, nextMiddleware);
    };
    
    // 开始执行中间件链
    return executeMiddleware(0);
  };
}

/**
 * 常用中间件组合
 * 适用于不需要认证的标准API
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function withApiHandler(
  handler: ApiHandler
): ApiHandler {
  return withMiddleware([
    loggerMiddleware,
    errorHandlerMiddleware
  ], handler);
}

/**
 * 带速率限制的API中间件组合
 * 适用于需要限制访问频率的API
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function withRateLimitedApiHandler(
  handler: ApiHandler
): ApiHandler {
  return withMiddleware([
    loggerMiddleware, 
    rateLimitMiddleware,
    errorHandlerMiddleware
  ], handler);
}

/**
 * 带性能监控的API中间件组合
 * 适用于需要监控性能的API
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function withPerformanceApiHandler(
  handler: ApiHandler
): ApiHandler {
  return withMiddleware([
    loggerMiddleware,
    performanceMiddleware, 
    errorHandlerMiddleware
  ], handler);
}