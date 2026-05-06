# Toy Store — Product Requirements Document

**Author:** Archetipo
**Date:** 2026-05-06
**Version:** 1.0

---

## Elevator Pitch

> Aiutiamo le famiglie a scambiare giocattoli in modo sicuro, conveniente e sostenibile.
>
> For **famiglie con bambini 0-10 anni in Italia**, who has the problem of **accumulare giocattoli non piu usati e sprecare risorse**, **Toy Store** is a **community digitale di scambio e vendita di giocattoli tra famiglie** that **riduce sprechi, costi e tempo nella ricerca di giochi adatti**. Unlike **Facebook Marketplace**, our product **nasce con focus verticale famiglia, fiducia tramite identita verificata e reputazione, e flussi ottimizzati per lo scambio tra genitori**.

---

## Vision

Creare la community di riferimento in Italia per dare nuova vita ai giocattoli tra famiglie, riducendo spreco e inquinamento attraverso scambi semplici, sicuri e locali.

### Product Differentiator

Toy Store e una community verticale per famiglie (non un marketplace generalista), con priorita su fiducia, verifica utenti e scambi tra persone con bisogni simili.

---

## User Personas

### Persona 1: Sara

**Role:** Mamma lavoratrice, utente digitale frequente
**Age:** 34 | **Background:** Vive in una citta media, due figli (3 e 7 anni), usa app quotidianamente per acquisti e organizzazione familiare

**Goals:**
- Liberare spazio in casa dai giocattoli non piu usati
- Ridurre il budget dedicato ai nuovi giochi

**Pain Points:**
- Perde tempo con annunci poco chiari o utenti non affidabili
- Diffida di piattaforme senza verifica identita e recensioni credibili

**Behaviors & Tools:**
- Smartphone-first, chat veloce, confronta profili e feedback prima di decidere
- Predilige filtri per distanza e fascia d'eta del giocattolo

**Motivations:** Risparmiare, semplificare la gestione domestica, contribuire al riuso
**Tech Savviness:** Alto

#### Customer Journey — Sara

| Phase | Action | Thought | Emotion | Opportunity |
|---|---|---|---|---|
| Awareness | Vede un post social su Toy Store condiviso da un'altra mamma | "Potrei finalmente smaltire giochi utili a qualcuno" | Curiosita | Campagne referral e storytelling anti-spreco |
| Consideration | Confronta Toy Store con Facebook Marketplace | "Se qui ci sono utenti verificati, mi fido di piu" | Prudenza positiva | Evidenziare verifica identita e reputazione |
| First Use | Pubblica il primo annuncio e avvia una chat per scambio | "Se ci metto poco a pubblicare, lo usero ancora" | Sollievo | Onboarding guidato e form annuncio rapido |
| Regular Use | Usa filtri locali e scambia periodicamente | "Risparmio e faccio girare giochi utili" | Soddisfazione | Suggerimenti personalizzati e notifiche intelligenti |
| Advocacy | Invita altre famiglie e lascia recensioni | "E un'app utile per tutta la comunita" | Entusiasmo | Programma inviti e badge di affidabilita |

---

### Persona 2: Marco

**Role:** Papa pragmatico, utente digitale essenziale
**Age:** 42 | **Background:** Vive in provincia, un figlio di 6 anni, usa lo smartphone in modo pratico e orientato al risultato

**Goals:**
- Trovare scambi semplici vicino casa
- Ottenere giocattoli adatti senza perdere tempo

**Pain Points:**
- Processi troppo complessi o dispersivi
- Timore di contatti poco affidabili negli incontri di persona

**Behaviors & Tools:**
- Usa poche app, preferisce passaggi guidati e chiari
- Valuta soprattutto reputazione utente, distanza e disponibilita reale

**Motivations:** Comodita, fiducia, utilita immediata
**Tech Savviness:** Medio-basso

#### Customer Journey — Marco

