import Image from "next/image";
import Link from "next/link";
import { getToyAdSignedImages } from "@/lib/media/toy-ad-images";
import { prisma } from "@/lib/prisma";
import { searchToyAds } from "@/lib/toy-ads/search";
import { SearchForm } from "./search-form";
import styles from "./search.module.css";

const AGE_RANGE_LABELS: Record<string, string> = {
  AGE_0_2: "0–2 anni",
  AGE_3_5: "3–5 anni",
  AGE_6_8: "6–8 anni",
  AGE_9_12: "9–12 anni",
};

const CONDITION_LABELS: Record<string, string> = {
  LIKE_NEW: "Come nuovo",
  EXCELLENT: "Ottime condizioni",
  GOOD: "Buone condizioni",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ageRange?: string }>;
}) {
  const { q, ageRange } = await searchParams;

  const ads = await searchToyAds(
    { query: q, ageRange },
    {
      findAds: async (normalized) =>
        prisma.toyAd.findMany({
          where: {
            status: "PUBLISHED",
            ...(normalized.ageRange && { ageRange: normalized.ageRange }),
            ...(normalized.query && {
              OR: [
                { title: { contains: normalized.query, mode: "insensitive" } },
                { description: { contains: normalized.query, mode: "insensitive" } },
              ],
            }),
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            ageRange: true,
            condition: true,
            city: true,
            district: true,
            imagePaths: true,
            createdAt: true,
          },
        }),
    }
  );

  const firstPaths = ads.map((ad) => ad.imagePaths[0]).filter((p): p is string => Boolean(p));
  const signedImages = await getToyAdSignedImages(firstPaths);
  const signedUrlByPath = Object.fromEntries(signedImages.map((img) => [img.path, img.url]));

  const adsWithImages = ads.map((ad) => ({
    ...ad,
    imageUrl: ad.imagePaths[0] ? signedUrlByPath[ad.imagePaths[0]] : undefined,
  }));

  const resultsCount = adsWithImages.length;

  return (
    <div className={styles.pageShell}>
      <header className={styles.topNav}>
        <h1 className={styles.brand}>Toy Store</h1>
        <Link href="/dashboard/ads/new" className={styles.ghostLink}>
          Pubblica annuncio
        </Link>
      </header>

      <SearchForm initialQuery={q} initialAgeRange={ageRange} />

      <div className={styles.resultsHeader}>
        <p className={styles.resultsCount}>
          {resultsCount > 0 ? (
            <>
              {resultsCount} {resultsCount === 1 ? "risultato" : "risultati"}
            </>
          ) : (
            "Nessun risultato"
          )}
        </p>
      </div>

      {adsWithImages.length > 0 ? (
        <div className={styles.resultsGrid}>
          {adsWithImages.map((ad) => (
            <Link key={ad.id} href={`/dashboard/ads/${ad.id}`} className={styles.adCard}>
              <div className={styles.adCardMedia}>
                {ad.imageUrl && (
                  <Image src={ad.imageUrl} alt={ad.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                )}
              </div>
              <div className={styles.adCardBody}>
                <div className={styles.adBadgeRow}>
                  <span className={`${styles.badge} ${styles.badgeAge}`}>
                    {AGE_RANGE_LABELS[ad.ageRange] ?? ad.ageRange}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeCondition}`}>
                    {CONDITION_LABELS[ad.condition] ?? ad.condition}
                  </span>
                </div>
                <h3 className={styles.adTitle}>{ad.title}</h3>
                <p className={styles.adCity}>
                  📍 {ad.district ? `${ad.city} – ${ad.district}` : ad.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🔍</span>
          <h3 className={styles.emptyTitle}>Nessun annuncio trovato</h3>
          <p className={styles.emptySubtitle}>
            {q && ageRange && AGE_RANGE_LABELS[ageRange]
              ? <>Non ci sono annunci per <strong>&ldquo;{q}&rdquo;</strong> nella fascia {AGE_RANGE_LABELS[ageRange]}.</>
              : q
              ? <>Non ci sono annunci che corrispondono a <strong>&ldquo;{q}&rdquo;</strong>.</>
              : ageRange && AGE_RANGE_LABELS[ageRange]
              ? <>Non ci sono annunci nella fascia <strong>{AGE_RANGE_LABELS[ageRange]}</strong>.</>
              : <>Non ci sono ancora annunci disponibili.</>}
            {" "}Prova a modificare la ricerca o a rimuovere i filtri.
          </p>
          <Link href="/search" className={styles.btnOutline}>
            Rimuovi tutti i filtri
          </Link>
        </div>
      )}
    </div>
  );
}
