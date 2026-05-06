import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { MEDIA_BUCKET } from "@/lib/media/storage";
import { EditAdForm } from "./edit-ad-form";
import styles from "./edit-ad.module.css";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const { id } = await params;

  const ad = await prisma.toyAd.findUnique({ where: { id } });

  if (!ad) {
    notFound();
  }

  // Ownership check — show dedicated UI instead of notFound
  if (ad.ownerId !== user.id) {
    return (
      <div className={styles.pageShell}>
        <header className={styles.topNav}>
          <h1 className={styles.brand}>Toy Store</h1>
          <Link className={styles.ghostLink} href="/dashboard">
            Torna alla dashboard
          </Link>
        </header>

        <main>
          <section className={`${styles.panel} ${styles.heroPanel}`}>
            <h2 className={styles.heroTitle}>Modifica non consentita</h2>
            <p className={styles.heroSubtitle}>
              Hai aperto l&apos;URL di modifica di un annuncio che appartiene a un altro utente. Per sicurezza, i
              controlli ownership vengono eseguiti prima di caricare il form editabile.
            </p>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipWarning}`}>Owner mismatch rilevato lato server</span>
              <span className={`${styles.chip} ${styles.chipValidation}`}>Nessun campo modificabile mostrato</span>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.formPanel}`}>
            <h3 className={styles.sectionTitle}>Dettaglio protezione</h3>
            <div className={styles.ownershipLock}>
              <strong>Accesso negato (403)</strong>
              <p className={styles.ownershipLockText}>
                Solo il proprietario dell&apos;annuncio puo vedere il form completo e salvare modifiche a testo o foto.
                Se pensi sia un errore, torna ai tuoi annunci e riapri la scheda corretta.
              </p>
            </div>

            <div className={styles.actionRow}>
              <span style={{ color: "#667085", fontWeight: 700 }}>Utente autenticato: {user.email}</span>
              <div className={styles.actionRowRight}>
                <Link href="/dashboard" className={`${styles.btn} ${styles.btnOutline}`}>
                  Torna alla dashboard
                </Link>
                <Link href="/dashboard/ads" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Vai ai miei annunci
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Build public image URLs
  const supabase = await createClient();
  const imageUrls = ad.imagePaths.map(
    (path) => supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
  );

  return (
    <EditAdForm
      ad={{
        id: ad.id,
        title: ad.title,
        description: ad.description,
        ageRange: ad.ageRange,
        condition: ad.condition,
        city: ad.city,
        district: ad.district,
        imagePaths: ad.imagePaths,
        imageUrls,
        updatedAt: ad.updatedAt.toISOString(),
      }}
    />
  );
}