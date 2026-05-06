export const MEDIA_BUCKET = "app-media";

export const MEDIA_OBJECT_PREFIX = {
  TOY_AD: "toy-ad",
} as const;

export function buildMediaObjectPath(args: {
  modelPrefix: string;
  modelId: string;
  attachmentName: string;
  fileName: string;
}) {
  return `${args.modelPrefix}/${args.modelId}/${args.attachmentName}/${args.fileName}`;
}
