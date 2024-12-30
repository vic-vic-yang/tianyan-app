import userApi from '@/services/userApi';
import { ApiCode } from '@/services/utils/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().min(1, '请输入邮箱').max(100, '邮箱不能超过100个字符').email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符').max(100, '密码不能超过100个字符'),
  remember: z.boolean().default(false).optional(),
});

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({ isOpen, onClose }: LoginProps) {
  const [remember, setRemember] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    return userApi
      .login(data)
      .then((res) => {
        if (res.code === ApiCode.SUCCESS) {
          if (remember) {
            // 记住我
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>登录</DialogTitle>
          <DialogDescription>请输入您的邮箱和密码进行登录。</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-1">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>记住我</FormLabel>
                </FormItem>
              )}
            />
            <FormMessage />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="bg-primary hover:bg-primary-dark focus:ring-primary w-full rounded-md px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2"
          >
            登录
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
