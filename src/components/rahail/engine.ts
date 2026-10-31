/**
 * RAHAIL presentation engine — all motion and navigation, as plain DOM code.
 * Used by the Next.js page and by the standalone preview build, so both
 * behave identically.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

export function initRahail(scope: HTMLElement): () => void {
  const html = document.documentElement;
  html.classList.add('rh-root');

  const scenes = Array.from(scope.querySelectorAll<HTMLElement>('[data-scene]'));
  const labels = scenes.map((s) => s.dataset.label || '');
  const themes = scenes.map((s) => s.dataset.theme || 'light');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const q = <T extends Element = HTMLElement>(sel: string) => scope.querySelector<T>(sel);
  const qa = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, scope);

  const prevBtn = q<HTMLButtonElement>('[data-nav="prev"]');
  const nextBtn = q<HTMLButtonElement>('[data-nav="next"]');
  const dots = qa<HTMLButtonElement>('.rh-rail__dot');
  const labelEl = q('.rh-header__label');
  const countEl = q('.rh-header__count b');

  let active = -1;
  let anchors: HTMLElement[] = scenes;
  let lenis: Lenis | null = null;

  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    scope.dataset.uiTheme = themes[i];
    if (labelEl) labelEl.textContent = labels[i];
    if (countEl) countEl.textContent = pad(i + 1);
    dots.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      if (k === i) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === scenes.length - 1;
  };

  const goTo = (index: number) => {
    const i = Math.max(0, Math.min(scenes.length - 1, index));
    const el = anchors[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (lenis) lenis.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- controls ---------- */
  const listeners: Array<[EventTarget, string, EventListener]> = [];
  const on = (t: EventTarget | null, ev: string, fn: EventListener) => {
    if (!t) return;
    t.addEventListener(ev, fn);
    listeners.push([t, ev, fn]);
  };
  on(prevBtn, 'click', () => goTo(active - 1));
  on(nextBtn, 'click', () => goTo(active + 1));
  dots.forEach((d, i) => on(d, 'click', () => goTo(i)));
  scope.querySelectorAll('[data-nav="home"]').forEach((b) => on(b, 'click', () => goTo(0)));
  on(window, 'keydown', ((e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && ['INPUT', 'TEXTAREA'].includes(t.tagName)) return;
    const k = e.key;
    if (['ArrowDown', 'PageDown', 'ArrowLeft'].includes(k) || (k === ' ' && !e.shiftKey)) {
      e.preventDefault();
      goTo(active + 1);
    } else if (['ArrowUp', 'PageUp', 'ArrowRight'].includes(k) || (k === ' ' && e.shiftKey)) {
      e.preventDefault();
      goTo(active - 1);
    } else if (k === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (k === 'End') {
      e.preventDefault();
      goTo(scenes.length - 1);
    }
  }) as EventListener);

  /* ---------- smooth scroll ---------- */
  const raf = (time: number) => lenis?.raf(time * 1000);
  if (!reduce) {
    lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const ctx = gsap.context(() => {
    /* ---------- preloader ---------- */
    const counter = { v: 0 };
    const preCount = q('.rh-pre__count');
    gsap
      .timeline({
        onComplete: () => {
          scope.classList.add('is-loaded');
          lenis?.start();
        },
      })
      .from('.rh-pre__logo', { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' })
      .to(counter, {
        v: 100,
        duration: reduce ? 0.2 : 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (preCount) preCount.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
      }, 0.2)
      .to('.rh-pre__bar i', { scaleX: 1, duration: reduce ? 0.2 : 1.6, ease: 'power2.inOut' }, 0.2)
      .to('.rh-pre__inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
      .to('.rh-pre', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
      .from('.rh-cover__word', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, '-=0.6')
      .from('.rh-cover__window', { scale: 0.85, opacity: 0, duration: 1.6, ease: 'expo.out' }, '<')
      .from('.rh-cover__frame', { opacity: 0, duration: 1.4 }, '<0.2')
      .from('.rh-header, .rh-rail, .rh-controls, .rh-cover__hint', { opacity: 0, y: 10, duration: 1, stagger: 0.06 }, '<0.3');

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
      },
      (c) => {
        const { desktop } = c.conditions as { desktop: boolean };

        /* 1 — the arch window opens onto the brand entrance */
        const startClip = desktop
          ? 'inset(15% 37% 11% 37% round 999px 999px 14px 14px)'
          : 'inset(22% 14% 18% 14% round 999px 999px 12px 12px)';
        gsap.set('.rh-cover__window', { clipPath: startClip });
        gsap
          .timeline({ scrollTrigger: { trigger: '.rh-cover', start: 'top top', end: '+=170%', scrub: 1, pin: true, anticipatePin: 1 } })
          .fromTo('.rh-cover__window', { clipPath: startClip }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power1.inOut', duration: 1 }, 0)
          .fromTo('.rh-cover__window img', { scale: 1.45 }, { scale: 1.05, ease: 'none', duration: 1.5 }, 0)
          .to('.rh-cover__frame', { scale: 1.6, opacity: 0, ease: 'power1.in', duration: 0.6 }, 0)
          .to('.rh-cover__clip', { opacity: 0, ease: 'power1.inOut', duration: 0.45 }, 0.3)
          .to('.rh-cover__side--start', { xPercent: desktop ? 45 : 0, yPercent: desktop ? 0 : -60, opacity: 0, duration: 0.7 }, 0)
          .to('.rh-cover__side--end', { xPercent: desktop ? -45 : 0, yPercent: desktop ? 0 : 60, opacity: 0, duration: 0.7 }, 0)
          .to('.rh-cover__hint', { opacity: 0, duration: 0.2 }, 0)
          .to('.rh-cover__shade', { opacity: 1, duration: 0.5 }, 0.6)
          .fromTo('.rh-cover__lockup > *', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.5, ease: 'power3.out' }, 0.75)
          .to({}, { duration: 0.3 });

        /* 3 — triangles open one by one, as in the profile */
        const kws = qa('.rh-why__kw');
        if (desktop) {
          const why = gsap.timeline({ scrollTrigger: { trigger: '.rh-why', start: 'top top', end: '+=220%', scrub: 1, pin: true, anticipatePin: 1 } });
          why.fromTo('.rh-why__statement .rh-w', { opacity: 0.16 }, { opacity: 1, stagger: 0.05, duration: 0.3 }, 0);
          kws.forEach((kw, i) => {
            const up = kw.classList.contains('is-up');
            why.fromTo(kw.querySelector('.rh-tri'), { opacity: 0, y: up ? 60 : -60, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.7 + i * 0.45);
            why.fromTo(kw.querySelector('.rh-why__kwt'), { opacity: 0.18 }, { opacity: 1, duration: 0.35 }, 0.85 + i * 0.45);
            why.fromTo(kw.querySelector('.rh-why__kwline'), { scaleX: 0 }, { scaleX: 1, duration: 0.35 }, 0.85 + i * 0.45);
          });
          why.to({}, { duration: 0.4 });
        } else {
          gsap.fromTo('.rh-why__statement .rh-w', { opacity: 0.16 }, {
            opacity: 1, stagger: 0.05,
            scrollTrigger: { trigger: '.rh-why__statement', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
          });
          kws.forEach((kw) => {
            gsap.from(kw.querySelector('.rh-tri'), { opacity: 0, scale: 0.8, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: kw, start: 'top 88%' } });
            gsap.fromTo(kw.querySelector('.rh-why__kwline'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: kw, start: 'top 85%' } });
          });
        }

        /* 7 — horizontal journey through the six steps */
        const track = q('.rh-steps__track');
        const viewport = q('.rh-steps__viewport');
        if (desktop && track && viewport) {
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
            .fromTo('.rh-steps__zig', { xPercent: 0 }, { xPercent: 12, ease: 'none', duration: 1 }, 0);
          qa('.rh-step').forEach((s, i) => {
            steps.fromTo(s, { opacity: i < 2 ? 1 : 0.25 }, { opacity: 1, duration: 0.12 }, Math.max(0, (i - 1.6) / 5));
          });
        } else {
          qa('.rh-step').forEach((s) => {
            gsap.from(s, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%' } });
          });
        }

        /* Experience reel — arches open one after another, then drift at different speeds */
        gsap.fromTo('.rh-reel__arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 6px 6px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 999px 999px 6px 6px)', duration: 1.8, ease: 'expo.inOut', stagger: 0.18,
          scrollTrigger: { trigger: '.rh-reel', start: 'top 75%' },
        });
        gsap.from('.rh-reel__label', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.18, delay: 0.8, scrollTrigger: { trigger: '.rh-reel', start: 'top 75%' } });
        if (desktop) {
          qa('.rh-reel__item').forEach((el, i) => {
            gsap.fromTo(el, { y: [40, 140][i] ?? 0 }, {
              y: [-60, 0][i] ?? 0, ease: 'none',
              scrollTrigger: { trigger: '.rh-reel', start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });
        }

        /* Experiences film strip: drifts with scroll on top of its own loop */
        gsap.fromTo('.rh-film', { xPercent: -6 }, {
          xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: '.rh-film', start: 'top bottom', end: 'bottom top', scrub: true },
        });

        /* Generic reveals */
        qa('[data-reveal]').forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
        });
        qa('[data-split]').forEach((el) => {
          gsap.from(el.querySelectorAll('.rh-line > span'), { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
        qa('.rh-zig').forEach((el) => {
          gsap.fromTo(el.querySelectorAll('path'), { strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: 0.2,
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
        });

        /* 2 — word-by-word reading + arch curtain */
        gsap.fromTo('.rh-about__text .rh-w', { opacity: 0.15 }, {
          opacity: 1, stagger: 0.04, ease: 'none',
          scrollTrigger: { trigger: '.rh-about__text', start: 'top 80%', end: 'bottom 50%', scrub: 1 },
        });
        gsap.fromTo('.rh-about__media', { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
          scrollTrigger: { trigger: '.rh-about__media', start: 'top 80%' },
        });

        /* Parallax inside framed photos */
        qa('[data-parallax]').forEach((el) => {
          const img = el.querySelector('img');
          if (!img) return;
          const amt = Number(el.dataset.parallax || 10);
          gsap.fromTo(img, { yPercent: -amt, scale: 1.2 }, {
            yPercent: amt, scale: 1.2, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        /* 4 — panels rise like curtains */
        qa('.rh-service').forEach((p, i) => {
          gsap.fromTo(p, { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: i * 0.15,
            scrollTrigger: { trigger: '.rh-services__grid', start: 'top 80%' },
          });
          gsap.from(p.querySelectorAll('.rh-service__n, .rh-service__title'), {
            y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 0.7 + i * 0.15,
            scrollTrigger: { trigger: '.rh-services__grid', start: 'top 80%' },
          });
        });

        /* 5 — cards stagger in, icons draw themselves */
        gsap.from('.rh-model', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.rh-models', start: 'top 82%' } });
        gsap.fromTo('.rh-model .rh-draw', { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.04,
          scrollTrigger: { trigger: '.rh-models', start: 'top 75%' },
        });

        /* 6 — giant outline type drifts, reward card rises */
        gsap.fromTo('.rh-top__giant', { xPercent: 12 }, {
          xPercent: -12, ease: 'none',
          scrollTrigger: { trigger: '.rh-top', start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.from('.rh-reward', { y: 60, opacity: 0, scale: 0.96, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rh-reward', start: 'top 85%' } });
        gsap.from('.rh-goal-chip', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.rh-goals', start: 'top 92%' } });

        /* Closing */
        gsap.fromTo('.rh-closing img', { scale: 1.3 }, {
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

    /* ---------- active scene tracking (after pins exist) ---------- */
    anchors = scenes.map((el) => {
      const parent = el.parentElement;
      return parent && parent.classList.contains('pin-spacer') ? parent : el;
    });
    anchors.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: i === anchors.length - 1 ? 'max' : 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    setActive(0);
  }, scope);

  /* ---------- videos play only while on screen ---------- */
  const videos = Array.from(scope.querySelectorAll<HTMLVideoElement>('video[data-autoplay]'));
  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target as HTMLVideoElement;
        if (en.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: 0.05 });
    videos.forEach((v) => io!.observe(v));
  }
  if (reduce) videos.forEach((v) => v.pause());

  const refresh = () => ScrollTrigger.refresh();
  on(window, 'load', refresh);
  document.fonts?.ready.then(refresh);

  return () => {
    listeners.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn));
    io?.disconnect();
    ctx.revert();
    gsap.ticker.remove(raf);
    lenis?.destroy();
    html.classList.remove('rh-root');
  };
}
