'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { LOGO_SRC, MEDIA } from './media';
import { ArrowIcon, IconAffiliate, IconB2B, IconB2B2C, IconB2C } from './icons';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content — taken verbatim from the brief.                            */
/* ------------------------------------------------------------------ */

const SCENES = [
  { id: 'cover', label: 'الغلاف', theme: 'dark' },
  { id: 'about', label: 'من نحن؟', theme: 'light' },
  { id: 'why', label: 'لماذا رحائل؟', theme: 'dark' },
  { id: 'services', label: 'خدماتنا', theme: 'light' },
  { id: 'partner', label: 'مبادرة الشريك السياحي', theme: 'light' },
  { id: 'top-partner', label: 'الشريك المميز', theme: 'dark' },
  { id: 'packages', label: 'تصميم الباقات السياحية', theme: 'light' },
] as const;

const ABOUT_TEXT =
  'شركة سياحية متخصصة في تطوير الوجهات والمشاريع السياحية وتشغيلها وإدارتها، وفق قيم الإتقان والأصالة والاستدامة لتقديم تجربة مميزة للضيف.';
const ABOUT_HIGHLIGHTS = new Set(['الإتقان', 'والأصالة', 'والاستدامة']);

const WHY_TEXT =
  'خبرة عملية وقرارات مبنية على العائد، نوازن من خلالها بين جودة التجربة وكفاءة الاستثمار وتعزيز الإشغال والإيرادات.';
const WHY_KEYWORDS = ['الخبرة', 'جودة التجربة', 'كفاءة الاستثمار', 'العائد'];

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

const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  if (LOGO_SRC) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={LOGO_SRC} alt="RAHAIL | رحائل" className={`rh-logo-img rh-logo-img--${size} ${className}`} />;
  }
  return (
    <span className={`rh-logo rh-logo--${size} ${className}`} aria-label="RAHAIL | رحائل">
      <span className="rh-logo__ar">رحائل</span>
      <span className="rh-logo__bar" aria-hidden />
      <span className="rh-logo__en">RAHAIL</span>
    </span>
  );
}

/** Photo with a designed sand/charcoal gradient underneath; if the photo
 *  can't load, the gradient remains instead of a broken image. */
