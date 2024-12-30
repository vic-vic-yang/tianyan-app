'use client';

import userApi from '@/services/userApi';
import Image, { type ImageProps } from 'next/image';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import { User } from '@/type/types';

const user: User = {
  name: 'John Doe',
  role: 'admin',
  avatar: 'https://github.com/shadcn.png',
};

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  useEffect(() => {
    userApi.getUserInfo().then((res) => {
      console.log('res======', res);
    });
  }, []);

  return (
    <MainLayout user={user}>
      <div>
        <h1>Hello World</h1>
      </div>
    </MainLayout>
  );
}
