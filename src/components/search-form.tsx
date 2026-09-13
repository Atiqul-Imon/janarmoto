type SearchFormProps = {
  className?: string;
  defaultValue?: string;
};

export function SearchForm({ className = "", defaultValue = "" }: SearchFormProps) {
  return (
    <form action="/search" method="get" className={`flex w-full max-w-xs gap-2 ${className}`} role="search">
      <label htmlFor="q" className="sr-only">
        খুঁজুন
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="খুঁজুন..."
        className="w-full rounded-full border border-rule bg-white px-3.5 py-2 text-[0.975rem] outline-none ring-accent/30 placeholder:text-muted focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper transition-colors hover:bg-accent"
      >
        খুঁজুন
      </button>
    </form>
  );
}
