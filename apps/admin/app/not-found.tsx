import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">抱歉，您访问的页面不存在。</p>
        <Link
          href="/"
          className="bg-primary hover:bg-primary/80 mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white shadow-md transition"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
