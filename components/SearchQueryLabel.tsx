function SearchQueryLabel({ label, query }: { label: string; query: string }) {
  return (
    <h2 className="text-balance text-xl font-bold tracking-tight text-foreground">
      {label}
      {query && (
        <span className="ml-3 text-lg font-normal text-muted-foreground">
          "{query.length > 10 ? `${query.slice(0, 10)}...` : query}"
        </span>
      )}
    </h2>
  );
}

export default SearchQueryLabel;
