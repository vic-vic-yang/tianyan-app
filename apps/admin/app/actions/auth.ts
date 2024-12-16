'use server';

import { ApiCode } from '@/services/utils/apiResponse';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../lib/db';
import { SignupFormSchema } from '../lib/definitions';

async function comparePassword(password: string, savePassword: string): Promise<Boolean> {
  let result = false;
  try {
    result = await compare(password, savePassword);
  } catch (e) {
    console.log(`comparePassword error: ${e}`);
  }
  return result;
}

export async function login(formData: FormData): Promise<any> {
  try {
    const { db } = await connectToDatabase();
    const validatedFields = SignupFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        code: ApiCode.BAD_REQUEST,
        message: '表单验证失败',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // 3. 检查邮箱是否已存在
    const existingUser = await db.collection('users').findOne({ email: email });

    if (!existingUser) {
      return {
        code: ApiCode.BAD_REQUEST,
        message: '该邮箱未注册',
      };
    }

    const compare = await comparePassword(password as string, existingUser.password);
    if (!compare) {
      return {
        code: ApiCode.BAD_REQUEST,
        message: '密码错误',
        errors: {
          password: ['密码错误'],
        },
      };
    }

    // token 保存到cookie
    (await cookies()).set('token', existingUser.token);

    console.log('existingUser', existingUser);

    return {
      code: ApiCode.SUCCESS,
      data: {
        userId: existingUser.userId,
        email: existingUser.email,
        token: existingUser.token,
        shareCode: existingUser.shareCode,
        lastLoginAt: existingUser.lastLoginAt,
      },
      message: '登录成功',
    };
  } catch (error) {
    return {
      code: ApiCode.SERVER_ERROR,
      message: '登录失败',
    };
  }
}
