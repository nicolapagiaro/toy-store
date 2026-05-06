"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendMessageAction, type SendMessageActionState } from "./actions";
import styles from "./chat-page.module.css";

export function SendMessageForm({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState(sendMessageAction, {} as SendMessageActionState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!pending && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [pending]);

  return (
    <form action={action} className={styles.messageInputArea}>
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className={styles.messageInputWrap}>
        {state.error && <p className={styles.errorText}>{state.error}</p>}
        <textarea
          ref={textareaRef}
          name="content"
          className={styles.messageTextarea}
          placeholder="Scrivi un messaggio…"
          rows={1}
          required
        />
      </div>
      <button type="submit" className={styles.btnSend} disabled={pending} aria-label="Invia messaggio">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
