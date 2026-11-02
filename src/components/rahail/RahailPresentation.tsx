'use client';

import { useEffect, useRef } from 'react';
import { initRahail } from './engine';
import { MEDIA } from './media';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path';
import { ArrowIcon, IconCheck, IconLocal, IconProvider, IconTraveler } from './icons';

/* ------------------------------------------------------------------ */
/* Content — verbatim from the brief.                                  */
/* ------------------------------------------------------------------ */

const SCENES = [
  { id: 'cover', label: 'الغلاف', theme: 'dark' },
  { id: 'about', label: 'من نحن؟', theme: 'light' },
  { id: 'why', label: 'لماذا رحائل؟', theme: 'light' },
  { id: 'services', label: 'خدماتنا', theme: 'light' },
  { id: 'packages', label: 'تصميم الباقات السياحية', theme: 'light' },
  { id: 'program', label: 'برنامج الشريك السياحي', theme: 'dark' },
  { id: 'challenges', label: 'التحديات', theme: 'light' },
  { id: 'tracks', label: 'المسارات السياحية', theme: 'light' },
  { id: 'mechanism', label: 'آلية التنفيذ', theme: 'light' },
  { id: 'parties', label: 'الأطراف وأدوارها', theme: 'dark' },
  { id: 'outputs', label: 'مخرجات الاجتماع', theme: 'light' },
] as const;
type SceneId = (typeof SCENES)[number]['id'];
const scene = (id: SceneId) => {
  const i = SCENES.findIndex((s) => s.id === id);
  return { id: `rh-${id}`, 'data-scene': '', 'data-label': SCENES[i].label, 'data-theme': SCENES[i].theme };
};

const ABOUT_TEXT =
  'شركة سياحية متخصصة في تطوير الوجهات والمشاريع السياحية وتشغيلها وإدارتها، وفق قيم الإتقان والأصالة والاستدامة لتقديم تجربة مميزة للضيف.';
const ABOUT_HIGHLIGHTS = new Set(['الإتقان', 'والأصالة', 'والاستدامة']);

const WHY_TEXT =
  'خبرة عملية وقرارات مبنية على العائد، نوازن من خلالها بين جودة التجربة وكفاءة الاستثمار وتعزيز الإشغال والإيرادات.';
const WHY_KEYWORDS = [
  { t: 'الخبرة', img: MEDIA.why.experience },
  { t: 'جودة التجربة', img: MEDIA.why.quality },
  { t: 'كفاءة الاستثمار', img: MEDIA.why.investment },
  { t: 'العائد', img: MEDIA.why.returns },
];

const SERVICES = [
  { n: '01', title: 'تطوير الوجهات السياحية', img: MEDIA.servicesDevelopment },
  { n: '02', title: 'التشغيل والإدارة السياحية', img: MEDIA.servicesOperations },
];

/* ---------- Tourism partner programme (client-supplied text) ---------- */
const CHALLENGES = [
  { who: 'الفرد الحائلي', text: 'تصله طلبات لتنظيم زيارات، لكنه يواجه صعوبة في التنسيق وتقديم تجربة احترافية والاستفادة اقتصاديًا.', Icon: IconLocal },
  { who: 'السائح', text: 'يحتاج جهة واحدة تنظم الرحلة كاملة، مع وضوح الخيارات والأسعار.', Icon: IconTraveler },
  { who: 'مزود الخدمة', text: 'يواجه تحديات التسويق والوصول للعملاء وتسعير الخدمات بصورة مناسبة.', Icon: IconProvider },
];

const TRACKS: Array<{ t: string; img?: string; clip?: { src: string; poster: string } }> = [
  { t: 'السياحة الفلكية', clip: MEDIA.video.astronomy },
  { t: 'السياحة الأثرية', img: MEDIA.tracks.heritage },
  { t: 'السياحة الطبيعية', img: MEDIA.tracks.nature },
  { t: 'سياحة الشركات', img: MEDIA.tracks.corporate },
  { t: 'السياحة النسائية', img: MEDIA.tracks.women },
];

const MECHANISM = [
  'تشكيل فريق سياحي متخصص لتطوير الباقات وتسعيرها وإدارة الجودة والشراكات.',
  'ترشيح مديري المسارات ومزودي خدمات الإقامة والضيافة والتجارب وفق معايير واضحة.',
  'تفعيل شبكة الشركاء السياحيين لاستقطاب العملاء والشركات وتحويل الطلبات إلى حجوزات.',
  'إطلاق تجريبي لعدد محدود من الباقات، وقياس المبيعات ورضا العملاء قبل التوسع.',
];

