import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MEDIA_BUCKET } from "@/lib/media/storage";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { SendMessageForm } from "./send-message-form";
import styles from "./chat-page.module.css";

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

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      toyAd: {
        select: { id: true, title: true, ageRange: true, condition: true, city: true, district: true, imagePaths: true },
      },
      buyer: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  if (!conversation) notFound();

  const isParticipant = conversation.buyerId === user.id || conversation.ownerId === user.id;
  if (!isParticipant) notFound();

  const supabase = await createClient();
  const firstImageUrl =
    conversation.toyAd.imagePaths[0]
      ? supabase.storage.from(MEDIA_BUCKET).getPublicUrl(conversation.toyAd.imagePaths[0]).data.publicUrl
      : null;

  const adLocation = conversation.toyAd.district
    ? `${conversation.toyAd.city}, ${conversation.toyAd.district}`
    : conversation.toyAd.city;

  const otherUser = user.id === conversation.buyerId ? conversation.owner : conversation.buyer;
  const otherUserName = otherUser.name ?? "Utente";
  const otherUserInitial = otherUserName[0].toUpperCase();

  const currentUserInitial = (user.name ?? user.email ?? "U")[0].toUpperCase();

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(date);

  return (
    <div className={styles.pageShell}>
      <header className={styles.topNav}>
        <h1 className={styles.brand}>Toy Store</h1>
        <nav>
          <Link className={styles.ghostLink} href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>

      <nav className={styles.breadcrumb}>
        <Link href="/dashboard">Dashboard</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>Le mie chat</span>
        <span className={styles.breadcrumbSep}>/</span>
        <span>
          {otherUserName} — {conversation.toyAd.title}
        </span>
      </nav>

      <div className={styles.chatLayout}>
        <main>
          <div className={`${styles.panel} ${styles.chatPanel}`}>
            {/* Ad reference card */}
            <div className={styles.adRefCard}>
              {firstImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={firstImageUrl} alt={conversation.toyAd.title} className={styles.adRefThumb} />
              ) : (
                <div className={styles.adRefThumbPlaceholder} />
              )}
              <div className={styles.adRefInfo}>
                <div className={styles.adRefLabel}>Annuncio collegato</div>
                <div className={styles.adRefTitle}>{conversation.toyAd.title}</div>
                <div className={styles.adRefMeta}>
                  <span className={`${styles.adRefBadge} ${styles.adRefBadgeAccent}`}>
                    {conditionLabels[conversation.toyAd.condition]}
                  </span>
                  <span className={`${styles.adRefBadge} ${styles.adRefBadgeSecondary}`}>
                    {ageRangeLabels[conversation.toyAd.ageRange]}
                  </span>
                  {adLocation}
                </div>
              </div>
              <Link href={`/ads/${conversation.toyAdId}`} className={styles.adRefLink}>
                Vedi annuncio
              </Link>
            </div>

            {/* Messages */}
            <div className={styles.messagesList}>
              {conversation.messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>💬</span>
                  <span>Nessun messaggio ancora. Inizia la conversazione!</span>
                </div>
              ) : (
                conversation.messages.map((msg) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`${styles.messageGroup} ${isMine ? styles.messageGroupMine : ""}`}
                    >
                      <div className={`${styles.avatar} ${isMine ? styles.avatarTeal : styles.avatarPink}`}>
                        {isMine ? currentUserInitial : otherUserInitial}
                      </div>
                      <div className={styles.messageBubbleWrap}>
                        {!isMine && (
                          <div className={styles.messageSender}>{msg.sender.name ?? "Utente"}</div>
                        )}
                        <div className={`${styles.messageBubble} ${isMine ? styles.messageBubbleMine : ""}`}>
                          {msg.content}
                        </div>
                        <div className={`${styles.messageMeta} ${isMine ? styles.messageMetaMine : ""}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message input */}
            <SendMessageForm conversationId={id} />
          </div>
        </main>

        <aside>
          {/* Other user info */}
          <section className={`${styles.panel} ${styles.sellerCard}`}>
            <h3 className={styles.sideTitle}>Stai chattando con</h3>
            <div className={styles.sellerHeader}>
              <div className={`${styles.sideAvatar} ${styles.sideAvatarPink}`}>{otherUserInitial}</div>
              <div>
                <div className={styles.sellerName}>{otherUserName}</div>
              </div>
            </div>
            <div className={styles.infoBox}>Usa la chat in-app per tutti i dettagli dello scambio.</div>
          </section>

          {/* Ad summary */}
          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Annuncio di riferimento</h3>
            <article className={styles.adSummaryCard}>
              {firstImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={firstImageUrl} alt={conversation.toyAd.title} className={styles.adSummaryImage} />
              ) : (
                <div className={styles.adSummaryImagePlaceholder} />
              )}
              <div className={styles.adSummaryBody}>
                <div className={styles.adSummaryBadgeRow}>
                  <span className={`${styles.adSummaryBadge} ${styles.adSummaryBadgeSecondary}`}>
                    {ageRangeLabels[conversation.toyAd.ageRange]}
                  </span>
                  <span className={`${styles.adSummaryBadge} ${styles.adSummaryBadgeAccent}`}>
                    {conditionLabels[conversation.toyAd.condition]}
                  </span>
                </div>
                <div className={styles.adSummaryTitle}>{conversation.toyAd.title}</div>
                <p className={styles.adSummaryMeta}>{adLocation}</p>
              </div>
            </article>
            <Link href={`/ads/${conversation.toyAdId}`} className={styles.btnOutline}>
              Apri annuncio completo
            </Link>
          </section>

          {/* Safety tips */}
          <section className={`${styles.panel} ${styles.sideCard}`}>
            <h3 className={styles.sideTitle}>Scambio sicuro</h3>
            <ul className={styles.hintList}>
              <li>Incontra in un luogo pubblico</li>
              <li>Controlla il giocattolo prima del ritiro</li>
              <li>Non condividere dati personali via chat</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
