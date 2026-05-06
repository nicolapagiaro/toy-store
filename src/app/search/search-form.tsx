"use client";

import { useRouter } from "next/navigation";
import styles from "./search.module.css";

interface SearchFormProps {
  initialQuery?: string;
  initialAgeRange?: string;
}

const AGE_RANGE_LABELS: Record<string, string> = {
  AGE_0_2: "0–2 anni",
  AGE_3_5: "3–5 anni",
  AGE_6_8: "6–8 anni",
  AGE_9_12: "9–12 anni",
};

export function SearchForm({ initialQuery = "", initialAgeRange = "" }: SearchFormProps) {
  const router = useRouter();

  function buildParams(q: string, age: string): string {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (age) params.set("ageRange", age);
    return params.toString();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement).value;
    const age = (form.elements.namedItem("ageRange") as HTMLSelectElement).value;
    const qs = buildParams(q, age);
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  function removeQuery() {
    const qs = buildParams("", initialAgeRange);
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  function removeAgeRange() {
    const qs = buildParams(initialQuery, "");
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  const hasActiveFilters = Boolean(initialQuery || initialAgeRange);

  return (
    <section className={styles.searchPanel}>
      <h2 className={styles.searchTitle}>Trova il giocattolo giusto</h2>
      <p className={styles.searchSubtitle}>Cerca tra gli annunci pubblicati dai genitori della tua zona.</p>

      <form className={styles.searchBar} onSubmit={handleSubmit}>
        <div className={styles.searchInputWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="search"
            name="q"
            placeholder="es. triciclo, lego, bici..."
            defaultValue={initialQuery}
          />
        </div>
        <select
          className={styles.filterSelect}
          name="ageRange"
          defaultValue={initialAgeRange}
        >
          <option value="">Tutte le fasce d&apos;età</option>
          <option value="AGE_0_2">0–2 anni</option>
          <option value="AGE_3_5">3–5 anni</option>
          <option value="AGE_6_8">6–8 anni</option>
          <option value="AGE_9_12">9–12 anni</option>
        </select>
        <button type="submit" className={styles.btnSearch}>Cerca</button>
      </form>

      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <span className={styles.filterLabel}>Filtri attivi:</span>
          {initialQuery && (
            <span className={styles.filterChip}>
              &ldquo;{initialQuery}&rdquo;
              <button
                type="button"
                className={styles.filterChipRemove}
                aria-label="Rimuovi filtro testo"
                onClick={removeQuery}
              >
                ✕
              </button>
            </span>
          )}
          {initialAgeRange && AGE_RANGE_LABELS[initialAgeRange] && (
            <span className={styles.filterChip}>
              {AGE_RANGE_LABELS[initialAgeRange]}
              <button
                type="button"
                className={styles.filterChipRemove}
                aria-label="Rimuovi filtro età"
                onClick={removeAgeRange}
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </section>
  );
}
