export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="h-72 animate-pulse rounded-lg bg-rule/60" />
      <div className="mt-8 h-8 w-2/3 animate-pulse rounded bg-rule/60" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-rule/50" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-rule/50" />
    </main>
  );
}
