"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateToyAdAction, type UpdateToyAdActionState } from "./actions";
import styles from "./edit-ad.module.css";

type AdImage = {
  path: string;
  url: string;
};

export type EditAdFormProps = {
  ad: {
    id: string;
    title: string;
    description: string;
    ageRange: string;
    condition: string;
    city: string;
    district: string | null;
    images: AdImage[];
    updatedAt: string;
  };
};

const initialState: UpdateToyAdActionState = {};

function fieldHasError(state: UpdateToyAdActionState, field: string) {
  return Boolean(state.errors?.[field]);
}

export function EditAdForm({ ad }: EditAdFormProps) {
  const [state, action, pending] = useActionState(updateToyAdAction, initialState);

  // Track which existing photos are marked for removal
  const [removedPaths, setRemovedPaths] = useState<Set<string>>(new Set());

  function toggleRemove(path: string) {
    setRemovedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  const ageRangeLabels: Record<string, string> = {
    AGE_0_2: "0-2 anni",
    AGE_3_5: "3-5 anni",
    AGE_6_8: "6-8 anni",
    AGE_9_12: "9-12 anni",
  };

  const conditionLabels: Record<string, string> = {
    LIKE_NEW: "Come nuovo",
    EXCELLENT: "Ottime condizioni",
    GOOD: "Buone condizioni",
  };

  return (
    <div className={styles.pageShell}>
      <header className={styles.topNav}>
        <h1 className={styles.brand}>Toy Store</h1>
        <Link className={styles.ghostLink} href={`/dashboard/ads/${ad.id}`}>
          Vedi dettaglio annuncio
        </Link>
      </header>

      <div className={styles.layoutGrid}>
        <main>
          {/* Hero panel */}
          <section className={`${styles.panel} ${styles.heroPanel}`}>
            <h2 className={styles.heroTitle}>
              {state.errors?.form ? "Completa i campi obbligatori" : "Modifica annuncio pubblicato"}
            </h2>
            <p className={styles.heroSubtitle}>
              Stai modificando un annuncio di tua proprieta. Le regole di validazione sono identiche al flusso di
              creazione: campi obbligatori + almeno una foto valida.
            </p>
            {state.errors?.form ? <div className={styles.errorBox}>{state.errors.form}</div> : null}
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipOwner}`}>Owner verificato</span>
              <span className={`${styles.chip} ${styles.chipValidation}`}>Stesse regole del &ldquo;Nuovo annuncio&rdquo;</span>
            </div>
          </section>

          {/* Form panel */}
          <form action={action} className={`${styles.panel} ${styles.formPanel}`}>
            {/* Hidden fields to pass the ad ID and concurrency snapshot to the server action */}
            <input type="hidden" name="adId" value={ad.id} />
            <input type="hidden" name="snapshotUpdatedAt" value={ad.updatedAt} />

            {/* Hidden fields for existing paths to keep */}
            {ad.images
              .filter((image) => !removedPaths.has(image.path))
              .map((image) => (
                <input key={image.path} type="hidden" name="existingImagePaths" value={image.path} />
              ))}

            <h3 className={styles.sectionTitle}>Dettagli modificabili</h3>

            {/* Dati base */}
            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Dati base</h4>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label htmlFor="title">
                    Titolo <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    defaultValue={ad.title}
                    className={`${styles.input} ${fieldHasError(state, "title") ? styles.errorInput : ""}`}
                  />
                  {state.errors?.title ? <span className={styles.inlineError}>{state.errors.title}</span> : null}
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label htmlFor="description">
                    Descrizione <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={ad.description}
                    className={`${styles.textarea} ${fieldHasError(state, "description") ? styles.errorInput : ""}`}
                  />
                  {state.errors?.description ? (
                    <span className={styles.inlineError}>{state.errors.description}</span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Classificazione */}
            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Classificazione</h4>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="ageRange">
                    Fascia d&apos;eta <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="ageRange"
                    name="ageRange"
                    defaultValue={ad.ageRange}
                    className={`${styles.select} ${fieldHasError(state, "ageRange") ? styles.errorInput : ""}`}
                  >
                    <option value="AGE_0_2">0-2 anni</option>
                    <option value="AGE_3_5">3-5 anni</option>
                    <option value="AGE_6_8">6-8 anni</option>
                    <option value="AGE_9_12">9-12 anni</option>
                  </select>
                  {state.errors?.ageRange ? (
                    <span className={styles.inlineError}>{state.errors.ageRange}</span>
                  ) : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="condition">
                    Condizione <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    defaultValue={ad.condition}
                    className={`${styles.select} ${fieldHasError(state, "condition") ? styles.errorInput : ""}`}
                  >
                    <option value="LIKE_NEW">Come nuovo</option>
                    <option value="EXCELLENT">Ottime condizioni</option>
                    <option value="GOOD">Buone condizioni</option>
                  </select>
                  {state.errors?.condition ? (
                    <span className={styles.inlineError}>{state.errors.condition}</span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Localita */}
            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Localita</h4>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="city">
                    Citta <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    defaultValue={ad.city}
                    className={`${styles.input} ${fieldHasError(state, "city") ? styles.errorInput : ""}`}
                  />
                  {state.errors?.city ? <span className={styles.inlineError}>{state.errors.city}</span> : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="district">Quartiere / zona</label>
                  <input
                    id="district"
                    name="district"
                    defaultValue={ad.district ?? ""}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Foto */}
            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Foto esistenti + nuove foto</h4>
              <p className={styles.photoSectionDesc}>
                Puoi tenere, rimuovere o sostituire le foto gia caricate e aggiungerne di nuove prima del salvataggio.
              </p>

              <div className={styles.photoGrid}>
                {ad.images.map((image, idx) => {
                  const isRemoved = removedPaths.has(image.path);
                  return (
                    <div
                      key={image.path}
                      className={`${styles.photoSlot} ${
                        isRemoved ? styles.photoSlotRemove : styles.photoSlotExisting
                      }`}
                    >
                      <span
                        className={`${styles.statusPill} ${
                          isRemoved ? styles.pillRemove : styles.pillExisting
                        }`}
                      >
                        {isRemoved ? "Da rimuovere" : "Esistente"}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={`Foto ${idx + 1}`}
                        style={{ width: "100%", borderRadius: 8, objectFit: "cover", height: 52 }}
                      />
                      <button
                        type="button"
                        className={styles.photoToggleBtn}
                        onClick={() => toggleRemove(image.path)}
                      >
                        {isRemoved ? "Tieni" : "Rimuovi"}
                      </button>
                    </div>
                  );
                })}

                {/* Slot nuove foto */}
                <div className={`${styles.photoSlot} ${styles.photoSlotNew}`}>
                  <span className={`${styles.statusPill} ${styles.pillNew}`}>Aggiungi</span>
                  <strong>+ Carica foto</strong>
                  <span>JPG / PNG</span>
                </div>
              </div>

              <input
                name="newPhotos"
                type="file"
                accept="image/png,image/jpeg"
                multiple
                className={styles.newPhotosInput}
              />

              {state.errors?.photos ? <div className={styles.errorBox}>{state.errors.photos}</div> : null}

              {pending ? (
                <div className={styles.infoBox}>
                  Salvataggio in corso... attendere prego.
                </div>
              ) : null}
            </div>

            {/* Action row */}
            <div className={styles.actionRow}>
              <span style={{ color: "#667085", fontWeight: 700 }}>Modifica annuncio</span>
              <div className={styles.actionRowRight}>
                <Link href={`/dashboard/ads/${ad.id}`} className={`${styles.btn} ${styles.btnOutline}`}>
                  Annulla
                </Link>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={pending}>
                  {pending ? "Salvataggio..." : "Salva modifiche"}
                </button>
              </div>
            </div>
          </form>
        </main>

        {/* Sidebar */}
        <aside>
          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Ownership &amp; sicurezza</h3>
            <ul className={styles.hintList}>
              <li>Solo il proprietario puo aprire questa schermata</li>
              <li>Controllo owner lato server prima del submit</li>
              <li>Le modifiche sono visibili subito dopo il salvataggio</li>
            </ul>
          </section>

          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Anteprima post-update</h3>
            <article className={styles.previewTile}>
              <div className={styles.previewMedia} />
              <div className={styles.previewBody}>
                <div className={styles.badgeRow}>
                  <span className={`${styles.badge} ${styles.badgeSecondary}`}>
                    {ageRangeLabels[ad.ageRange] ?? ad.ageRange}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeAccent}`}>
                    {conditionLabels[ad.condition] ?? ad.condition}
                  </span>
                </div>
                <strong>{ad.title}</strong>
                <p className={styles.previewNote}>
                  Le modifiche saranno visibili subito dopo il redirect sul dettaglio.
                </p>
              </div>
            </article>
          </section>
        </aside>
      </div>
    </div>
  );
}