const PARTIES = [
  { who: 'الشريك السياحي', text: 'استقطاب الفرص والعملاء من خلال شبكة علاقاته.' },
  { who: 'مزود الخدمة', text: 'تنفيذ الإقامة والضيافة والتجارب بالجودة المتفق عليها.' },
  { who: 'السائح', text: 'اختيار الباقة والاستفادة من تجربة متكاملة.' },
];
const RAHAIL_ROLE = { who: 'شركة رحائل والفريق السياحي', text: 'تصميم الباقات، إدارة الحجوزات والتشغيل والشراكات.' };

const OUTPUTS = [
  'اعتماد هوامش الربح وآلية توزيع العمولات.',
  'وضع خطة لاستقطاب الشخصيات والشركاء المستهدفين.',
  'ترشيح مديري المسارات ومزودي الخدمات ذوي الجودة العالية.',
  'تحديد مستويات العضوية ومزايا كل مستوى.',
  'اعتماد تصور الحملة التسويقية وموعد الإطلاق.',
];

const PACKAGE_STEPS = [
  'دراسة الفئة المستهدفة واهتماماتها.',
  'اختيار الوجهات والتجارب المناسبة.',
  'تنسيق الإقامة والضيافة والنقل والأنشطة والإرشاد.',
  'تحديد التكلفة وسعر البيع وهامش الربح.',
  'تصميم الباقة وتجهيزها للتسويق.',
  'المتابعة والإشراف على التنفيذ وضمان جودة التجربة.',
];

const TAGLINE = 'شركة متخصصة في تطوير الوجهات والمشاريع السياحية.';
const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={`rh-logo ${className}`} role="img" aria-label="RAHAIL | رحائل" fill="currentColor" fillRule="evenodd">
      <path d={LOGO_PATH} />
    </svg>
  );
}

function Photo({ src, className = '', parallax }: { src: string; className?: string; parallax?: number }) {
  return (
    <div className={`rh-photo ${className}`} data-parallax={parallax}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" decoding="async" />
    </div>
  );
}