| Phase | Action | Thought | Emotion | Opportunity |
|---|---|---|---|---|
| Awareness | Sente parlare della piattaforma da un genitore a scuola | "Mi serve qualcosa di semplice, non un social in piu" | Scetticismo | Messaggio chiaro su semplicita e sicurezza |
| Consideration | Visita app/sito e guarda profili verificati in zona | "Se trovo vicino e affidabile, provo" | Attenzione | Mostrare distanza, rating, verifica in evidenza |
| First Use | Risponde a un annuncio e conclude scambio via chat | "Ok, e stato rapido e senza complicazioni" | Fiducia crescente | Template messaggi e proposta incontro sicuro |
| Regular Use | Controlla periodicamente nuove opportunita 6-10 anni | "Mi fa risparmiare tempo e soldi" | Tranquillita | Alert per nuove inserzioni compatibili |
| Advocacy | Consiglia Toy Store ad amici/genitori della scuola | "Funziona davvero meglio dei gruppi generici" | Fiducia piena | Incentivi passaparola e reputazione community |

---

## Brainstorming Insights

> Key discoveries and alternative directions explored during the inception session.

### Assumptions Challenged

- La fiducia tra sconosciuti non e automatica: deve essere progettata tramite identita verificata, recensioni e moderazione.
- Lo scambio non e "naturale" come la vendita: servono flussi dedicati (chat, proposta, accordo).
- Essere "come Subito/Facebook" non basta: serve un posizionamento verticale famiglia + sostenibilita.

### New Directions Discovered

- Priorita dei primi 3 mesi su base utenti registrati e verificati per creare liquidita futura degli scambi.
- Modello di ricavo leggero e coerente con la community: annunci e aumento visibilita inserzioni.
- Focus nazionale (Italia) con logica local-first via geolocalizzazione/raggio.

---

## Product Scope

### MVP — Minimum Viable Product

- Registrazione/login con profilo utente e stato verifica
- Creazione annunci giocattoli con foto, descrizione, fascia d'eta (0-2, 3-5, 6-10), condizione
- Ricerca e filtri per distanza geografica, fascia d'eta e tipologia
- Chat interna tra utenti per gestire proposta e accordo di scambio/vendita
- Sistema recensioni post scambio
- Moderazione automatica base annunci con possibilita di intervento manuale admin
- Geolocalizzazione/raggio km per favorire scambi locali

### Growth Features (Post-MVP)

- Boost visibilita annuncio (feature premium)
- Suggerimenti smart di matching tra annunci compatibili
- Badge reputazione avanzati e livelli community
- Dashboard metriche per utenti power-seller/swapper

### Vision (Future)

- Programmi partnership con scuole, comuni, associazioni famiglie
- Integrazione logistica opzionale per spedizioni sicure
- Esperienze ibride online/offline (swap day locali)

---

## Technical Architecture

> **Proposed by:** Leonardo (Architect)

### System Architecture

Applicazione web full-stack basata su Next.js App Router, con moduli funzionali separati in un modular monolith. Auth e storage su Supabase, persistenza dati su PostgreSQL via Prisma.

**Architectural Pattern:** Modular Monolith

**Main Components:**
- Gestione annunci giocattoli (`toy-listings`)
- Gestione proposte di scambio (`swap-proposals`)
- Chat tra utenti (`chat`) per concordare dettagli di scambio/vendita
- Fiducia e reputazione (`trust-and-verification`)
- Moderazione contenuti (`content-moderation`)
- Ricerca locale e prossimita (`local-discovery`)

### Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Language | TypeScript | 5.x | Coerenza end-to-end e riduzione errori in sviluppo |
| Backend Framework | Next.js App Router | 15.x | Boilerplate gia pronto con routing, server actions e API routes |
| Frontend Framework | React (via Next.js) | 19.x | Ecosistema moderno, componentizzazione e integrazione UI |
| Database | PostgreSQL (Supabase) | 16.x | Affidabile, relazionale, adatto a marketplace/community |
| ORM | Prisma | 5.x | Schema type-safe e produttivita nello sviluppo dati |
| Auth | Supabase Auth | managed | OAuth/session management gia integrati nel boilerplate |
| Testing | Vitest + Testing Library (target) | latest | Test veloci su logica e UI |

### Project Structure

**Organizational pattern:** Modular feature-based organization on top of existing `src/` structure

```
src/
  app/
    (routes and pages)
  features/
    toy-listings/
    swap-proposals/
    chat/
    trust-and-verification/
    content-moderation/
    local-discovery/
  lib/
    prisma.ts
    supabase/
```

