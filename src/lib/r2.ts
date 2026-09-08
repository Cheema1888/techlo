import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface R2Config {
  bucketName: string;
  publicUrl: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

let cachedClient: S3Client | null = null;

function requireServerEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for Cloudflare R2 operations`);
  }
  return value;
}

function getR2Config(): R2Config {
  return {
    accountId: requireServerEnv("R2_ACCOUNT_ID"),
    accessKeyId: requireServerEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireServerEnv("R2_SECRET_ACCESS_KEY"),
    bucketName: requireServerEnv("R2_BUCKET_NAME"),
    publicUrl: requireServerEnv("R2_PUBLIC_URL").replace(/\/$/, ""),
  };
}

function getR2Client(): { client: S3Client; config: R2Config } {
  const config = getR2Config();
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return { client: cachedClient, config };
}

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
  const { client, config } = getR2Client();

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: params.objectKey,
    ContentType: params.contentType,
    ContentLength: params.sizeBytes,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = `${config.publicUrl}/${params.objectKey}`;

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
export async function verifyR2Object(objectKey: string): Promise<{
  exists: boolean;
  sizeBytes?: number;
  contentType?: string;
  etag?: string;
  isWebP?: boolean;
}> {
  try {
    const { client, config } = getR2Client();
    const command = new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
    });
    const response = await client.send(command);
    const firstBytesResponse = await client.send(
      new GetObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        Range: "bytes=0-11",
      })
    );
    const firstBytes = await firstBytesResponse.Body?.transformToByteArray();
    const isWebP = Boolean(
      firstBytes &&
        firstBytes.length >= 12 &&
        Buffer.from(firstBytes.subarray(0, 4)).toString("ascii") === "RIFF" &&
        Buffer.from(firstBytes.subarray(8, 12)).toString("ascii") === "WEBP"
    );

    return {
      exists: true,
      sizeBytes: response.ContentLength,
      contentType: response.ContentType,
      etag: response.ETag,
      isWebP,
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
    const { client, config } = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
    });
    await client.send(command);
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
  try {
    const candidate = new URL(url);
    const allowedOrigins = new Set(["https://images.unsplash.com"]);
    const configuredPublicUrl = process.env.R2_PUBLIC_URL?.trim();
    if (configuredPublicUrl) {
      allowedOrigins.add(new URL(configuredPublicUrl).origin);
    }
    return candidate.protocol === "https:" && allowedOrigins.has(candidate.origin);
  } catch {
    return false;
  }
}

/**
 * Uploads a WebP buffer directly to Cloudflare R2 from server
 */
export async function uploadR2Buffer(params: {
  objectKey: string;
  contentType: string;
  buffer: Buffer | Uint8Array;
}): Promise<string> {
  const { client, config } = getR2Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: params.objectKey,
    ContentType: params.contentType,
    Body: params.buffer,
    CacheControl: "public, max-age=31536000, immutable",
  });
  await client.send(command);
  return `${config.publicUrl}/${params.objectKey}`;
}
