type SearchFormProps = {
  className?: string;
  defaultValue?: string;
  inputId?: string;
  compact?: boolean;
};

export function SearchForm({
  className = "",
  defaultValue = "",
  inputId = "q",
  compact = false,
}: SearchFormProps) {
  return (
    <form
      action="/search"
      method="get"
      className={`flex w-full max-w-xs gap-2 ${className}`}
      role="search"
    >
      <label htmlFor={inputId} className="sr-only">
        খুঁজুন
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="খুঁজুন..."
        className={`w-full rounded-full border border-rule bg-white outline-none ring-accent/30 placeholder:text-muted focus:ring-2 ${
          compact ? "px-3 py-1 text-sm" : "px-3.5 py-2 text-[0.975rem]"
        }`}
      />
      <button
        type="submit"
        className={`rounded-full bg-ink text-paper transition-colors hover:bg-accent ${
          compact ? "px-3 py-1 text-sm" : "px-3 py-1.5 text-sm"
        }`}
      >
        খুঁজুন
      </button>
    </form>
  );
}
