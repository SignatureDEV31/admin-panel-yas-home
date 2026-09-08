/**
 * Utility functions for Image Preview Modal
 */

export interface DownloadImageOptions {
  url: string;
  title?: string;
  fallbackId?: string | number;
}

/**
 * Computes a safe image filename with an appropriate image extension.
 */
export function getSafeImageFilename(
  url: string,
  title?: string,
  fallbackId?: string | number
): string {
  const rawFilename =
    title ||
    url.split("/").pop()?.split("?")[0] ||
    `photo-${fallbackId ?? Date.now()}.jpg`;

  return /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(rawFilename)
    ? rawFilename
    : `${rawFilename}.jpg`;
}

/**
 * Downloads an image directly to the user's filesystem as a file.
 * Avoids opening new tabs by trying client-side blob download first,
 * falling back to a same-origin attachment proxy route, and finally an iframe.
 */
export async function downloadImage({
  url,
  title,
  fallbackId,
}: DownloadImageOptions): Promise<void> {
  if (!url) return;

  const safeFilename = getSafeImageFilename(url, title, fallbackId);
  const proxyUrl = `/api/download-image?url=${encodeURIComponent(
    url
  )}&name=${encodeURIComponent(safeFilename)}`;

  try {
    // Attempt 1: Direct client fetch for same-origin or CORS-enabled images
    let blob: Blob | null = null;
    try {
      const response = await fetch(url, { mode: "cors" });
      if (response.ok) {
        blob = await response.blob();
      }
    } catch {
      // Direct fetch failed (e.g. cross-origin CORS restriction)
    }

    // Attempt 2: Server-side download proxy route on same origin
    if (!blob) {
      const proxyRes = await fetch(proxyUrl);
      if (proxyRes.ok) {
        blob = await proxyRes.blob();
      }
    }

    if (blob) {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } else {
      triggerIframeDownload(proxyUrl);
    }
  } catch (err) {
    console.error("Error downloading image:", err);
    triggerIframeDownload(proxyUrl);
  }
}

/**
 * Triggers a download via a hidden detached iframe without opening a new tab.
 */
function triggerIframeDownload(proxyUrl: string): void {
  if (typeof document === "undefined") return;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = proxyUrl;
  document.body.appendChild(iframe);
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 30000);
}
