import { prisma } from '@/lib/db';

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  discoverTitle: string;
  discoverSubtitle: string;
}

const DEFAULT_HOMEPAGE: HomepageContent = {
  heroTitle: 'وش مشروعك؟ وش تحتاج؟',
  heroSubtitle: 'اكتب احتياجك، وخلي مشروع يساعدك تلقى المنتجات والموردين والخدمات المناسبة.',
  discoverTitle: 'اكتشف المنتجات والموردين والخدمات',
  discoverSubtitle: 'كل ما تحتاجه لمشروعك، في مكان واحد.',
};

export async function getHomepageContent(): Promise<HomepageContent> {
  const row = await prisma.siteContent.findUnique({ where: { key: 'homepage' } });
  if (!row) return DEFAULT_HOMEPAGE;
  try {
    return { ...DEFAULT_HOMEPAGE, ...JSON.parse(row.value) };
  } catch {
    return DEFAULT_HOMEPAGE;
  }
}
