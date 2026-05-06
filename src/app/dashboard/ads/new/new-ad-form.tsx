"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createToyAdAction, type CreateToyAdActionState } from "@/app/dashboard/ads/new/actions";
import styles from "./new-ad.module.css";

const initialState: CreateToyAdActionState = {};

function fieldHasError(state: CreateToyAdActionState, field: string) {
  return Boolean(state.errors?.[field]);
}

export function NewAdForm() {
  const [state, action, pending] = useActionState(createToyAdAction, initialState);

  return (
    <div className={styles.pageShell}>
      <header className={styles.topNav}>
        <h1 className={styles.brand}>Toy Store</h1>
        <Link className={styles.ghostLink} href="/dashboard">
          Torna alla dashboard
        </Link>
      </header>

      <div className={styles.layoutGrid}>
        <main>
          <section className={`${styles.panel} ${styles.heroPanel}`}>
            <h2 className={styles.heroTitle}>
              {state.errors?.form ? "Completa i campi obbligatori" : "Nuovo annuncio"}
            </h2>
            <p className={styles.heroSubtitle}>
              Compila i dati del giocattolo per pubblicare un'offerta chiara e affidabile. Tutti i campi con asterisco
              sono obbligatori.
            </p>
            {state.errors?.form ? <div className={styles.errorBox}>{state.errors.form}</div> : null}
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipMandatory}`}>6 campi obbligatori + almeno 1 foto</span>
              <span className={`${styles.chip} ${styles.chipHelper}`}>Feedback immediato durante la compilazione</span>
            </div>
          </section>

          <form action={action} className={`${styles.panel} ${styles.formPanel}`}>
            <h3 className={styles.sectionTitle}>Dati annuncio</h3>

            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Dati base</h4>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label htmlFor="title">
                    Titolo <span className={styles.required}>*</span>
                  </label>
                  <input id="title" name="title" className={`${styles.input} ${fieldHasError(state, "title") ? styles.errorInput : ""}`} />
                  {state.errors?.title ? <span className={styles.inlineError}>{state.errors.title}</span> : null}
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label htmlFor="description">
                    Descrizione <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className={`${styles.textarea} ${fieldHasError(state, "description") ? styles.errorInput : ""}`}
                  />
                  {state.errors?.description ? (
                    <span className={styles.inlineError}>{state.errors.description}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Classificazione</h4>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="ageRange">
                    Fascia d'eta <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="ageRange"
                    name="ageRange"
                    defaultValue=""
                    className={`${styles.select} ${fieldHasError(state, "ageRange") ? styles.errorInput : ""}`}
                  >
                    <option value="" disabled>
                      Seleziona fascia
                    </option>
                    <option value="AGE_0_2">0-2 anni</option>
                    <option value="AGE_3_5">3-5 anni</option>
                    <option value="AGE_6_8">6-8 anni</option>
                    <option value="AGE_9_12">9-12 anni</option>
                  </select>
                  {state.errors?.ageRange ? <span className={styles.inlineError}>{state.errors.ageRange}</span> : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="condition">
                    Condizione <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    defaultValue=""
                    className={`${styles.select} ${fieldHasError(state, "condition") ? styles.errorInput : ""}`}
                  >
                    <option value="" disabled>
                      Seleziona condizione
                    </option>
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

            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Localita</h4>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="city">
                    Citta <span className={styles.required}>*</span>
                  </label>
                  <input id="city" name="city" className={`${styles.input} ${fieldHasError(state, "city") ? styles.errorInput : ""}`} />
                  {state.errors?.city ? <span className={styles.inlineError}>{state.errors.city}</span> : null}
                </div>
                <div className={styles.field}>
                  <label htmlFor="district">Quartiere / zona</label>
                  <input id="district" name="district" className={styles.input} />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h4 className={styles.sectionHeading}>Foto del giocattolo</h4>
              <div className={styles.photoDropzone}>
                <strong>
                  Carica almeno una foto <span className={styles.required}>*</span>
                </strong>
                <p className={styles.heroSubtitle}>Mostra frontalmente il giocattolo e almeno un dettaglio. Formati: JPG, PNG.</p>
                <input
                  name="photos"
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className={`${styles.input} ${fieldHasError(state, "photos") ? styles.errorInput : ""}`}
                />
                <div className={styles.photoGrid}>
                  <div className={styles.photoSlot}>Foto principale</div>
                  <div className={styles.photoSlot}>Foto dettaglio</div>
                  <div className={styles.photoSlot}>+ Aggiungi</div>
                  <div className={styles.photoSlot}>+ Aggiungi</div>
                </div>
                {state.errors?.photos ? <div className={styles.errorBox}>{state.errors.photos}</div> : null}
              </div>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={`${styles.btn} ${styles.btnOutline}`}>
                Salva bozza
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={pending}>
                {pending ? "Pubblicazione..." : "Pubblica annuncio"}
              </button>
            </div>
          </form>
        </main>

        <aside>
          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3>Checklist rapida</h3>
            <ul className={styles.hintList}>
              <li>Titolo breve e specifico</li>
              <li>Descrizione con stato reale</li>
              <li>Fascia eta coerente con prodotto</li>
              <li>Localita chiara per il ritiro</li>
            </ul>
          </section>
          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3>Anteprima card annuncio</h3>
            <article className={styles.previewTile}>
              <div className={styles.previewMedia} />
              <div className={styles.previewBody}>
                <strong>Titolo annuncio</strong>
              </div>
            </article>
          </section>
        </aside>
      </div>
    </div>
  );
}
