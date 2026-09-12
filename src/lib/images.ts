// Category -> background color used by locally-generated placeholder images,
// so listing cards read as visually varied (gold/brown/blue/…) instead of a
// flat neutral tone, without depending on any real uploaded photography.
const CATEGORY_COLORS: Record<string, string> = {
  lighting: '#C9992C',
  furniture: '#8B5E34',
  pools: '#3B6EA5',
  electrical: '#46586B',
  plumbing: '#2F7A78',
  painting: '#B5622E',
  hvac: '#4A90C4',
  kitchen: '#A47551',
  landscaping: '#3F7D4F',
  'interior-design': '#6B5B95',
  security: '#2A3F66',
  cleaning: '#2E8B9A',
};

export const PLACEHOLDER_PALETTE = Object.values(CATEGORY_COLORS);

export function categoryColor(slug?: string | null): string | undefined {
  return slug ? CATEGORY_COLORS[slug] : undefined;
}

export function firstImage(
  images: string | null | undefined,
  fallbackLabel: string,
  seed?: string,
  categorySlug?: string | null,
) {
  if (images) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0] as string;
    } catch {
      // not JSON — treat as a single direct URL
      if (images.trim()) return images;
    }
  }
  const params = new URLSearchParams({ seed: seed || fallbackLabel });
  if (categorySlug) params.set('cat', categorySlug);
  return `/api/placeholder/${encodeURIComponent(fallbackLabel.slice(0, 2))}?${params.toString()}`;
}
