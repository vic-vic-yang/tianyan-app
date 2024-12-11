import { z } from 'zod';

// 定义注册表单的验证模式
export const SignupFormSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符').max(100, '密码不能超过100个字符'),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   '密码必须包含至少一个大写字母、一个小写字母和一个数字'
  // ),
});

// 定义表单状态类型
export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

// 从验证模式中推导出表单数据类型
export type SignupFormData = z.infer<typeof SignupFormSchema>;
