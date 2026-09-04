import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "4af06d676c9f067d4e81091b82fe348f";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "8d15aee04693ef07e902f725625be42f";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "9863b823226725e87279e615b9af8ea812ddead57e82cc77f895dff5ca9e0160";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "techlo-images";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "https://pub-72533f33b103419dbe1a3311b5cb6de6.r2.dev").replace(/\/$/, "");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export interface PresignedUploadParams {
  objectKey: string;
  contentType: string;
  sizeBytes: number;
  expiresInSeconds?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresIn: number;
}

/**
 * Generates a pre-signed PUT URL for direct-to-R2 upload
 */
export async function createR2PresignedUpload(params: PresignedUploadParams): Promise<PresignedUploadResult> {
  const expiresIn = params.expiresInSeconds || 300; // 5 minutes

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.objectKey,
    ContentType: params.contentType,
    ContentLength: params.sizeBytes,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const publicUrl = `${R2_PUBLIC_URL}/${params.objectKey}`;

  return {
    uploadUrl,
    publicUrl,
    objectKey: params.objectKey,
    expiresIn,
  };
}

/**
 * Confirms that an object exists in R2 and returns its metadata
 */
export async function verifyR2Object(objectKey: string): Promise<{ exists: boolean; sizeBytes?: number; contentType?: string; etag?: string }> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });
    const response = await r2Client.send(command);
    return {
      exists: true,
      sizeBytes: response.ContentLength,
      contentType: response.ContentType,
      etag: response.ETag,
    };
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }
    console.error("verifyR2Object error:", error);
    return { exists: false };
  }
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteR2Object(objectKey: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });
    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error("deleteR2Object error:", error);
    return false;
  }
}

/**
 * Validates whether an image URL originates from an approved domain
 */
export function isApprovedImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const approvedPrefixes = [
    R2_PUBLIC_URL,
    "https://images.techlo.store",
    "https://pub-72533f33b103419dbe1a3311b5cb6de6.r2.dev",
    "https://images.unsplash.com",
  ];
  return approvedPrefixes.some((prefix) => url.startsWith(prefix));
}
