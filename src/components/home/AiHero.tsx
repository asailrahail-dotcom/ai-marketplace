'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const QUICK_SUGGESTIONS = [
  'أبدأ مشروع من الصفر',
  'أجهز شاليه',
  'أجهز كافيه',
  'أجدد منزلي',
  'أبي مكتب جديد',
];

export function AiHero({ title, subtitle }: { title: string; subtitle: string }) {
  const [value, setValue] = useState('');
  const router = useRouter();

  function submit(text?: string) {
    const q = (text ?? value).trim();
    if (!q) return;
    router.push(`/ai?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="section bg-ink text-paper">
      <div className="container-content max-w-3xl text-center">
        <p className="eyebrow eyebrow-line justify-center mb-5">مشروع AI</p>
        <h1 className="h1">{title}</h1>
        <p className="text-white/70 text-lg mt-4 max-w-xl mx-auto">{subtitle}</p>

        <div className="mt-10 bg-white/5 border border-white/15 rounded-sm p-2 flex flex-col sm:flex-row gap-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            placeholder="اكتب احتياج مشروعك هنا…"
            className="flex-1 bg-transparent resize-none px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
          />
          <button onClick={() => submit()} className="btn bg-green text-white font-semibold px-6 py-3 hover:bg-greenDark">
            ابدأ مع مشروع
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                submit(s);
              }}
              className="text-sm px-4 py-1.5 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <p className="text-white/40 text-xs mt-6">
          مثال: أبي أجهز شاليه من الصفر وأحتاج إضاءة وأثاث ومسبح وكهربائي وسباك.
        </p>
      </div>
    </section>
  );
}
