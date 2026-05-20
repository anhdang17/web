'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Đã xảy ra lỗi</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Không thể tải trang. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()} className="min-h-11 min-w-44">
          Thử lại
        </Button>
        <Button type="button" variant="outline" className="min-h-11 min-w-44" asChild>
          <a href="/">Trang chủ</a>
        </Button>
      </div>
    </div>
  );
}
