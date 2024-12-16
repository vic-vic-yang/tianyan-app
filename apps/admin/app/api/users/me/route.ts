import { connectToDatabase } from '@/app/lib/db';
import { ApiCode } from '@/services/utils/apiResponse';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { db } = await connectToDatabase();

  let token = request.headers.get('Authorization');
  console.log('token====', token);
  // 检查用户token
  if (!token) {
    return NextResponse.json({
      code: ApiCode.UNAUTHORIZED,
      message: '未登录',
    });
  }

  token = token.slice(7, token.length);

  const user = await db.collection('users').findOne({ token: token });
  if (!user) {
    return NextResponse.json({
      code: ApiCode.UNAUTHORIZED,
      message: '未登录',
    });
  }
  return NextResponse.json({
    code: ApiCode.SUCCESS,
    message: '获取用户信息成功',
    data: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}
