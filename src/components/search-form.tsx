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
        className={`flex w-full gap-2 ${compact ? "max-w-xs" : "max-w-none"} ${className}`}
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
        className={`w-full rounded-sm border border-rule bg-white outline-none ring-accent/30 placeholder:text-muted focus:ring-2 ${
          compact ? "h-8 px-2.5 text-sm" : "h-11 px-3.5 text-[0.975rem]"
        }`}
      />
      <button
        type="submit"
        className={`shrink-0 bg-ink text-paper transition-colors hover:bg-accent ${
          compact ? "h-8 px-2.5 text-sm" : "h-11 rounded-sm px-4 text-sm"
        }`}
      >
        খুঁজুন
      </button>
    </form>
  );
}
