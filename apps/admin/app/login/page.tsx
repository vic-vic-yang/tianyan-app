'use client';

import { login } from '@/app/actions/auth';
import { ApiCode, ApiResponse } from '@/services/utils/apiResponse';
import { Boxes } from '@repo/ui/components/ui/background-boxes';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
// import Lottie from 'lottie-react';
// import animationData from '@/assets/animation.json'; // 确保您有一个动画 JSON 文件

export default function Login() {
  return (
    <div className="flex min-h-screen">
      {/* 左侧动画区域 */}
      <div className="from-primary to-secondary hidden w-1/2 items-center justify-center bg-gradient-to-tr md:flex">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-primary">
          <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-primary [mask-image:radial-gradient(transparent,white)]" />

          <Boxes />
          <h1 className={cn('relative z-20 text-xl text-white md:text-4xl')}>Tailwind is Awesome</h1>
          <p className="relative z-20 mt-2 text-center text-neutral-300">
            Framer motion is the best animation library ngl
          </p>
        </div>
      </div>

      {/* 右侧登录表单区域 */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="w-full max-w-md rounded-lg bg-white p-8">
          <div className="mb-6 flex justify-center">
            <Image src="/globe.svg" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-primary mb-6 text-center text-2xl font-bold">登录您的账户</h2>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

function SignupForm() {
  const [state, action, isPending] = useActionState((_state: ApiResponse, formData: FormData) => login(formData), {
    code: 0,
    message: '',
  });
  const router = useRouter();
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (state?.code === ApiCode.SUCCESS) {
      if (remember) {
        // 记住我
      }
      router.push('/');
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          邮箱
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="请输入您的邮箱"
          required
          className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none"
        />
        {state?.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          密码
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="请输入您的密码"
          required
          className="focus:ring-primary focus:border-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none"
        />
        {state?.errors?.password && (
          <div className="mt-1 text-sm text-red-600">
            <p>密码必须满足以下要求：</p>
            <ul className="list-inside list-disc">
              {state.errors.password.map((err: string) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" onCheckedChange={() => setRemember(!remember)} />{' '}
        <label htmlFor="remember" className="w-fit cursor-pointer text-sm text-gray-600">
          记住我
        </label>
      </div>

      {state?.message && <p className="text-center text-sm text-red-600">{state.message}</p>}

      <Button
        disabled={isPending}
        type="submit"
        className="bg-primary hover:bg-primary-dark focus:ring-primary w-full rounded-md px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2"
      >
        登录
      </Button>
    </form>
  );
}