### Development Environment

Ambiente locale con Next.js in dev mode, connessione a Supabase project e Prisma collegato a PostgreSQL Supabase.

**Required tools:** Node.js LTS, npm, Prisma CLI, account Supabase, Git

### CI/CD & Deployment

**Build tool:** Next.js build pipeline + npm scripts

**Pipeline:** lint -> test -> build -> deploy

**Deployment:** deploy automatico branch `main` su Vercel; servizi dati/autenticazione su Supabase

**Target infrastructure:** Vercel (frontend/app runtime) + Supabase Cloud (Auth, DB, Storage)

### Architecture Decision Records (ADR)

- ADR-001: Mantenere stack boilerplate (Next.js + Supabase + Prisma + Tailwind + shadcn) per velocita e coerenza.
- ADR-002: Preferire modular monolith per MVP rispetto a microservizi per limitare complessita operativa.
- ADR-003: Fiducia come capability core (verifica + recensioni + moderazione) prima di funzionalita avanzate.

---

## Functional Requirements

**Area: Account, Trust e Community**

- FR1. Il sistema deve consentire registrazione e autenticazione utenti famiglia.
- FR2. Il sistema deve supportare stato "identita verificata" visibile nel profilo pubblico.
- FR3. Il sistema deve consentire agli utenti di lasciare recensioni reciproche dopo uno scambio/vendita conclusa.

**Area: Annunci Giocattoli**

- FR4. L'utente deve poter creare, modificare, archiviare e riattivare annunci di giocattoli.
- FR5. Ogni annuncio deve includere almeno: titolo, descrizione, fascia d'eta, condizione, foto, localita.
- FR6. Il sistema deve consentire di indicare se l'annuncio e disponibile per scambio, vendita o entrambi.

**Area: Ricerca e Scoperta Locale**

- FR7. Gli utenti devono poter cercare annunci per parola chiave e filtrarli per distanza, fascia d'eta e categoria.
- FR8. Il sistema deve mostrare risultati ordinabili per prossimita geografica e data pubblicazione.

**Area: Scambio e Comunicazione**

- FR9. Il sistema deve offrire una chat tra utenti, collegata a un annuncio, per concordare i dettagli di scambio o vendita.
- FR10. Gli utenti devono poter proporre e accettare/rifiutare uno scambio tramite flusso guidato in chat.

**Area: Moderazione e Qualita**

- FR11. Il sistema deve applicare moderazione automatica base su contenuti annuncio (testo/immagini) con segnalazione anomalie.
- FR12. Gli amministratori devono poter intervenire manualmente su annunci segnalati (approva, oscura, rimuovi).

**Area: Monetizzazione**

- FR13. Il sistema deve consentire l'acquisto di una funzionalita di aumento visibilita dell'annuncio.
- FR14. Il sistema deve supportare la visualizzazione di annunci promozionali in spazi dedicati non invasivi.

---

## Non-Functional Requirements

### Security

- NFR-S1. I dati personali devono essere trattati secondo GDPR con policy privacy e gestione consenso.
- NFR-S2. Solo utenti autenticati possono avviare chat e pubblicare annunci.
- NFR-S3. Le operazioni sensibili devono essere protette da controlli autorizzativi server-side.
- NFR-S4. Le immagini caricate devono essere validate e sottoposte a controlli base anti-abuso.

### Integrations

- NFR-I1. Integrazione con Supabase Auth per gestione identita e sessioni.
- NFR-I2. Integrazione con Supabase Storage per asset media annunci.
- NFR-I3. Integrazione database PostgreSQL tramite Prisma come unico layer ORM applicativo.
- NFR-I4. Il sistema deve poter integrare in futuro servizi terzi di verifica identita senza rifattorizzazioni invasive.

---

## Next Steps

1. **UX Design** — Define detailed interaction flows and wireframes for MVP features
2. **Detailed Architecture** — Deepen technical decisions on critical areas
3. **Backlog** — Decompose functional requirements into epics and user stories
4. **Validation** — Review with stakeholders and test the riskiest business assumptions

---

_PRD generated via Archetipo Product Inception — 2026-05-06_
_Session conducted by: User with the Archetipo team_
