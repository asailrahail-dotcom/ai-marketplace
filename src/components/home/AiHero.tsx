'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AiHero({ title, subtitle }: { title: string; subtitle: string }) {
  const [value, setValue] = useState('');
  const router = useRouter();

  function submit() {
    if (!value.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <section className="section bg-ink text-paper">
      <div className="container-content max-w-3xl text-center">
        <p className="eyebrow text-white/50 mb-4">مشروع AI</p>
        <h1 className="h1">{title}</h1>
        <p className="text-white/70 text-lg mt-4 max-w-xl mx-auto">{subtitle}</p>

        <div className="mt-10 bg-white/5 border border-white/15 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
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
          <button onClick={submit} className="btn bg-white text-ink font-semibold px-6 py-3 hover:bg-white/90">
            ابدأ مع مشروع
          </button>
        </div>

        <p className="text-white/40 text-xs mt-4">
          مثال: أبي أجهز شاليه من الصفر وأحتاج إضاءة وأثاث ومسبح وكهربائي وسباك.
        </p>
      </div>
    </section>
  );
}
