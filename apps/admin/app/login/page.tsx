'use client';

import { login } from '@/app/actions/auth';
import { ApiCode, ApiResponse } from '@/services/utils/apiResponse';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

export default function Login() {
  return (
    <div>
      <SignupForm />
    </div>
  );
}

function SignupForm() {
  const [state, action, isPending] = useActionState((_state: ApiResponse, formData: FormData) => login(formData), {
    code: 0,
    message: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (state?.code === ApiCode.SUCCESS) {
      router.push('/');
    }
  }, [state]);

  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" placeholder="Email" required />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((err: string) => (
              <li key={err}>- {err}</li>
            ))}
          </ul>
        </div>
      )}
      {state?.message && <p>{state.message}</p>}
      <Button disabled={isPending} type="submit">
        login
      </Button>
    </form>
  );
}
