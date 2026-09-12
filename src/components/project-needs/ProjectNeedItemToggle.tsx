'use client';

import { useTransition } from 'react';
import { toggleProjectNeedItem } from '@/app/actions/project-needs';

export function ProjectNeedItemToggle({
  itemId,
  label,
  done,
}: {
  itemId: string;
  label: string;
  done: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        defaultChecked={done}
        disabled={pending}
        onChange={() =>
          startTransition(async () => {
            await toggleProjectNeedItem(itemId);
          })
        }
        className="w-4 h-4"
      />
      <span className={done ? 'line-through text-muted' : 'font-medium'}>{label}</span>
    </label>
  );
}
