"use client";

import { useActionState } from "react";
import { startChatAction, type StartChatActionState } from "./actions";
import styles from "./ad-page.module.css";

export function StartChatForm({ toyAdId, ownerName }: { toyAdId: string; ownerName: string }) {
  const [state, action, pending] = useActionState(startChatAction, {} as StartChatActionState);

  return (
    <form action={action}>
      <input type="hidden" name="toyAdId" value={toyAdId} />
      {state.error && <p className={styles.errorText}>{state.error}</p>}
      <button type="submit" className={`${styles.btn} ${styles.btnEmerald}`} disabled={pending}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          style={{ flexShrink: 0 }}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {pending ? "Apertura chat..." : `Avvia chat con ${ownerName}`}
      </button>
    </form>
  );
}
