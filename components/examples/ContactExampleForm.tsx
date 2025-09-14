"use client";
import { useId } from 'react';

export default function ContactExampleForm() {
  const nameId = useId();
  const emailId = useId();
  const msgId = useId();
  return (
    <form className="grid-12 gutter w-full" onSubmit={(e) => e.preventDefault()} data-reveal-stagger>
      <label className="span-6 block" htmlFor={nameId}>Name</label>
      <input id={nameId} name="name" className="span-6 mt-2 w-full p-3 bg-black border border-white/30 rounded" required />

      <label className="span-6 block mt-6 md:mt-0" htmlFor={emailId}>Email</label>
      <input id={emailId} name="email" type="email" className="span-6 mt-2 w-full p-3 bg-black border border-white/30 rounded" required />

      <label className="span-12 block mt-6" htmlFor={msgId}>Message</label>
      <textarea id={msgId} name="msg" rows={6} className="span-12 mt-2 w-full p-3 bg-black border border-white/30 rounded" />
      <div className="span-12 mt-6">
  <button type="submit" className="button-solid button--md arrow-shift"><span className="btn-tail"><span>Send</span> <span className="arrow" aria-hidden>→</span></span></button>
      </div>
    </form>
  );
}
