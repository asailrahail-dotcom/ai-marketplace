// Demo content for the MVP.
//
// Qur'an verses below are transcribed from widely known, short ayat and are
// cited with surah name + ayah number. They are a small curated set for this
// trial version, pending integration of a verified Qur'an API/source before
// any public release (see README). Reflection lines are app-authored notes,
// not tafsir, and are always shown separately from the verse text itself.

export interface Ayah {
  id: string;
  surah: string;
  ayahRef: string;
  text: string;
  reflection: string;
}

export interface Blessing {
  id: string;
  text: string;
  question: string;
}

export interface Question {
  id: string;
  text: string;
}

export interface AtharItem {
  id: string;
  text: string;
}

export interface MomentPrompt {
  id: string;
  lead: string;
  breathText: string;
  question: string;
}

export interface DuaItem {
  id: string;
  surah: string;
  ayahRef: string;
  text: string;
}

export const AYAT: Ayah[] = [
  {
    id: 'ayah-1',
    surah: 'سورة الشرح',
    ayahRef: 'الآيتان 5-6',
    text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    reflection: 'مهما طال الضيق، فالوعد الإلهي واضح: مع كل عسر يُسر مرافق له، لا يُسر يتبعه فقط.',
  },
  {
    id: 'ayah-2',
    surah: 'سورة البقرة',
    ayahRef: 'الآية 152',
    text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    reflection: 'الذكر ليس عبئًا إضافيًا على يومك، بل دعوة مفتوحة لحضور قلبي بسيط في أي لحظة.',
  },
  {
    id: 'ayah-3',
    surah: 'سورة الرعد',
    ayahRef: 'من الآية 28',
    text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    reflection: 'حين يضيق صدرك، جرّب أن ترجع بقلبك إلى الله قبل أن تبحث عن الطمأنينة في أي مكان آخر.',
  },
  {
    id: 'ayah-4',
    surah: 'سورة إبراهيم',
    ayahRef: 'من الآية 7',
    text: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    reflection: 'الشكر ليس ردّ فعل بعد النعمة فقط، بل سبب حقيقي لمزيد منها.',
  },
  {
    id: 'ayah-5',
    surah: 'سورة الطلاق',
    ayahRef: 'الآيتان 2-3',
    text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    reflection: 'التقوى ليست تشددًا، بل طريق يفتح مخارج لم تكن تتخيلها.',
  },
  {
    id: 'ayah-6',
    surah: 'سورة طه',
    ayahRef: 'من الآية 114',
    text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    reflection: 'دعاء قصير يذكّرك أن طلب المعرفة عبادة، وأن الوعي نفسه بداية علم.',
  },
  {
    id: 'ayah-7',
    surah: 'سورة البقرة',
    ayahRef: 'من الآية 186',
    text: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    reflection: 'لست بحاجة إلى وسيط ولا إلى وقت خاص؛ القرب أقرب مما تظن.',
  },
  {
    id: 'ayah-8',
    surah: 'سورة الضحى',
    ayahRef: 'الآية 5',
    text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    reflection: 'وعد يستحق أن تحمله معك في الأيام التي يتأخر فيها الجواب الذي تنتظره.',
  },
];

export const BLESSINGS: Blessing[] = [
  {
    id: 'blessing-1',
    text: 'توقف لحظة والتفت إلى نعمة البصر التي تقرأ بها هذه الكلمات الآن.',
    question: 'متى آخر مرة شكرت الله فيها على نعمة عينيك؟',
  },
  {
    id: 'blessing-2',
    text: 'أنت الآن تتنفس دون أن تفكر في الأمر، وهذه بذاتها نعمة مستمرة لا تتوقف.',
    question: 'كم نفَسًا أخذته اليوم دون أن تشعر بقيمته؟',
  },
  {
    id: 'blessing-3',
    text: 'هناك شخص واحد على الأقل في حياتك يسأل عنك أو يحبك دون مقابل.',
    question: 'من هو هذا الشخص، وهل أخبرته مؤخرًا أنك تقدّره؟',
  },
  {
    id: 'blessing-4',
    text: 'لديك سقف يؤويك الليلة، وهذا ليس أمرًا مسلَّمًا به للجميع.',
    question: 'ما هو الشعور الذي يمنحك إياه الأمان في مكانك؟',
  },
  {
    id: 'blessing-5',
    text: 'قدرتك على التفكير والاختيار والتعلم نعمة عقلية قد تمر دون التفات.',
    question: 'ما آخر شيء تعلمته وسعدت به؟',
  },
  {
    id: 'blessing-6',
    text: 'صوتك القادر على الكلام، وسمعك القادر على الإصغاء، نعمتان متلازمتان.',
    question: 'من كان آخر شخص أصغيت إليه اليوم بصدق؟',
  },
  {
    id: 'blessing-7',
    text: 'جسدك يعمل الآن بتناغم دقيق — قلب ينبض، ودم يجري، دون أن تديره أنت.',
    question: 'ما الذي يمكن أن تشكر الله عليه في جسدك تحديدًا اليوم؟',
  },
  {
    id: 'blessing-8',
    text: 'وصلت إلى هذه اللحظة رغم كل ما مررت به، وهذا بحد ذاته نعمة استمرار.',
    question: 'ما أكثر شيء تشعر بالامتنان له اليوم دون أن يكون ماديًا؟',
  },
];

