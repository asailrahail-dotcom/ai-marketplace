export function firstImage(images: string | null | undefined, fallbackLabel: string, seed?: string) {
  if (images) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0] as string;
    } catch {
      // not JSON — treat as a single direct URL
      if (images.trim()) return images;
    }
  }
  return `/api/placeholder/${encodeURIComponent(fallbackLabel.slice(0, 2))}?seed=${encodeURIComponent(
    seed || fallbackLabel,
  )}`;
}
