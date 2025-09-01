"use client";
import clsx from 'clsx';
import { useState } from 'react';

type Props = Readonly<{
  className?: string;
  categories?: string[];
}>;

export default function BlogFilters({ className, categories = ['All','Engineering','Aerospace','Motorsport'] }: Props){
  const [active, setActive] = useState('All');
  return (
    <fieldset className={clsx('container-row mt-6 flex flex-wrap gap-2', className)} data-reveal-blur-stagger>
      <legend className="sr-only">Filter posts</legend>
      {categories.map(cat => (
        <button
          key={cat}
          type="button"
          className={clsx('chip uc tracking-[0.06em]',
            active === cat && 'is-active')}
          aria-pressed={active === cat}
          onClick={() => setActive(cat)}
        >
          {cat}
        </button>
      ))}
    </fieldset>
  );
}