export const QUESTIONS: Question[] = [
  { id: 'q-1', text: 'ما الشيء الذي كنت تعرفه اليوم عن الله، لكنك نسيت أن تعيشه فعلًا؟' },
  { id: 'q-2', text: 'لو كان اليوم آخر يوم في حياتك، ما الذي كنت ستفعله بشكل مختلف؟' },
  { id: 'q-3', text: 'ما هو الخوف الذي يشغل قلبك الآن، وهل وضعته بين يدي الله؟' },
  { id: 'q-4', text: 'متى شعرت اليوم بأنك قريب من الله، ولو للحظة واحدة؟' },
  { id: 'q-5', text: 'ما العادة الصغيرة التي تودّ أن تبدأها لتكون أكثر وعيًا بربك؟' },
  { id: 'q-6', text: 'من الشخص الذي أثّر في إيمانك، وهل دعوت له مؤخرًا؟' },
  { id: 'q-7', text: 'ما الذي يشتت قلبك عن الحضور مع الله أكثر من غيره هذه الأيام؟' },
  { id: 'q-8', text: 'ما معنى السكينة بالنسبة لك، وكيف تبدو في يوم عادي؟' },
];

export const ATHAR: AtharItem[] = [
  { id: 'athar-1', text: 'ابعث رسالة لشخص لم تتواصل معه منذ فترة، دون سبب سوى المحبة.' },
  { id: 'athar-2', text: 'ساعد أحدًا اليوم دون أن تخبره أنك من فعل ذلك.' },
  { id: 'athar-3', text: 'اتصل بأحد والديك أو من يقوم مقامهما، واسأله عن حاله فقط.' },
  { id: 'athar-4', text: 'ابتسم في وجه أول شخص تقابله اليوم، دون سبب معلن.' },
  { id: 'athar-5', text: 'اترك تعليقًا أو كلمة تشجيع صادقة لشخص يعمل بجهد بصمت.' },
  { id: 'athar-6', text: 'تصدّق بأي مبلغ، مهما كان صغيرًا، دون أن تخطط لذلك مسبقًا.' },
  { id: 'athar-7', text: 'اطلب السماح ممن تشعر أنك قصّرت معه، حتى لو كان الأمر بسيطًا.' },
  { id: 'athar-8', text: 'امنح نفسك اليوم استراحة حقيقية دون شعور بالذنب.' },
];

export const MOMENTS: MomentPrompt[] = [
  {
    id: 'moment-1',
    lead: 'اجلس في مكان هادئ، وأرخِ كتفيك.',
    breathText: 'خذ نفَسًا عميقًا... واحبسه قليلًا... ثم أخرجه ببطء.',
    question: 'استحضر أن الله يراك الآن، بلا حاجة لكلمات كثيرة.',
  },
  {
    id: 'moment-2',
    lead: 'ضع يدك على صدرك، واشعر بنبض قلبك.',
    breathText: 'تنفّس ببطء ثلاث مرات، وامنح نفسك إذنًا بالتوقف قليلًا.',
    question: 'من يحرّك هذا القلب دون أن تأمره أنت؟',
  },
  {
    id: 'moment-3',
    lead: 'أغلق عينيك للحظات، وابتعد عن كل شاشة أمامك.',
    breathText: 'نفَس هادئ... ثم آخر... دون استعجال.',
    question: 'ما أول شيء يخطر ببالك حين تذكر اسم الله الآن؟',
  },
  {
    id: 'moment-4',
    lead: 'قف أو اجلس معتدلاً، وحرّر كتفيك من أي توتر.',
    breathText: 'استنشق الهواء ببطء، وتخيّل الطمأنينة تدخل معه.',
    question: 'ما الذي تودّ أن تسلّمه لله الآن وتتوقف عن حمله وحدك؟',
  },
];

export const DUAS: DuaItem[] = [
  {
    id: 'dua-1',
    surah: 'سورة طه',
    ayahRef: 'الآيتان 25-26',
    text: 'رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي',
  },
  {
    id: 'dua-2',
    surah: 'سورة البقرة',
    ayahRef: 'الآية 201',
    text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  },
  {
    id: 'dua-3',
    surah: 'سورة آل عمران',
    ayahRef: 'من الآية 8',
    text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
  },
  {
    id: 'dua-4',
    surah: 'سورة نوح',
    ayahRef: 'من الآية 28',
    text: 'رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ',
  },
];

export const FEELINGS = ['مطمئن', 'ممتن', 'هادئ', 'متأمل', 'أحتاج المزيد من الوقت'] as const;
export type Feeling = (typeof FEELINGS)[number];

export type ContentType = 'ayah' | 'blessing' | 'question' | 'moment' | 'athar';

export function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86400000);
}

function pick<T>(list: T[], seed: number): T {
  return list[seed % list.length];
}

export function todayAyah(date = new Date()): Ayah {
  return pick(AYAT, dayOfYear(date));
}

export function todayBlessing(date = new Date()): Blessing {
  return pick(BLESSINGS, dayOfYear(date));
}

export function todayQuestion(date = new Date()): Question {
  return pick(QUESTIONS, dayOfYear(date));
}

export function todayAthar(date = new Date()): AtharItem {
  return pick(ATHAR, dayOfYear(date));
}

export function todayMoment(date = new Date()): MomentPrompt {
  return pick(MOMENTS, dayOfYear(date));
}

export function todayDua(date = new Date()): DuaItem {
  return pick(DUAS, dayOfYear(date));
}

const CONTENT_TYPES: ContentType[] = ['ayah', 'blessing', 'question', 'moment', 'athar'];

export function todayFeaturedType(date = new Date()): ContentType {
  return pick(CONTENT_TYPES, dayOfYear(date));
}

export function isoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
