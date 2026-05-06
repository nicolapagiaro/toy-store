import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { NewAdForm } from "./new-ad-form";

export default async function NewToyAdPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  return <NewAdForm />;
}
