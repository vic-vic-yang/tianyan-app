
import { connectToDatabase } from '@/app/lib/db';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';


async function comparePassword(password: string, savePassword: string): Promise<Boolean> {
  let result = false;
  try {
    result = await compare(password, savePassword);
  } catch (e) {
    console.log(`comparePassword error: ${e}`);
  }
  return result;
}

export async function POST(request: Request) {
  try {

    const { email, password } = await request.json();
    const { db } = await connectToDatabase();
    

    // 3. 检查邮箱是否已存在
    const existingUser = await db.collection('users').findOne({ email });
    if (!existingUser) {
      return {
        success: false,
        message: '该邮箱未注册',
      };
    }

    const compare = await comparePassword(password, existingUser.password);
    if (!compare) {
      return {
        success: false,
        message: '密码错误',
      };
    }

    // token 保存到cookie
    (await cookies()).set('token', existingUser.token);
    return { success: true, data: existingUser };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: '登录过程中发生错误',
    };
  }
}
