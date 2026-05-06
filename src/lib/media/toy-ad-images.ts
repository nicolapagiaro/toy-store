import { createClient } from "@/lib/supabase/server";
import { MEDIA_BUCKET } from "./storage";

export type ToyAdImage = {
  path: string;
  url: string;
};

const DEFAULT_SIGNED_URL_EXPIRES_IN_SECONDS = 3600;

export async function getToyAdSignedImages(
  imagePaths: string[],
  expiresInSeconds = DEFAULT_SIGNED_URL_EXPIRES_IN_SECONDS
): Promise<ToyAdImage[]> {
  const supabase = await createClient();

  return Promise.all(
    imagePaths.map(async (path) => {
      const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, expiresInSeconds);

      return {
        path,
        url: data?.signedUrl ?? "",
      };
    })
  );
}
