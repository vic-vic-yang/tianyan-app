export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  name: string;
  role: UserRole;
  avatar: string;
}

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
}

