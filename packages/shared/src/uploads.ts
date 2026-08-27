export const DEFAULT_UPLOAD_LIMIT_BYTES = 5 * 1024 * 1024;

export type UploadPolicy = {
  maxBytes: number;
  acceptedMimeTypes: readonly string[];
};

export type UploadValidation = { ok: true } | { ok: false; reason: string };

export const DEFAULT_UPLOAD_POLICY: UploadPolicy = {
  maxBytes: DEFAULT_UPLOAD_LIMIT_BYTES,
  acceptedMimeTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf", "text/csv"]
};

export function validateUpload(file: Pick<File, "size" | "type" | "name">, policy: UploadPolicy = DEFAULT_UPLOAD_POLICY): UploadValidation {
  if (file.size <= 0) return { ok: false, reason: "The selected file is empty." };
  if (file.size > policy.maxBytes) return { ok: false, reason: `File exceeds the ${Math.round(policy.maxBytes / 1024 / 1024)} MB limit.` };
  if (!policy.acceptedMimeTypes.includes(file.type)) return { ok: false, reason: `Unsupported file type: ${file.type || file.name}.` };
  return { ok: true };
}
