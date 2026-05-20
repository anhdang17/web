export default function RootLoading() {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-6 py-16">
      <div
        className="h-12 w-12 animate-pulse rounded-full bg-muted"
        role="status"
        aria-label="Đang tải"
      />
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
