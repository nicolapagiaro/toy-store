import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MEDIA_BUCKET } from "@/lib/media/storage";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";

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

export default async function ToyAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  const { id } = await params;

  const ad = await prisma.toyAd.findUnique({
    where: { id },
  });

  if (!ad || ad.ownerId !== user.id) {
    notFound();
  }

  const location = ad.district ? `${ad.city} - ${ad.district}` : ad.city;
  const createdDate = new Intl.DateTimeFormat("it-IT", { dateStyle: "long" }).format(ad.createdAt);
  const supabase = await createClient();
  const images = ad.imagePaths.map((path) => ({
    path,
    url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl,
  }));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between rounded-3xl border bg-white p-6">
        <div>
          <h1 className="text-3xl font-bold">Annuncio pubblicato con successo</h1>
          <p className="text-muted-foreground mt-2">
            Il tuo annuncio e ora visibile nel marketplace con tutti i dati inseriti.
          </p>
        </div>
        <Link href="/dashboard/ads/new" className="rounded-full border px-4 py-2 text-sm font-semibold">
          Crea un altro annuncio
        </Link>
      </header>

      <article className="rounded-3xl border bg-white p-6">
        <div className="mb-3 flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-emerald-100 px-3 py-1">Pubblicato</span>
          <span className="rounded-full bg-teal-100 px-3 py-1">{ageRangeLabels[ad.ageRange]}</span>
          <span className="rounded-full bg-amber-100 px-3 py-1">{conditionLabels[ad.condition]}</span>
        </div>
        <h2 className="text-2xl font-bold">{ad.title}</h2>
        <p className="text-muted-foreground mt-2">{ad.description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border p-3 text-sm">
            <div className="font-semibold">Localita</div>
            <div>{location}</div>
          </div>
          <div className="rounded-xl border p-3 text-sm">
            <div className="font-semibold">Data pubblicazione</div>
            <div>{createdDate}</div>
          </div>
          <div className="rounded-xl border p-3 text-sm md:col-span-2">
            <div className="font-semibold">Foto caricate</div>
            <div>{ad.imagePaths.length}</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.path} className="overflow-hidden rounded-xl border bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={ad.title} className="h-44 w-full object-cover" />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
