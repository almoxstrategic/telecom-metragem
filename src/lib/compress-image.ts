import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

export async function compressEvidencePhoto(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    const baseName = file.name.replace(/\.[^.]+$/, "") || "evidencia";
    const ext = compressed.type.split("/")[1] || "jpg";
    return new File([compressed], `${baseName}.${ext}`, {
      type: compressed.type || file.type,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