function Clip({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  return (
    <div className={`rh-photo rh-clip ${className}`}>
      <video src={src} poster={poster} muted loop playsInline autoPlay preload="auto" data-autoplay aria-hidden />
    </div>
  );
}

/* The flight clip is used only on the cover, as the guest's arrival —
   it is not presented as an experience. */
const EXPERIENCES = [
  { t: 'الفلك', clip: MEDIA.video.astronomy },
  { t: 'الخيول', clip: MEDIA.video.horses },
  { t: 'البقيات', clip: MEDIA.video.buggies },
];

/** The profile's outline zigzag motif (tent / mountain line). */
function Zigzag({ className = '' }: { className?: string }) {
  const row = (y: number, h: number) => {
    let d = `M0 ${y + h}`;
    for (let x = 0; x < 1200; x += 120) d += ` L${x + 60} ${y} L${x + 120} ${y + h}`;
    return d;
  };
  return (
    <svg className={`rh-zig ${className}`} viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden>
      <path pathLength={1} d={row(10, 100)} />
      <path pathLength={1} d={row(28, 100)} />
    </svg>
  );
}

function Eyebrow({ children, n }: { children: React.ReactNode; n: number }) {
  return (
    <div className="rh-eyebrow" data-reveal>
      <span className="rh-eyebrow__mark" aria-hidden />
      <span className="rh-eyebrow__n">{pad(n)}</span>
      <span className="rh-eyebrow__t">{children}</span>
    </div>
  );
}

const words = (text: string, highlight?: Set<string>) =>
  text.split(' ').map((w, i) => (
    <span key={i} className={`rh-w${highlight?.has(w.replace(/[،.]/g, '')) ? ' rh-w--hl' : ''}`}>
      {w}{' '}
    </span>
  ));

/* ------------------------------------------------------------------ */
/* Presentation                                                        */
/* ------------------------------------------------------------------ */

export function RahailPresentation() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return initRahail(root.current);
  }, []);

  return (
    <div ref={root} className="rh-app" data-ui-theme="dark">
      {/* ---------------- Preloader ---------------- */}
      <div className="rh-pre" aria-hidden>
        <div className="rh-pre__inner">
          <Logo className="rh-pre__logo" />
          <div className="rh-pre__bar"><i /></div>
          <div className="rh-pre__count">000</div>
        </div>
      </div>

      {/* ---------------- Chrome ---------------- */}
      <div className="rh-progress" aria-hidden><i /></div>

      <header className="rh-header">
        <button type="button" className="rh-header__logo" data-nav="home" aria-label="العودة إلى الغلاف">
          <Logo />
        </button>
        <div className="rh-header__meta" aria-live="polite">
          <span className="rh-header__label">{SCENES[0].label}</span>
          <span className="rh-header__count">
            <b>01</b> / {pad(SCENES.length)}
          </span>
        </div>
      </header>

      <nav className="rh-rail" aria-label="مشاهد العرض">
        {SCENES.map((s, i) => (
          <button key={s.id} type="button" className={`rh-rail__dot${i === 0 ? ' is-active' : ''}`} aria-label={s.label}>
            <span className="rh-rail__tip">{s.label}</span>
            <i />
          </button>
        ))}
      </nav>

      <div className="rh-controls">
        <button type="button" data-nav="prev" aria-label="المشهد السابق" disabled>
          <ArrowIcon dir="up" />
        </button>
        <button type="button" data-nav="next" aria-label="المشهد التالي">
          <ArrowIcon dir="down" />
        </button>
      </div>

      <main>
        {/* ================= 1. COVER ================= */}
        <section {...scene('cover')} className="rh-scene rh-cover">
          <div className="rh-cover__lines" aria-hidden />
          <div className="rh-cover__window">
            <Photo src={MEDIA.cover} />
            <Clip src={MEDIA.video.flight.src} poster={MEDIA.video.flight.poster} className="rh-cover__clip" />
            <div className="rh-cover__shade" />
          </div>
          <div className="rh-cover__frame" aria-hidden />

          <div className="rh-cover__side rh-cover__side--start" aria-hidden>
            <span className="rh-cover__word rh-ar">رحائل</span>
          </div>
          <div className="rh-cover__side rh-cover__side--end" aria-hidden>
            <span className="rh-cover__word rh-en">RAHAIL</span>
          </div>

          <div className="rh-cover__lockup">
            <Logo className="rh-cover__logo" />
            <h1 className="rh-sr">RAHAIL | رحائل</h1>
            <span className="rh-cover__rule" aria-hidden />
            <p className="rh-cover__tagline">{TAGLINE}</p>
          </div>

          <div className="rh-cover__hint" aria-hidden>
            <span>مرّر للاستكشاف</span>
            <i />
          </div>
        </section>

        {/* ================= 2. ABOUT ================= */}
        <section {...scene('about')} className="rh-scene rh-paper rh-about">
          <div className="rh-container rh-about__grid">
            <div className="rh-about__copy">
              <Eyebrow n={2}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>من نحن؟</span></span>
              </h2>
              <p className="rh-about__text">{words(ABOUT_TEXT, ABOUT_HIGHLIGHTS)}</p>
            </div>
            <div className="rh-about__media-wrap">
              <span className="rh-about__chevrons" aria-hidden>
                <svg viewBox="0 0 20 120" fill="currentColor">
                  {[0, 30, 60, 90].map((y) => (
                    <path key={y} d={`M20 ${y} L20 ${y + 8} L8 ${y + 15} L20 ${y + 22} L20 ${y + 30} L0 ${y + 15} Z`} />
                  ))}
                </svg>
              </span>
              <Photo src={MEDIA.about} className="rh-about__media rh-kb" />
            </div>
          </div>
          <Zigzag className="rh-zig--foot" />
        </section>

        {/* ================= 3. WHY ================= */}
        <section {...scene('why')} className="rh-scene rh-paper rh-why">
          <Zigzag className="rh-why__zig" />
          <div className="rh-container rh-why__inner">
            <div className="rh-why__head">
              <div>
                <Eyebrow n={3}>RAHAIL</Eyebrow>
                <h2 className="rh-h2" data-split>
                  <span className="rh-line"><span>لماذا رحائل؟</span></span>
                </h2>
              </div>
              <p className="rh-why__statement">{words(WHY_TEXT)}</p>
            </div>
            <ul className="rh-why__kws">
              {WHY_KEYWORDS.map((k, i) => (
                <li key={k.t} className={`rh-why__kw ${i % 2 ? 'is-up' : 'is-down'}`}>
                  <div className="rh-tri">
                    <Photo src={k.img} className="rh-kb" />
                  </div>
                  <div className="rh-why__label">
                    <span className="rh-why__kwn rh-en">{pad(i + 1)}</span>
                    <span className="rh-why__kwt">{k.t}</span>
                    <span className="rh-why__kwline" aria-hidden />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= 4. SERVICES ================= */}
        <section {...scene('services')} className="rh-scene rh-paper rh-paper--deep rh-services">
          <div className="rh-container">
            <div className="rh-services__head">
              <Eyebrow n={4}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>خدماتنا</span></span>
              </h2>
            </div>
            <div className="rh-services__grid">
              {SERVICES.map((s) => (
                <article key={s.n} className="rh-service">
                  <Photo src={s.img} parallax={6} />
                  <div className="rh-service__veil" />
                  <span className="rh-service__n rh-en">{s.n}</span>
                  <h3 className="rh-service__title">{s.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. TOURISM PACKAGES ================= */}
        <section {...scene('packages')} className="rh-scene rh-paper rh-packages">
          <div className="rh-container rh-packages__intro">
            <Eyebrow n={5}>TOURISM PACKAGES</Eyebrow>
            <h2 className="rh-h2" data-split>
              <span className="rh-line"><span>تصميم الباقات السياحية</span></span>
            </h2>
            <p className="rh-lead" data-reveal>
              تصميم باقات متكاملة تلبي اهتمامات السائح بالتعاون مع الشركات السياحية والمرشدين ومقدمي الخدمات.
            </p>
          </div>

          {/* Experiences in motion — three arched video windows */}
          <div className="rh-reel">
            <div className="rh-container rh-reel__grid">
              {EXPERIENCES.map((e, i) => (
                <figure key={e.t} className={`rh-reel__item rh-reel__item--${i + 1}`}>
                  <div className="rh-reel__arch">
                    <Clip src={e.clip.src} poster={e.clip.poster} />
                    <span className="rh-reel__frame" aria-hidden />
                  </div>
                  <figcaption className="rh-reel__label">
                    <span className="rh-reel__n rh-en">{pad(i + 1)}</span>
                    <span className="rh-reel__t">{e.t}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Moving strip of experiences */}
          <div className="rh-film-wrap" aria-hidden>
            <div className="rh-film">
              <div className="rh-film__track">
                {[...MEDIA.experiences, ...MEDIA.experiences].map((src, i) => (
                  <div key={i} className={`rh-film__item ${i % 2 ? 'is-low' : ''}`}>
                    <Photo src={src} className="rh-kb" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rh-steps">
            <Zigzag className="rh-steps__zig" />
            <div className="rh-steps__head rh-container">
              <span className="rh-steps__title rh-en">TOURISM PACKAGES</span>
              <div className="rh-steps__progress" aria-hidden><i /></div>
            </div>
            <div className="rh-steps__viewport">
              <ol className="rh-steps__track">
                {PACKAGE_STEPS.map((t, i) => (
                  <li key={t} className="rh-step">
                    <span className="rh-step__n rh-en">{pad(i + 1)}</span>
                    <span className="rh-step__dot" aria-hidden />
                    <p className="rh-step__t">{t}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rh-container rh-packages__goal">
            <span className="rh-goals__label" data-reveal>الهدف:</span>
            <p className="rh-packages__goaltext" data-reveal>
              إدارة رحلة الباقة من التصميم والتجهيز حتى التنفيذ وانتهاء تجربة السائح.
            </p>
          </div>

        </section>

        {/* ================= 6. PARTNER PROGRAMME ================= */}
        <section {...scene('program')} className="rh-scene rh-program">
          <div className="rh-program__bg">
            <Photo src={MEDIA.program} parallax={10} />
          </div>
          <div className="rh-program__veil" />
          <div className="rh-container rh-program__inner">
            <Eyebrow n={6}>RAHAIL</Eyebrow>
            <h2 className="rh-h2 rh-program__title" data-split>
              <span className="rh-line"><span>برنامج الشريك السياحي</span></span>
              <span className="rh-line"><span className="rh-program__co">شركة رحائل</span></span>
            </h2>
            <p className="rh-program__sub" data-reveal>تصور تنفيذي مختصر لاجتماع الشركاء – منطقة حائل</p>
            <div className="rh-idea">
              <span className="rh-idea__label">الفكرة والهدف</span>
              <p className="rh-idea__text">
                برنامج عضوية يربط أصحاب العلاقات المحلية بمزودي الخدمات السياحية والسياح، لتصميم رحلات متكاملة في حائل
                وتسويقها عبر شبكة شركاء، مع تنظيم الأدوار والعمولات ورفع جودة التجربة.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 7. CHALLENGES ================= */}
        <section {...scene('challenges')} className="rh-scene rh-paper rh-challenges">
          <div className="rh-container">
            <Eyebrow n={7}>RAHAIL</Eyebrow>
            <h2 className="rh-h2" data-split>
              <span className="rh-line"><span>التحديات التي يعالجها البرنامج</span></span>
            </h2>
            <div className="rh-cards rh-cards--3" data-stagger data-draw>
              {CHALLENGES.map(({ who, text, Icon }) => (
                <article key={who} className="rh-card">
                  <span className="rh-card__icon"><Icon /></span>
                  <h3 className="rh-card__title">{who}</h3>
                  <p className="rh-card__text">{text}</p>
                </article>
              ))}
            </div>
          </div>
          <Zigzag className="rh-zig--foot" />
        </section>

        {/* ================= 8. TRACKS ================= */}
        <section {...scene('tracks')} className="rh-scene rh-paper rh-paper--deep rh-tracks">
          <div className="rh-container">
            <Eyebrow n={8}>RAHAIL</Eyebrow>
            <h2 className="rh-h2" data-split>
              <span className="rh-line"><span>المسارات السياحية المقترحة</span></span>
            </h2>
            <ol className="rh-tracks__list" data-stagger>
              {TRACKS.map((tr, i) => (
                <li key={tr.t} className="rh-track">
                  <div className="rh-track__arch">
                    {tr.clip ? <Clip src={tr.clip.src} poster={tr.clip.poster} /> : <Photo src={tr.img!} className="rh-kb" />}
                    <span className="rh-reel__frame" aria-hidden />
                  </div>
                  <span className="rh-track__n rh-en">{pad(i + 1)}</span>
                  <span className="rh-track__t">{tr.t}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= 9. MECHANISM ================= */}
        <section {...scene('mechanism')} className="rh-scene rh-paper rh-mech">
          <div className="rh-container rh-mech__grid">
            <div className="rh-mech__head">
              <Eyebrow n={9}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>آلية التنفيذ</span></span>
              </h2>
            </div>
            <ol className="rh-mech__list">
              <span className="rh-mech__line" aria-hidden><i /></span>
              {MECHANISM.map((t, i) => (
                <li key={t} className="rh-mech__item">
                  <span className="rh-mech__n rh-en">{pad(i + 1)}</span>
                  <span className="rh-mech__dot" aria-hidden />
                  <p className="rh-mech__t">{t}</p>
                </li>
              ))}
            </ol>
          </div>
          <Zigzag className="rh-zig--foot" />
        </section>

        {/* ================= 10. PARTIES ================= */}
        <section {...scene('parties')} className="rh-scene rh-parties">
          <Zigzag className="rh-parties__zig" />
          <div className="rh-container">
            <Eyebrow n={10}>RAHAIL</Eyebrow>
            <h2 className="rh-h2" data-split>
              <span className="rh-line"><span>الأطراف وأدوارها</span></span>
            </h2>
            <div className="rh-hub">
              <div className="rh-hub__core" data-reveal>
                <Logo className="rh-hub__logo" />
                <h3 className="rh-hub__who">{RAHAIL_ROLE.who}</h3>
                <p className="rh-hub__text">{RAHAIL_ROLE.text}</p>
              </div>
              <svg className="rh-hub__net" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden>
                <path pathLength={1} d="M500 0 V40 M166 80 V40 H834 V80 M500 40 V80" />
              </svg>
              <div className="rh-cards rh-cards--3" data-stagger>
                {PARTIES.map((p) => (
                  <article key={p.who} className="rh-card rh-card--dark">
                    <h3 className="rh-card__title">{p.who}</h3>
                    <p className="rh-card__text">{p.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="rh-commission" data-reveal>
              <span className="rh-reward__shine" aria-hidden />
              <span className="rh-commission__pct">٥٪</span>
              <p className="rh-commission__text">عمولة بنسبة ٥٪ مقابل تسجيل كل عميل جديد.</p>
            </aside>
          </div>
        </section>

        {/* ================= 11. OUTPUTS ================= */}
        <section {...scene('outputs')} className="rh-scene rh-paper rh-outputs">
          <div className="rh-container rh-outputs__grid">
            <div>
              <Eyebrow n={11}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>مخرجات اجتماع</span></span>
                <span className="rh-line"><span>الشريك السياحي</span></span>
              </h2>
            </div>
            <ul className="rh-outputs__list" data-stagger data-draw>
              {OUTPUTS.map((t) => (
                <li key={t} className="rh-output">
                  <span className="rh-output__check"><IconCheck /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rh-closing">
            <Photo src={MEDIA.closing} />
            <div className="rh-closing__veil" />
            <div className="rh-closing__inner">
              <Logo className="rh-closing__logo" />
              <p className="rh-cover__tagline">{TAGLINE}</p>
              <button type="button" className="rh-btn" data-nav="home">
                <ArrowIcon dir="up" />
                <span>العودة إلى الغلاف</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
