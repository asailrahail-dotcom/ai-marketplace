/**
 * Rule-based Arabic project-needs extractor.
 *
 * This module turns free-text project descriptions into structured data
 * (project type, stage, list of needs mapped to real marketplace category
 * slugs) using keyword dictionaries — no external API call, no fabricated
 * data. If ANTHROPIC_API_KEY is configured, callers may later swap in a real
 * model call; this deterministic fallback keeps the feature honest and
 * fully functional without any key.
 */

export interface ExtractedNeed {
  label: string;
  categorySlug: string | null;
  estimatedQuantity?: number;
}

export interface ExtractedProjectNeeds {
  projectType: string | null;
  projectStage: string | null;
  needs: ExtractedNeed[];
}

const PROJECT_TYPES: { match: string[]; label: string }[] = [
  { match: ['شاليه'], label: 'شاليه' },
  { match: ['فيلا', 'فلة'], label: 'فيلا' },
  { match: ['شقة', 'شقه'], label: 'شقة' },
  { match: ['مطعم', 'كافيه', 'مقهى'], label: 'مطعم / مقهى' },
  { match: ['مكتب', 'شركة'], label: 'مكتب' },
  { match: ['محل', 'معرض'], label: 'محل تجاري' },
  { match: ['مزرعة', 'استراحة'], label: 'مزرعة / استراحة' },
  { match: ['موقع بناء', 'مبنى', 'عمارة'], label: 'مبنى' },
];

const PROJECT_STAGES: { match: string[]; label: string }[] = [
  { match: ['من الصفر', 'تأسيس', 'بناء جديد'], label: 'تأسيس' },
  { match: ['تجهيز', 'تأثيث', 'فرش'], label: 'تجهيز' },
  { match: ['تجديد', 'ترميم', 'تطوير'], label: 'تجديد' },
  { match: ['صيانة', 'إصلاح'], label: 'صيانة' },
];

const NEED_KEYWORDS: { match: string[]; label: string; categorySlug: string }[] = [
  { match: ['إضاءة', 'اضاءة', 'ليد', 'انارة', 'إنارة'], label: 'إضاءة', categorySlug: 'lighting' },
  { match: ['أثاث', 'اثاث', 'كنب', 'طاولات', 'كراسي'], label: 'أثاث', categorySlug: 'furniture' },
  { match: ['مسبح', 'بركة سباحة'], label: 'مسبح', categorySlug: 'pools' },
  { match: ['كهرباء', 'كهربائي', 'كهرب'], label: 'كهرباء', categorySlug: 'electrical' },
  { match: ['سباك', 'سباكة', 'صحي'], label: 'سباكة', categorySlug: 'plumbing' },
  { match: ['دهان', 'طلاء', 'صبغ'], label: 'دهانات', categorySlug: 'painting' },
  { match: ['تكييف', 'مكيف', 'تبريد'], label: 'تكييف', categorySlug: 'hvac' },
  { match: ['مطبخ'], label: 'مطبخ', categorySlug: 'kitchen' },
  { match: ['حدائق', 'تنسيق', 'نخل', 'زراعة'], label: 'تنسيق حدائق', categorySlug: 'landscaping' },
  { match: ['ديكور', 'تصميم داخلي'], label: 'ديكور', categorySlug: 'interior-design' },
  { match: ['أمن', 'كاميرات', 'مراقبة'], label: 'أنظمة أمن', categorySlug: 'security' },
  { match: ['نظافة', 'تنظيف'], label: 'خدمات تنظيف', categorySlug: 'cleaning' },
];

function includesAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t));
}

export function extractProjectNeeds(rawInput: string): ExtractedProjectNeeds {
  const text = rawInput.trim();

  const projectType = PROJECT_TYPES.find((p) => includesAny(text, p.match))?.label ?? null;
  const projectStage = PROJECT_STAGES.find((s) => includesAny(text, s.match))?.label ?? null;

  const needs: ExtractedNeed[] = NEED_KEYWORDS.filter((n) => includesAny(text, n.match)).map((n) => {
    // Light heuristic: a number written close to one of this need's keywords
    // is treated as an estimated quantity (e.g. "20 كرسي" -> 20). This is a
    // rough estimate only, never a binding spec — the UI must say so.
    let estimatedQuantity: number | undefined;
    for (const kw of n.match) {
      const idx = text.indexOf(kw);
      if (idx === -1) continue;
      const windowText = text.slice(Math.max(0, idx - 12), idx + kw.length + 4);
      const numMatch = windowText.match(/\d+/);
      if (numMatch) {
        estimatedQuantity = parseInt(numMatch[0], 10);
        break;
      }
    }
    return { label: n.label, categorySlug: n.categorySlug, estimatedQuantity };
  });

  return { projectType, projectStage, needs };
}
