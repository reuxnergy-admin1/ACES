import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
  <div className="grid-shell py-12 grid md:grid-cols-4 gap-8 text-sm text-white/60 container-row">
        <div>
          <div className="text-white/80 uc tracking-wider">ACES Aerodynamics</div>
          <div className="mt-2">SACAA-approved fabrication | MP39</div>
          <div className="mt-2"><a href="mailto:info@acesaerodynamics.com" className="link-underline text-white/80 hover:text-white">info@acesaerodynamics.com</a></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/about/history/">About</Link><br/>
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/products/">Products</Link><br/>
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/services/">Services</Link>
          </div>
          <div className="space-y-2">
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/blog/">Blog</Link><br/>
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/legal/privacy/">Privacy</Link><br/>
            <Link className="link-underline text-white/80 hover:text-white uc tracking-wide" href="/legal/cookies/">Cookies</Link>
          </div>
        </div>
        <div>
          <div className="uc tracking-wider text-white/80">Follow</div>
          <ul className="mt-2 space-y-2">
            <li><a className="link-underline text-white/80 hover:text-white uc tracking-wide" href="https://www.linkedin.com/company/aces-aerodynamics" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a className="link-underline text-white/80 hover:text-white uc tracking-wide" href="https://www.facebook.com/acesaerodynamics" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a className="link-underline text-white/80 hover:text-white uc tracking-wide" href="https://www.instagram.com/acesaerodynamics" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a className="link-underline text-white/80 hover:text-white uc tracking-wide flex items-center gap-2" href="https://wa.me/27600000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.281 5.403 0 12.057 0c3.181 0 6.167 1.24 8.413 3.488a11.79 11.79 0 013.49 8.414c-.002 6.653-5.283 11.934-11.938 11.934a11.95 11.95 0 01-6.002-1.619L.057 24zm6.597-3.807c1.741 1.035 3.276 1.666 5.392 1.666 5.448 0 9.886-4.434 9.889-9.877.003-5.462-4.415-9.89-9.881-9.894-5.452 0-9.89 4.434-9.894 9.888 0 2.225.651 3.891 1.746 5.634l-.999 3.648 3.747-.965zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413z"/></svg>
              WhatsApp
            </a></li>
          </ul>
        </div>
  <div className="text-right md:text-left md:col-span-4">
          <div className="text-white/40">© {new Date().getFullYear()} ACES Aerodynamics</div>
        </div>
      </div>
    </footer>
  );
}
