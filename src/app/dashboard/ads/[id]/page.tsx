import { redirect } from "next/navigation";

export default async function ToyAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/ads/${id}`);
}
