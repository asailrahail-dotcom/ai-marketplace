import { NextRequest } from 'next/server';
import { categoryColor, PLACEHOLDER_PALETTE } from '@/lib/images';

// Deterministic, locally-generated placeholder image (no external network
// call, no stock-photo licensing questions) used whenever a listing has no
// uploaded image. Purely a neutral visual placeholder — never presented as
// real product photography. Colored by category when known, so cards read
// as visually varied rather than a single flat tone.
export async function GET(req: NextRequest, { params }: { params: { label: string } }) {
  const label = decodeURIComponent(params.label || '').slice(0, 2).toUpperCase() || '؟';
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get('seed') || label;
  const cat = searchParams.get('cat');

  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const bg = categoryColor(cat) || PLACEHOLDER_PALETTE[hash % PLACEHOLDER_PALETTE.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${bg}" />
    <text x="400" y="330" font-family="system-ui, sans-serif" font-size="120" font-weight="700" fill="#ffffff" fill-opacity="0.32" text-anchor="middle">${label}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
