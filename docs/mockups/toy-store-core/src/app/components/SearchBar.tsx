import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
}

export function SearchBar({ onSearch, onFilterClick }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" role="search">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Cerca giocattoli..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-input-background rounded-[var(--radius)] border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Cerca giocattoli"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="px-4 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] hover:opacity-90 transition-opacity flex items-center gap-2"
        aria-label="Apri filtri di ricerca"
      >
        <SlidersHorizontal size={20} aria-hidden="true" />
        <span className="hidden lg:inline">Filtri</span>
        <span className="sr-only lg:hidden">Filtri</span>
      </button>
    </form>
  );
}
