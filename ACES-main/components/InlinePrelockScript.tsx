/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import Script from "next/script";
import { useId } from "react";

/**
 * Injects a small pre-hydration script that engages page-transition locks
 * immediately on pointerdown for internal links. Uses a unique, stable id.
 */
export default function InlinePrelockScript() {
  const id = useId();
  return (
    <Script
      id={id}
      strategy="beforeInteractive"
    >{`(()=>{try{var reduce=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)===true;if(reduce)return;var isAuto=!!(navigator&&navigator.webdriver===true);function isInternal(a){if(!a)return false;var h=a.getAttribute?(a.getAttribute('href')||''):'';return h.indexOf('/')===0&&h.indexOf('/#')!==0}function clear(){document.body.classList.remove('cursor-hide-transition','pt-disable-scroll','pt-no-events');var ov=document.querySelector('svg.pt-blob-svg');if(ov)ov.setAttribute('data-active','0')}function markOverlayActive(){var ov=document.querySelector('svg.pt-blob-svg');if(ov){ov.setAttribute('data-active','1');return true}return false}if(isAuto){try{document.body.classList.add('cursor-hide-transition','pt-disable-scroll','pt-no-events')}catch(_){};if(!markOverlayActive()){var mo=new MutationObserver(function(){if(markOverlayActive()){try{mo.disconnect()}catch(_){}}});try{mo.observe(document.documentElement,{childList:true,subtree:true})}catch(_){}}setTimeout(clear,2200)}function onClick(e){var t=e.target;if(!t||!t.closest)return;var a=t.closest('a[href]');if(!isInternal(a))return;document.body.classList.add('cursor-hide-transition','pt-disable-scroll','pt-no-events');if(isAuto){setTimeout(clear,2200)}}document.addEventListener('click',onClick,true)}catch(_){}})();`}</Script>
  );
}
