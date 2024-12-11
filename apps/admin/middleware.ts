import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // 获取当前域名
  const url = req.nextUrl.clone();

  // 获取 cookies 中的 token
  const token = req.cookies.get('token');

  // 如果没有 token, 并且 访问的不是登录页面，重定向到登录页面
  if (!token && url.pathname !== '/login') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 如果 token 存在 并且 访问的是登录页面，重定向到首页
  if (token && url.pathname === '/login') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 如果有 token，继续处理请求
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 匹配所有页面路由，但排除
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
