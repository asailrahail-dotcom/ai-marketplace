'use client';

import { useEffect, useRef } from 'react';
import { initRahail } from './engine';
import { MEDIA } from './media';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path';
import { ArrowIcon, IconAffiliate, IconB2B, IconB2B2C, IconB2C } from './icons';

/* ------------------------------------------------------------------ */
/* Content — verbatim from the brief.                                  */
/* ------------------------------------------------------------------ */

const SCENES = [
  { id: 'cover', label: 'الغلاف', theme: 'dark' },
  { id: 'about', label: 'من نحن؟', theme: 'light' },
  { id: 'why', label: 'لماذا رحائل؟', theme: 'light' },
  { id: 'services', label: 'خدماتنا', theme: 'light' },
  { id: 'partner', label: 'مبادرة الشريك السياحي', theme: 'light' },
  { id: 'top-partner', label: 'الشريك المميز', theme: 'dark' },
  { id: 'packages', label: 'تصميم الباقات السياحية', theme: 'light' },
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

const PARTNER_MODELS = [
  { code: 'B2B', text: 'شراكات مع الشركات السياحية.', Icon: IconB2B },
  { code: 'B2C', text: 'البيع المباشر للعملاء.', Icon: IconB2C },
  { code: 'B2B2C', text: 'التعاون مع الوسطاء للوصول للعملاء.', Icon: IconB2B2C },
  { code: 'Affiliate Marketing', text: 'التسويق بالعمولة مقابل الحجوزات.', Icon: IconAffiliate },
];

const TOP_PARTNER_GOALS = ['توسيع شبكة الشراكات', 'استقطاب الشركات الكبرى', 'زيادة المبيعات والحجوزات'];

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

const EXPERIENCES = [
  { t: 'الطيران', clip: MEDIA.video.flight },
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

        {/* ================= 5. PARTNER INITIATIVE ================= */}
        <section {...scene('partner')} className="rh-scene rh-paper rh-partner">
          <div className="rh-container">
            <div className="rh-partner__head">
              <Eyebrow n={5}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>مبادرة الشريك السياحي</span></span>
                <span className="rh-line"><span className="rh-en rh-h2__en">RAHAIL</span></span>
              </h2>
              <p className="rh-lead" data-reveal>إنشاء شبكة شركاء لتسويق وبيع خدمات وباقات رحائل من خلال:</p>
            </div>

            <div className="rh-models">
              {PARTNER_MODELS.map(({ code, text, Icon }, i) => (
                <article key={code} className="rh-model">
                  <div className="rh-model__top">
                    <span className="rh-model__icon"><Icon /></span>
                    <span className="rh-model__n rh-en">{pad(i + 1)}</span>
                  </div>
                  <h3 className="rh-model__code rh-en">{code}</h3>
                  <p className="rh-model__text">{text}</p>
                </article>
              ))}
            </div>
          </div>
          <Zigzag className="rh-zig--foot" />
        </section>

        {/* ================= 6. TOP PARTNER ================= */}
        <section {...scene('top-partner')} className="rh-scene rh-top">
          <div className="rh-top__bg">
            <Photo src={MEDIA.topPartner} parallax={10} />
          </div>
          <div className="rh-top__veil" />
          <div className="rh-top__giant rh-en" aria-hidden>TOP PARTNER</div>

          <div className="rh-container rh-top__grid">
            <div className="rh-top__copy">
              <Eyebrow n={6}>TOP PARTNER</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>الشريك المميز</span></span>
              </h2>
              <p className="rh-lead rh-lead--light" data-reveal>
                استقطاب أصحاب العلاقات الواسعة القادرين على جلب الشركات الكبرى، مقابل عمولات وحوافز حسب الإنجازات.
              </p>
            </div>

            <aside className="rh-reward">
              <span className="rh-reward__shine" aria-hidden />
              <span className="rh-reward__label">المكافأة الخاصة</span>
              <p className="rh-reward__main">يوم مجاني في أحد منتجعات رحائل</p>
              <span className="rh-reward__rule" aria-hidden />
              <p className="rh-reward__note">خارج المواسم والعطلات الأسبوعية، وفق موعد تحدده الإدارة.</p>
            </aside>
          </div>

          <div className="rh-container rh-goals">
            <span className="rh-goals__label">الهدف:</span>
            <ul>
              {TOP_PARTNER_GOALS.map((g) => (
                <li key={g} className="rh-goal-chip">{g}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= 7. TOURISM PACKAGES ================= */}
        <section {...scene('packages')} className="rh-scene rh-paper rh-packages">
          <div className="rh-container rh-packages__intro">
            <Eyebrow n={7}>TOURISM PACKAGES</Eyebrow>
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