function Media({ src, className = '', imgClassName = '', alt = '' }: { src: string; className?: string; imgClassName?: string; alt?: string }) {
  return (
    <div className={`rh-media ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`rh-media__img ${imgClassName}`}
        decoding="async"
        onError={(e) => e.currentTarget.classList.add('is-failed')}
      />
    </div>
  );
}

function Eyebrow({ children, n }: { children: React.ReactNode; n?: number }) {
  return (
    <div className="rh-eyebrow" data-reveal>
      {n !== undefined && <span className="rh-eyebrow__n">{pad(n)}</span>}
      <span className="rh-eyebrow__line" aria-hidden />
      <span className="rh-eyebrow__t">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Presentation                                                        */
/* ------------------------------------------------------------------ */

export function RahailPresentation() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const anchorsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  const goTo = useCallback((index: number) => {
    const i = Math.max(0, Math.min(SCENES.length - 1, index));
    const el = anchorsRef.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    document.documentElement.classList.add('rh-root');

    // Images that failed before hydration never fired React's onError.
    scope.querySelectorAll<HTMLImageElement>('.rh-media__img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) img.classList.add('is-failed');
    });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- smooth scroll ---------- */
    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (!reduce) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ---------- preloader ---------- */
      const counter = { v: 0 };
      const pre = gsap.timeline({
        onComplete: () => {
          setLoaded(true);
          lenis?.start();
        },
      });
      pre
        .from('.rh-pre__logo', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' })
        .to(counter, {
          v: 100,
          duration: reduce ? 0.2 : 1.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            const n = scope.querySelector('.rh-pre__count');
            if (n) n.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        }, 0.2)
        .to('.rh-pre__bar i', { scaleX: 1, duration: reduce ? 0.2 : 1.6, ease: 'power2.inOut' }, 0.2)
        .to('.rh-pre__inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
        .to('.rh-pre', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
        .from('.rh-cover__word', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, '-=0.6')
        .from('.rh-cover__window', { scale: 0.85, opacity: 0, duration: 1.6, ease: 'expo.out' }, '<')
        .from('.rh-cover__frame', { opacity: 0, duration: 1.4 }, '<0.2')
        .from('.rh-header, .rh-rail, .rh-controls, .rh-cover__hint', { opacity: 0, y: 10, duration: 1, stagger: 0.06 }, '<0.3');

      /* ---------- motion-heavy desktop + mobile ---------- */
      mm.add(
        {
          desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
        },
        (c) => {
          const { desktop } = c.conditions as { desktop: boolean; mobile: boolean };

          /* Scene 1 — the arch "window" opens onto the landscape (homage to
             the aircraft-window zoom in the reference). */
          const startClip = desktop
            ? 'inset(15% 37% 11% 37% round 999px 999px 14px 14px)'
            : 'inset(22% 14% 18% 14% round 999px 999px 12px 12px)';
          gsap.set('.rh-cover__window', { clipPath: startClip });
          const cover = gsap.timeline({
            scrollTrigger: { trigger: '.rh-cover', start: 'top top', end: '+=170%', scrub: 1, pin: true, anticipatePin: 1 },
          });
          cover
            .fromTo('.rh-cover__window', { clipPath: startClip }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power1.inOut', duration: 1 }, 0)
            .fromTo('.rh-cover__img', { scale: 1.45 }, { scale: 1.05, ease: 'none', duration: 1.5 }, 0)
            .to('.rh-cover__frame', { scale: 1.6, opacity: 0, ease: 'power1.in', duration: 0.6 }, 0)
            .to('.rh-cover__side--start', { xPercent: desktop ? 45 : 0, yPercent: desktop ? 0 : -60, opacity: 0, duration: 0.7 }, 0)
            .to('.rh-cover__side--end', { xPercent: desktop ? -45 : 0, yPercent: desktop ? 0 : 60, opacity: 0, duration: 0.7 }, 0)
            .to('.rh-cover__hint', { opacity: 0, duration: 0.2 }, 0)
            .to('.rh-cover__shade', { opacity: 1, duration: 0.5 }, 0.6)
            .fromTo('.rh-cover__lockup > *', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.5, ease: 'power3.out' }, 0.75)
            .to({}, { duration: 0.3 });

          /* Scene 3 — keywords light up one by one while pinned */
          if (desktop) {
            const why = gsap.timeline({
              scrollTrigger: { trigger: '.rh-why', start: 'top top', end: '+=230%', scrub: 1, pin: true, anticipatePin: 1 },
            });
            why
              .fromTo('.rh-why__statement .rh-w', { opacity: 0.14 }, { opacity: 1, stagger: 0.05, duration: 0.3 }, 0)
              .fromTo('.rh-why__bgword', { xPercent: -8 }, { xPercent: 8, ease: 'none', duration: 3 }, 0);
            gsap.utils.toArray<HTMLElement>('.rh-why__kw').forEach((kw, i) => {
              why.fromTo(kw, { opacity: 0.16 }, { opacity: 1, duration: 0.4 }, 0.9 + i * 0.5);
              why.fromTo(kw.querySelector('.rh-why__kwline'), { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0.9 + i * 0.5);
            });
            why.to({}, { duration: 0.4 });
          } else {
            gsap.fromTo('.rh-why__statement .rh-w', { opacity: 0.14 }, {
              opacity: 1, stagger: 0.05,
              scrollTrigger: { trigger: '.rh-why__statement', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
            });
            gsap.utils.toArray<HTMLElement>('.rh-why__kw').forEach((kw) => {
              gsap.fromTo(kw, { opacity: 0.16, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: kw, start: 'top 85%' } });
              gsap.fromTo(kw.querySelector('.rh-why__kwline'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: kw, start: 'top 85%' } });
            });
          }

          /* Scene 7 — horizontal journey through the six steps */
          if (desktop) {
            const track = scope.querySelector<HTMLElement>('.rh-steps__track');
            const viewport = scope.querySelector<HTMLElement>('.rh-steps__viewport');
            if (track && viewport) {
              const distance = () => {
                const padX = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
                return Math.max(0, track.scrollWidth - viewport.clientWidth + padX * 2);
              };
              const steps = gsap.timeline({
                scrollTrigger: {
                  trigger: '.rh-steps', start: 'top top', end: () => '+=' + (distance() + window.innerHeight * 0.6),
                  scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
                },
              });
              // RTL: content overflows to the left, so the track moves right.
              steps
                .to(track, { x: () => distance(), ease: 'none', duration: 1 }, 0)
                .fromTo('.rh-steps__progress i', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
                .fromTo('.rh-steps__bg .rh-media__img', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0);
              gsap.utils.toArray<HTMLElement>('.rh-step').forEach((s, i) => {
                steps.fromTo(s, { opacity: i < 2 ? 1 : 0.25 }, { opacity: 1, duration: 0.12 }, Math.max(0, (i - 1.6) / 5));
              });
            }
          } else {
            gsap.utils.toArray<HTMLElement>('.rh-step').forEach((s) => {
              gsap.from(s, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%' } });
            });
          }

          /* Generic text reveals */
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
            gsap.from(el, { y: 40, opacity: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
          });
          gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
            gsap.from(el.querySelectorAll('.rh-line > span'), {
              yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1,
              scrollTrigger: { trigger: el, start: 'top 85%' },
            });
          });

          /* Scene 2 — word-by-word reading + image curtain */
          gsap.fromTo('.rh-about__text .rh-w', { opacity: 0.15 }, {
            opacity: 1, stagger: 0.04, ease: 'none',
            scrollTrigger: { trigger: '.rh-about__text', start: 'top 80%', end: 'bottom 50%', scrub: 1 },
          });
          gsap.fromTo('.rh-about__media', { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
            scrollTrigger: { trigger: '.rh-about__media', start: 'top 80%' },
          });

          /* Parallax — every [data-parallax] image drifts inside its frame */
          gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
            const img = el.querySelector('.rh-media__img');
            if (!img) return;
            const amt = Number(el.dataset.parallax || 12);
            gsap.fromTo(img, { yPercent: -amt, scale: 1.18 }, {
              yPercent: amt, scale: 1.18, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });

          /* Scene 4 — panels rise like curtains */
          gsap.utils.toArray<HTMLElement>('.rh-service').forEach((p, i) => {
            gsap.fromTo(p, { clipPath: 'inset(100% 0% 0% 0%)' }, {
              clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: i * 0.15,
              scrollTrigger: { trigger: '.rh-services__grid', start: 'top 80%' },
            });
            gsap.from(p.querySelectorAll('.rh-service__n, .rh-service__title'), {
              y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 0.7 + i * 0.15,
              scrollTrigger: { trigger: '.rh-services__grid', start: 'top 80%' },
            });
          });

          /* Scene 5 — cards stagger in and icons draw themselves */
          gsap.from('.rh-model', {
            y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: '.rh-models', start: 'top 82%' },
          });
          gsap.fromTo('.rh-model .rh-draw', { strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.04,
            scrollTrigger: { trigger: '.rh-models', start: 'top 75%' },
          });
          gsap.fromTo('.rh-models__net path', { strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut',
            scrollTrigger: { trigger: '.rh-models', start: 'top 75%' },
          });

          /* Scene 6 — giant outline type drifts, reward card glows in */
          gsap.fromTo('.rh-top__giant', { xPercent: 12 }, {
            xPercent: -12, ease: 'none',
            scrollTrigger: { trigger: '.rh-top', start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.from('.rh-reward', {
            y: 60, opacity: 0, scale: 0.96, duration: 1.4, ease: 'expo.out',
            scrollTrigger: { trigger: '.rh-reward', start: 'top 85%' },
          });
          gsap.from('.rh-goal-chip', {
            y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: '.rh-goals', start: 'top 90%' },
          });

          /* Closing */
          gsap.fromTo('.rh-closing .rh-media__img', { scale: 1.3 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: '.rh-closing', start: 'top bottom', end: 'bottom bottom', scrub: true },
          });
        },
      );

      /* ---------- progress bar ---------- */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set('.rh-progress i', { scaleX: self.progress }),
      });

      /* ---------- active scene tracking ---------- */
      const anchors = SCENES.map((s) => {
        const el = scope.querySelector<HTMLElement>(`#rh-${s.id}`)!;
        const parent = el.parentElement;
        return parent && parent.classList.contains('pin-spacer') ? parent : el;
      });
      anchorsRef.current = anchors;
      anchors.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: i === anchors.length - 1 ? 'max' : 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, scope);

    /* ---------- keyboard navigation ---------- */
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (['ArrowDown', 'PageDown', 'ArrowLeft'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        goTo(activeRef.current + 1);
      } else if (['ArrowUp', 'PageUp', 'ArrowRight'].includes(e.key) || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        goTo(activeRef.current - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(SCENES.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('load', refresh);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('rh-root');
    };
  }, [goTo]);

  const theme = SCENES[active].theme;

  const words = (text: string, highlight?: Set<string>) =>
    text.split(' ').map((w, i) => (
      <span key={i} className={`rh-w${highlight?.has(w.replace(/[،.]/g, '')) ? ' rh-w--hl' : ''}`}>
        {w}{' '}
      </span>
    ));

  return (
    <div ref={root} className={`rh-app ${loaded ? 'is-loaded' : ''}`} data-ui-theme={theme}>
      {/* ---------------- Preloader ---------------- */}
      <div className="rh-pre" aria-hidden>
        <div className="rh-pre__inner">
          <Logo size="lg" className="rh-pre__logo" />
          <div className="rh-pre__bar"><i /></div>
          <div className="rh-pre__count">000</div>
        </div>
      </div>

      {/* ---------------- Chrome: header, progress, rail, controls ---------------- */}
      <div className="rh-progress" aria-hidden><i /></div>

      <header className="rh-header">
        <button type="button" className="rh-header__logo" onClick={() => goTo(0)} aria-label="العودة إلى الغلاف">
          <Logo size="sm" />
        </button>
        <div className="rh-header__meta" aria-live="polite">
          <span className="rh-header__label">{SCENES[active].label}</span>
          <span className="rh-header__count">
            <b>{pad(active + 1)}</b> / {pad(SCENES.length)}
          </span>
        </div>
      </header>

      <nav className="rh-rail" aria-label="مشاهد العرض">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={`rh-rail__dot ${i === active ? 'is-active' : ''}`}
            aria-label={s.label}
            aria-current={i === active ? 'step' : undefined}
          >
            <span className="rh-rail__tip">{s.label}</span>
            <i />
          </button>
        ))}
      </nav>

      <div className="rh-controls">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="المشهد السابق">
          <ArrowIcon dir="up" />
        </button>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === SCENES.length - 1} aria-label="المشهد التالي">
          <ArrowIcon dir="down" />
        </button>
      </div>

      <main>
        {/* ================= 1. COVER ================= */}
        <section id="rh-cover" className="rh-scene rh-cover" data-theme="dark">
          <div className="rh-cover__window">
            <Media src={MEDIA.cover} imgClassName="rh-cover__img" alt="" className="rh-cover__media" />
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
            <h1 className="rh-cover__title">
              {LOGO_SRC ? (
                <Logo size="lg" />
              ) : (
                <>
                  <span>رحائل</span> <span className="rh-cover__sep">|</span> <span className="rh-en">RAHAIL</span>
                </>
              )}
            </h1>
            <p className="rh-cover__tagline">شركة متخصصة في تطوير الوجهات والمشاريع السياحية.</p>
          </div>

          <div className="rh-cover__hint" aria-hidden>
            <span>مرّر للاستكشاف</span>
            <i />
          </div>
        </section>

        {/* ================= 2. ABOUT ================= */}
        <section id="rh-about" className="rh-scene rh-about" data-theme="light">
          <div className="rh-container rh-about__grid">
            <div className="rh-about__copy">
              <Eyebrow n={2}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>من نحن؟</span></span>
              </h2>
              <p className="rh-about__text">{words(ABOUT_TEXT, ABOUT_HIGHLIGHTS)}</p>
            </div>
            <div className="rh-about__media-wrap">
              <Media src={MEDIA.about} className="rh-about__media" alt="" />
              <span className="rh-about__caption rh-en" aria-hidden>RAHAIL</span>
            </div>
          </div>
        </section>

        {/* ================= 3. WHY ================= */}
        <section id="rh-why" className="rh-scene rh-why" data-theme="dark">
          <div className="rh-why__bg" data-parallax="8">
            <Media src={MEDIA.why} alt="" />
          </div>
          <div className="rh-why__bgword rh-en" aria-hidden>RAHAIL</div>
          <div className="rh-container rh-why__inner">
            <div className="rh-why__head">
              <Eyebrow n={3}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>لماذا رحائل؟</span></span>
              </h2>
              <p className="rh-why__statement">{words(WHY_TEXT)}</p>
            </div>
            <ul className="rh-why__kws">
              {WHY_KEYWORDS.map((k, i) => (
                <li key={k} className="rh-why__kw">
                  <span className="rh-why__kwn rh-en">{pad(i + 1)}</span>
                  <span className="rh-why__kwt">{k}</span>
                  <span className="rh-why__kwline" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= 4. SERVICES ================= */}
        <section id="rh-services" className="rh-scene rh-services" data-theme="light">
          <div className="rh-container">
            <div className="rh-services__head">
              <Eyebrow n={4}>RAHAIL</Eyebrow>
              <h2 className="rh-h2" data-split>
                <span className="rh-line"><span>خدماتنا</span></span>
              </h2>
            </div>
            <div className="rh-services__grid">
              {SERVICES.map((s) => (
                <article key={s.n} className="rh-service" data-parallax="6">
                  <Media src={s.img} alt="" />
                  <div className="rh-service__veil" />
                  <span className="rh-service__n rh-en">{s.n}</span>
                  <h3 className="rh-service__title">{s.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. PARTNER INITIATIVE ================= */}
        <section id="rh-partner" className="rh-scene rh-partner" data-theme="light">
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
              <svg className="rh-models__net" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden>
                <path pathLength={1} d="M0 20 H1000" />
              </svg>
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
        </section>

        {/* ================= 6. TOP PARTNER ================= */}
        <section id="rh-top-partner" className="rh-scene rh-top" data-theme="dark">
          <div className="rh-top__bg" data-parallax="10">
            <Media src={MEDIA.topPartner} alt="" />
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
        <section id="rh-packages" className="rh-scene rh-packages" data-theme="light">
          <div className="rh-container rh-packages__intro">
            <Eyebrow n={7}>TOURISM PACKAGES</Eyebrow>
            <h2 className="rh-h2" data-split>
              <span className="rh-line"><span>تصميم الباقات السياحية</span></span>
            </h2>
            <p className="rh-lead" data-reveal>
              تصميم باقات متكاملة تلبي اهتمامات السائح بالتعاون مع الشركات السياحية والمرشدين ومقدمي الخدمات.
            </p>
          </div>

          <div className="rh-steps">
            <div className="rh-steps__bg">
              <Media src={MEDIA.packages} alt="" />
            </div>
            <div className="rh-steps__veil" />
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

          {/* Closing lockup */}
          <div className="rh-closing">
            <Media src={MEDIA.closing} alt="" />
            <div className="rh-closing__veil" />
            <div className="rh-closing__inner">
              <Logo size="lg" />
              <p className="rh-cover__tagline">شركة متخصصة في تطوير الوجهات والمشاريع السياحية.</p>
              <button type="button" className="rh-btn" onClick={() => goTo(0)}>
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
