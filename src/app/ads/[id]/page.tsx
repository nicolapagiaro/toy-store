import Link from "next/link";
import { notFound } from "next/navigation";
import { MEDIA_BUCKET } from "@/lib/media/storage";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { StartChatForm } from "./start-chat-form";
import styles from "./ad-page.module.css";

const ageRangeLabels: Record<string, string> = {
  AGE_0_2: "0–2 anni",
  AGE_3_5: "3–5 anni",
  AGE_6_8: "6–8 anni",
  AGE_9_12: "9–12 anni",
};

const conditionLabels: Record<string, string> = {
  LIKE_NEW: "Come nuovo",
  EXCELLENT: "Ottime condizioni",
  GOOD: "Buone condizioni",
};

export default async function PublicAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [ad, user] = await Promise.all([
    prisma.toyAd.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true } } },
    }),
    getCurrentUser(),
  ]);

  if (!ad) notFound();

  const supabase = await createClient();
  const images = ad.imagePaths.map((path) => ({
    path,
    url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl,
  }));

  const location = ad.district ? `${ad.city}, ${ad.district}` : ad.city;
  const createdDate = new Intl.DateTimeFormat("it-IT", { dateStyle: "long" }).format(ad.createdAt);
  const ownerName = ad.owner.name ?? "Venditore";
  const ownerInitial = ownerName[0].toUpperCase();
  const isOwner = user?.id === ad.ownerId;

  return (
    <div className={styles.pageShell}>
      <header className={styles.topNav}>
        <h1 className={styles.brand}>Toy Store</h1>
        <nav className={styles.navLinks}>
          {user ? (
            <Link className={styles.ghostLink} href="/dashboard">
              Dashboard
            </Link>
          ) : (
            <Link className={styles.ghostLink} href="/auth/signin">
              Accedi
            </Link>
          )}
        </nav>
      </header>

      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>Annunci</span>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{ad.title}</span>
      </nav>

      <div className={styles.layoutGrid}>
        <main>
          {/* Image gallery */}
          <section className={`${styles.panel} ${styles.galleryPanel}`}>
            <div className={styles.adImageArea}>
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0].url} alt={ad.title} className={styles.adMainImage} />
              ) : (
                <div className={styles.imagePlaceholderIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.adImageThumbRow}>
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.path}
                    src={img.url}
                    alt={`${ad.title} - foto ${i + 1}`}
                    className={`${styles.adImageThumb} ${i === 0 ? styles.active : ""}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Ad info */}
          <section className={`${styles.panel} ${styles.adInfoPanel}`}>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeSecondary}`}>{ageRangeLabels[ad.ageRange]}</span>
              <span className={`${styles.badge} ${styles.badgeAccent}`}>{conditionLabels[ad.condition]}</span>
              <span className={`${styles.badge} ${styles.badgeEmerald}`}>Disponibile</span>
            </div>

            <h2 className={styles.adTitle}>{ad.title}</h2>

            <div className={styles.adMetaRow}>
              <span className={styles.metaItem}>📍 {location}</span>
              <span className={styles.divider} />
              <span className={styles.metaItem}>🗓 Pubblicato il {createdDate}</span>
            </div>

            <p className={styles.adDescription}>{ad.description}</p>

            {isOwner ? (
              <div className={styles.ownerBox}>
                <span className={styles.ownerBoxText}>Questo è il tuo annuncio</span>
                <Link href={`/dashboard/ads/${ad.id}/edit`} className={`${styles.btn} ${styles.btnOutline}`}>
                  Modifica annuncio
                </Link>
              </div>
            ) : user ? (
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaBoxTitle}>Interessato a questo giocattolo?</h3>
                <p className={styles.ctaBoxHint}>
                  Avvia una chat diretta con {ownerName}. Il riferimento all'annuncio sarà incluso automaticamente.
                </p>
                <StartChatForm toyAdId={ad.id} ownerName={ownerName} />
              </div>
            ) : (
              <div className={styles.authPromptBox}>
                <h3 className={styles.authPromptTitle}>Vuoi contattare il venditore?</h3>
                <p className={styles.authPromptText}>
                  Accedi al tuo account per avviare una chat con {ownerName}. La registrazione è gratuita.
                </p>
                <div className={styles.authBtnRow}>
                  <Link href="/auth/signin" className={`${styles.btn} ${styles.btnSignin}`}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Accedi per contattare
                  </Link>
                  <Link href="/auth/signin" className={`${styles.btn} ${styles.btnOutline}`}>
                    Registrati gratis
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>

        <aside>
          <section className={`${styles.panel} ${styles.sellerCard}`}>
            <h3 className={styles.sideTitle}>Venditore</h3>
            <div className={styles.sellerHeader}>
              <div className={styles.avatarPink}>{ownerInitial}</div>
              <div>
                <div className={styles.sellerName}>{ownerName}</div>
              </div>
            </div>
            {user && !isOwner && (
              <div className={styles.infoBox}>
                Sei loggato come <strong>{user.name ?? user.email}</strong> — puoi avviare la chat.
              </div>
            )}
            {!user && (
              <div className={styles.warningBox}>
                <strong>Accesso richiesto</strong> — Effettua l'accesso per contattare il venditore.
              </div>
            )}
          </section>

          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Dettagli annuncio</h3>
            <ul className={styles.hintList}>
              <li>Fascia d'età: {ageRangeLabels[ad.ageRange]}</li>
              <li>Condizione: {conditionLabels[ad.condition]}</li>
              <li>Città: {location}</li>
            </ul>
          </section>

          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Consigli per uno scambio sicuro</h3>
            <ul className={styles.hintList}>
              <li>Incontra in un luogo pubblico</li>
              <li>Verifica il giocattolo prima del ritiro</li>
              <li>Usa solo la chat in-app per comunicare</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
