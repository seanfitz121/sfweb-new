import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ─── Theme Context ───
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try { setDark(localStorage.getItem("sfweb-theme") === "dark"); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("sfweb-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
}

// ─── Router Context ───
const RouterContext = createContext();
const useRouter = () => useContext(RouterContext);

function Router({ children }) {
  const [path, setPath] = useState("/");
  useEffect(() => {
    setPath(window.location.hash.slice(1) || "/");
    const handler = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = useCallback((to) => { window.location.hash = to; }, []);
  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

// ─── Scroll Animation Hook ───
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-element ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Icons ───
const Icons = {
  sun: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  moon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  target: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  zap: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  search: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  compass: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  pen: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  check: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  rocket: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  checkSmall: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  mapPin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  external: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ─── Components ───
function Button({ children, variant = "primary", size = "md", onClick, className = "", full = false }) {
  const base = `btn btn-${variant} btn-${size} ${full ? "btn-full" : ""} ${className}`;
  return <button className={base} onClick={onClick}>{children}</button>;
}

function NavLink({ to, children, onClick }) {
  const { path, navigate } = useRouter();
  const active = path === to;
  return (
    <a
      href={`#${to}`}
      className={`nav-link ${active ? "active" : ""}`}
      onClick={(e) => { e.preventDefault(); navigate(to); onClick?.(); window.scrollTo(0, 0); }}
    >
      {children}
    </a>
  );
}

// ─── Header ───
function Header() {
  const { dark, toggle } = useTheme();
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#/" className="logo" onClick={(e) => { e.preventDefault(); navigate("/"); window.scrollTo(0, 0); }}>
          <span className="logo-sf">SF</span><span className="logo-web">Web</span>
        </a>
        <nav className="nav-desktop">
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? Icons.sun : Icons.moon}
          </button>
          <Button variant="primary" size="sm" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }} className="header-cta">
            Start Your Project
          </Button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-nav">
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/portfolio" onClick={closeMenu}>Portfolio</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <Button variant="primary" full onClick={() => { navigate("/contact"); closeMenu(); window.scrollTo(0, 0); }}>
            Start Your Project
          </Button>
        </nav>
      </div>
    </header>
  );
}

// ─── Footer ───
function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#/" className="logo" onClick={(e) => { e.preventDefault(); navigate("/"); window.scrollTo(0, 0); }}>
              <span className="logo-sf">SF</span><span className="logo-web">Web</span>
            </a>
            <p className="footer-tagline">Premium web design for local service businesses.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <NavLink to="/services">Template Setup</NavLink>
            <NavLink to="/services">Custom Website</NavLink>
            <NavLink to="/services">SEO Packages</NavLink>
            <NavLink to="/services">Hosting & Maintenance</NavLink>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p className="footer-contact-item">{Icons.mail} sean@sfweb.ie</p>
            <p className="footer-contact-item">{Icons.phone} +353 85 841 6639</p>
            <p className="footer-contact-item">{Icons.mapPin} Ireland</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SFWeb. All rights reserved.</p>
          <div className="footer-legal">
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms of Service</NavLink>
          </div>
          <p className="footer-credit">Website designed by SFWeb</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ───
function HomePage() {
  const { navigate } = useRouter();
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <Reveal>
            <p className="hero-badge">Web Design for Local Businesses</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="hero-headline">Websites That Turn Local Visitors Into Paying&nbsp;Customers.</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="hero-sub">Premium websites built specifically for local service businesses who want to look professional and generate real enquiries.</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="hero-actions">
              <Button variant="primary" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Start Your Project {Icons.arrow}</Button>
              <Button variant="ghost" onClick={() => { navigate("/portfolio"); window.scrollTo(0, 0); }}>View Our Work {Icons.arrow}</Button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <p className="hero-trust">Built for plumbers, electricians, trades & service businesses.</p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">Why Local Businesses Choose SFWeb</h2></Reveal>
          <div className="pillars-grid">
            {[
              { icon: Icons.target, title: "Built for Local Businesses", desc: "We specialise in designing websites exclusively for local service businesses. Every decision is tailored to your market, your customers, and your goals." },
              { icon: Icons.zap, title: "Designed to Convert", desc: "Your website isn't a brochure — it's your best salesperson. Every layout, button, and page is crafted to turn visitors into real paying customers." },
              { icon: Icons.search, title: "SEO-Ready from Day One", desc: "Every site is built with clean structure, fast load times, and on-page SEO fundamentals so local customers can actually find you on Google." },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="pillar-card">
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Tiers */}
      <section className="section section-alt">
        <div className="container">
          <Reveal><h2 className="section-title">Two Clear Paths Forward</h2></Reveal>
          <Reveal delay={50}><p className="section-sub">Whether you're just getting started or ready for something fully custom — we've got you covered.</p></Reveal>
          <div className="tiers-grid">
            <Reveal delay={100}>
              <div className="tier-card">
                <span className="tier-badge">Best for Getting Started</span>
                <h3>Template Setup</h3>
                <p className="tier-desc">A professional, polished website built on a premium template — perfect for getting online fast.</p>
                <ul className="tier-features">
                  {["3-page professional website", "Mobile responsive design", "Template customisation", "Content setup assistance", "Contact form integration", "Deployment & launch", "Basic on-page SEO", "Upgrade path to custom"].map((f, i) => (
                    <li key={i}>{Icons.checkSmall} {f}</li>
                  ))}
                </ul>
                <Button variant="outline" full onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Get Started {Icons.arrow}</Button>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="tier-card tier-featured">
                <span className="tier-badge tier-badge-featured">Best Value · Popular</span>
                <h3>Custom Website</h3>
                <p className="tier-desc">A fully bespoke website designed from scratch to match your brand and maximise conversions.</p>
                <ul className="tier-features">
                  {["Fully bespoke design", "Unique branding & identity", "Unlimited design revisions", "Advanced features & integrations", "Custom animations & interactions", "Advanced SEO setup", "Priority ongoing support", "Built for growth"].map((f, i) => (
                    <li key={i}>{Icons.checkSmall} {f}</li>
                  ))}
                </ul>
                <Button variant="primary" full onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Start Your Project {Icons.arrow}</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">How We Work</h2></Reveal>
          <Reveal delay={50}><p className="section-sub">A straightforward, transparent process from first conversation to launch day.</p></Reveal>
          <div className="process-grid">
            {[
              { icon: Icons.compass, num: "01", title: "Discovery", desc: "We learn about your business, goals, and customers to build a clear project brief." },
              { icon: Icons.pen, num: "02", title: "Design & Build", desc: "Your website is designed and developed with constant attention to detail and performance." },
              { icon: Icons.check, num: "03", title: "Review & Refine", desc: "You review the site, give feedback, and we refine until everything is exactly right." },
              { icon: Icons.rocket, num: "04", title: "Launch & Support", desc: "We deploy your site, handle the technical setup, and provide ongoing support." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="process-step">
                  <span className="process-num">{s.num}</span>
                  <div className="process-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section section-alt">
        <div className="container">
          <Reveal><h2 className="section-title">Recent Work</h2></Reveal>
          <Reveal delay={50}><p className="section-sub">A selection of websites we've designed and built.</p></Reveal>
          <div className="portfolio-grid">
            {[
              { title: "PlateProgress", type: "Fitness Tracking Application", desc: "Complete full-stack build — front-end, back-end, and database for a fitness tracking platform.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=375&fit=crop", url: "https://plateprogress.com/", urlLabel: "Visit" },
              { title: "Swift Plumbing", type: "Plumbing Services · Demo", desc: "Professional demo site for a plumbing business with service pages and enquiry forms.", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=375&fit=crop", url: "https://swiftplumbing.replit.app/", demo: true },
              { title: "Mobile Car Valet", type: "Car Valeting · Demo", desc: "Clean demo website for a mobile car valeting service with booking functionality.", img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=375&fit=crop", url: "https://mobile-valet-demo-t93i.vercel.app/", demo: true },
              { title: "Elite Roofing Co", type: "Roofing Contractor · Demo", desc: "Modern demo site for a roofing contractor showcasing services and generating leads.", img: "https://images.unsplash.com/photo-1632178050091-f37adab56d71?w=600&h=375&fit=crop", url: "https://demo-sites-a.vercel.app/", demo: true },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="portfolio-card">
                  <div className="portfolio-thumb">
                    <img src={p.img} alt={p.title} className="portfolio-img" loading="lazy" />
                    <div className="portfolio-overlay" onClick={() => { navigate("/portfolio"); window.scrollTo(0, 0); }}>
                      <span>View Details {Icons.arrow}</span>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="portfolio-type">{p.type}</span>
                      {p.demo && <span className="demo-badge">Demo</span>}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm portfolio-demo-btn" onClick={(e) => e.stopPropagation()}>
                        {p.urlLabel || "View Live Demo"} {Icons.external}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section cta-section">
        <div className="container cta-content">
          <Reveal><h2>Ready to Elevate Your Online Presence?</h2></Reveal>
          <Reveal delay={100}><p>Let's build a website that works as hard as you do.</p></Reveal>
          <Reveal delay={200}>
            <Button variant="primary" size="lg" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Start Your Project {Icons.arrow}</Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ─── Services Page ───
function ServicesPage() {
  const { navigate } = useRouter();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <Reveal><h1>Our Services</h1></Reveal>
          <Reveal delay={100}><p>Everything you need to get online, look professional, and start generating enquiries.</p></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">Who This Is For</h2></Reveal>
          <div className="who-grid">
            {["Plumbers & tradespeople", "Electricians & contractors", "Cleaning services", "Beauty salons & barbers", "Landscapers & gardeners", "Any local service business"].map((item, i) => (
              <Reveal key={i} delay={i * 80}><div className="who-item">{Icons.checkSmall} {item}</div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal><h2 className="section-title">Template vs Custom</h2></Reveal>
          <div className="comparison-table">
            <Reveal>
              <div className="comp-header">
                <div className="comp-feature">Feature</div>
                <div className="comp-col">Template</div>
                <div className="comp-col comp-col-featured">Custom</div>
              </div>
            </Reveal>
            {[
              ["Unique design", "Customised template", "Built from scratch"],
              ["Pages included", "Up to 3", "Unlimited"],
              ["Design revisions", "2 rounds", "Unlimited"],
              ["Custom animations", "—", "✓"],
              ["Advanced SEO", "Basic", "Full setup"],
              ["Priority support", "—", "✓"],
              ["Timeline", "1–2 weeks", "3–6 weeks"],
              ["Branding integration", "Basic", "Full identity"],
            ].map(([feat, temp, cust], i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="comp-row">
                  <div className="comp-feature">{feat}</div>
                  <div className="comp-col">{temp}</div>
                  <div className="comp-col comp-col-featured">{cust}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><h2 className="section-title">Optional Add-Ons</h2></Reveal>
          <div className="addons-grid">
            {[
              { title: "SEO Packages", desc: "Ongoing search engine optimisation to keep you ranking and visible in your local area." },
              { title: "Hosting & Maintenance", desc: "Reliable hosting, regular updates, security monitoring, and performance optimisation." },
              { title: "Booking Integrations", desc: "Let customers book appointments or request quotes directly from your website." },
              { title: "Analytics Setup", desc: "Google Analytics and Search Console configured so you can track what's working." },
            ].map((a, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="addon-card">
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-content">
          <Reveal><h2>Not Sure Which Option Is Right for You?</h2></Reveal>
          <Reveal delay={100}><p>Get in touch and we'll help you figure out the best path forward — no pressure, no obligation.</p></Reveal>
          <Reveal delay={200}><Button variant="primary" size="lg" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Request a Proposal {Icons.arrow}</Button></Reveal>
        </div>
      </section>
    </main>
  );
}

// ─── Portfolio Page ───
function PortfolioPage() {
  const { navigate } = useRouter();
  const projects = [
    { title: "PlateProgress", type: "Fitness Tracking Application", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop", challenge: "Needed a complete full-stack fitness tracking platform built from the ground up — front-end, back-end, and database.", solution: "A fully custom web application with user authentication, workout logging, progress tracking, and a responsive dashboard — built end to end.", features: ["Full-stack development", "Database design", "User authentication", "Progress dashboards", "Responsive UI", "API development"], demo: false, url: "https://plateprogress.com/", urlLabel: "Visit" },
    { title: "Swift Plumbing", type: "Plumbing Services", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=500&fit=crop", challenge: "Demo project exploring how a plumbing business could establish a professional, conversion-focused online presence.", solution: "A clean, fast-loading responsive demo site with clear service pages, prominent contact forms, and local SEO structure.", features: ["Responsive design", "Contact forms", "Service pages", "Google Maps integration", "Local SEO"], demo: true, url: "https://swiftplumbing.replit.app/" },
    { title: "Mobile Car Valet", type: "Car Valeting Service", img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=500&fit=crop", challenge: "Proof of concept for a mobile car valeting service that needs online booking and a polished brand presence.", solution: "Demo website with clean design, service breakdowns, booking flow, and mobile-first layout tailored for on-the-go customers.", features: ["Online booking flow", "Service pricing", "Mobile-first design", "Brand identity", "Contact integration"], demo: true, url: "https://mobile-valet-demo-t93i.vercel.app/" },
    { title: "Elite Roofing Co", type: "Roofing Contractor", img: "https://images.unsplash.com/photo-1632178050091-f37adab56d71?w=800&h=500&fit=crop", challenge: "Demo exploring how a roofing contractor could showcase services and generate leads through a modern website.", solution: "Professional demo site with strong visual hierarchy, service breakdowns, trust signals, and a streamlined enquiry flow.", features: ["Service showcases", "Lead generation", "Trust badges", "Responsive layout", "SEO structure"], demo: true, url: "https://demo-sites-a.vercel.app/" },
  ];
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <Reveal><h1>Our Portfolio</h1></Reveal>
          <Reveal delay={100}><p>A showcase of our work — from full-stack applications to demo sites built for local businesses.</p></Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="case-studies">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="case-card">
                  <div className="case-thumb">
                    <img src={p.img} alt={p.title} className="portfolio-img" loading="lazy" />
                  </div>
                  <div className="case-body">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span className="portfolio-type">{p.type}</span>
                      {p.demo && <span className="demo-badge">Demo</span>}
                    </div>
                    <h3>{p.title}</h3>
                    <div className="case-section"><strong>The Challenge:</strong> {p.challenge}</div>
                    <div className="case-section"><strong>The Solution:</strong> {p.solution}</div>
                    <div className="case-features">
                      {p.features.map((f, j) => <span key={j} className="case-tag">{f}</span>)}
                    </div>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm case-demo-btn">
                        {p.urlLabel || "View Live Demo"} {Icons.external}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section cta-section">
        <div className="container cta-content">
          <Reveal><h2>Want Results Like These?</h2></Reveal>
          <Reveal delay={100}><p>Let's talk about what we can build for your business.</p></Reveal>
          <Reveal delay={200}><Button variant="primary" size="lg" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Start Your Project {Icons.arrow}</Button></Reveal>
        </div>
      </section>
    </main>
  );
}

// ─── About Page ───
function AboutPage() {
  const { navigate } = useRouter();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <Reveal><h1>About SFWeb</h1></Reveal>
          <Reveal delay={100}><p>We design websites that help local service businesses look professional and win more customers.</p></Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container about-content">
          <Reveal>
            <div className="about-block">
              <h2>Who We Are</h2>
              <p>SFWeb is a specialist web design service focused exclusively on local service businesses in Ireland. We don't try to be everything to everyone — we've chosen to get really good at one thing: building websites that help trades and service businesses look professional and generate real enquiries.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="about-block">
              <h2>Why Local Businesses?</h2>
              <p>Because local businesses deserve better than generic template sites and overpriced agencies. You work hard running your business — your website should work just as hard. We understand the local market, we know what your customers expect, and we build websites that deliver results.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="about-block">
              <h2>Our Philosophy</h2>
              <p>We believe a great website should be three things: beautiful, functional, and effective. Every design choice serves a purpose. Every page is built with your customer's journey in mind. No fluff, no filler — just clean, professional websites that convert visitors into customers.</p>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="about-block">
              <h2>Our Commitment to Quality</h2>
              <p>We don't cut corners. Every site is hand-crafted, rigorously tested across all devices, optimised for speed and search engines, and built with clean, maintainable code. We stand behind our work because your success is our reputation.</p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section cta-section">
        <div className="container cta-content">
          <Reveal><h2>Ready to Work Together?</h2></Reveal>
          <Reveal delay={100}><p>Let's have a conversation about your business and what you need.</p></Reveal>
          <Reveal delay={200}><Button variant="primary" size="lg" onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}>Start Your Project {Icons.arrow}</Button></Reveal>
        </div>
      </section>
    </main>
  );
}

// ─── Contact Page ───
function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", type: "", budget: "", message: "" });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main>
        <section className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <div className="success-icon">{Icons.check}</div>
            <h2 style={{ marginTop: "1.5rem" }}>Thank You!</h2>
            <p style={{ marginTop: "1rem", opacity: 0.7 }}>Your message has been received. We'll be in touch within 24 hours.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <Reveal><h1>Get In Touch</h1></Reveal>
          <Reveal delay={100}><p>Tell us about your project and we'll get back to you within 24 hours with a clear next step.</p></Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <Reveal>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" required value={form.name} onChange={update("name")} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Business Name *</label>
                  <input type="text" required value={form.business} onChange={update("business")} placeholder="Your business name" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={form.email} onChange={update("email")} placeholder="you@business.ie" />
                </div>
                <div className="form-group">
                  <label>Phone (optional)</label>
                  <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+353 85 841 6639" />
                </div>
                <div className="form-group">
                  <label>Project Type *</label>
                  <select required value={form.type} onChange={update("type")}>
                    <option value="">Select an option</option>
                    <option>Template Setup</option>
                    <option>Custom Website</option>
                    <option>Not Sure Yet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget Range</label>
                  <select value={form.budget} onChange={update("budget")}>
                    <option value="">Select a range</option>
                    <option>Under €1,000</option>
                    <option>€1,000 – €2,500</option>
                    <option>€2,500 – €5,000</option>
                    <option>€5,000+</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-full">
                <label>Tell Us About Your Project *</label>
                <textarea required value={form.message} onChange={update("message")} rows={5} placeholder="What does your business do? What are you looking for in a website?" />
              </div>
              {error && <p className="form-error">{error}</p>}
              <Button variant="primary" size="lg" full className={submitting ? "btn-loading" : ""}>
                {submitting ? "Sending…" : "Request Proposal"} {!submitting && Icons.arrow}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ─── Privacy & Terms Pages ───
function PrivacyPage() {
  return (
    <main>
      <section className="page-hero"><div className="container"><Reveal><h1>Privacy Policy</h1></Reveal></div></section>
      <section className="section"><div className="container legal-content">
        <h2>Information We Collect</h2>
        <p>When you contact us through our website, we collect the information you provide including your name, email address, phone number, and any details about your project. We use this information solely to respond to your enquiry and provide our services.</p>
        <h2>How We Use Your Information</h2>
        <p>We use your personal information to communicate with you about your project, provide our web design services, and improve our website. We do not sell, trade, or share your personal information with third parties.</p>
        <h2>Cookies</h2>
        <p>Our website uses minimal cookies for essential functionality such as remembering your theme preference. We do not use tracking or advertising cookies.</p>
        <h2>Your Rights</h2>
        <p>Under GDPR, you have the right to access, rectify, or delete your personal data. Contact us at sean@sfweb.ie for any data-related requests.</p>
        <h2>Contact</h2>
        <p>If you have questions about this privacy policy, please contact us at sean@sfweb.ie.</p>
      </div></section>
    </main>
  );
}

function TermsPage() {
  return (
    <main>
      <section className="page-hero"><div className="container"><Reveal><h1>Terms of Service</h1></Reveal></div></section>
      <section className="section"><div className="container legal-content">
        <h2>Services</h2>
        <p>SFWeb provides web design and development services for local businesses. The specific scope, deliverables, and timeline for each project will be agreed upon before work begins.</p>
        <h2>Payment</h2>
        <p>Payment terms will be outlined in your individual project proposal. A deposit is required before work commences, with the balance due upon project completion and before launch.</p>
        <h2>Intellectual Property</h2>
        <p>Upon full payment, all website design files and code created for your project are transferred to you. SFWeb retains the right to showcase the work in our portfolio.</p>
        <h2>Limitation of Liability</h2>
        <p>SFWeb provides services on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
        <h2>Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the current terms.</p>
      </div></section>
    </main>
  );
}

// ─── App ───
function AppRoutes() {
  const { path } = useRouter();
  switch (path) {
    case "/services": return <ServicesPage />;
    case "/portfolio": return <PortfolioPage />;
    case "/about": return <AboutPage />;
    case "/contact": return <ContactPage />;
    case "/privacy": return <PrivacyPage />;
    case "/terms": return <TermsPage />;
    default: return <HomePage />;
  }
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <ThemeProvider>
      <Router>
        <ThemeWrapper mounted={mounted} />
      </Router>
    </ThemeProvider>
  );
}

function ThemeWrapper({ mounted }) {
  const { dark } = useTheme();
  return (
    <div className={`app ${dark ? "dark" : "light"} ${mounted ? "mounted" : ""}`}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Playfair Display', serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --radius: 12px;
  --radius-lg: 20px;
  --gradient: linear-gradient(135deg, #0ea5e9, #0d9488);
  --gradient-hover: linear-gradient(135deg, #0284c7, #0f766e);
}

.light {
  --bg: #F8FAFC;
  --bg-alt: #F1F5F9;
  --surface: #FFFFFF;
  --border: #E2E8F0;
  --text: #0F172A;
  --text-secondary: #64748B;
  --text-tertiary: #94A3B8;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.08);
  --shadow-xl: 0 20px 50px rgba(0,0,0,0.1);
}

.dark {
  --bg: #0B1120;
  --bg-alt: #111827;
  --surface: #1E293B;
  --border: #1E293B;
  --text: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.3);
  --shadow-xl: 0 20px 50px rgba(0,0,0,0.4);
}

.app {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background 0.4s var(--ease), color 0.4s var(--ease);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Reveal Animation ── */
.reveal-element {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.reveal-element.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Header ── */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  transition: background 0.4s var(--ease), box-shadow 0.3s ease;
  border-bottom: 1px solid transparent;
}
.header-scrolled {
  box-shadow: var(--shadow);
  border-bottom-color: var(--border);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.logo {
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  gap: 2px;
}
.logo-sf {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.logo-web { color: var(--text); }

.nav-desktop {
  display: flex;
  gap: 8px;
}
.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.925rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}
.nav-link:hover, .nav-link.active {
  color: var(--text);
  background: var(--bg-alt);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.theme-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: color 0.2s, background 0.2s;
}
.theme-toggle:hover { color: var(--text); background: var(--bg-alt); }

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 8px;
}

.mobile-menu {
  display: none;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s var(--ease);
}
.mobile-menu.open { max-height: 400px; }
.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 4px;
}
.mobile-nav .nav-link {
  padding: 12px 16px;
  font-size: 1rem;
}
.mobile-nav .btn { margin-top: 12px; }

@media (max-width: 768px) {
  .nav-desktop, .header-cta { display: none; }
  .menu-toggle { display: flex; }
  .mobile-menu { display: block; }
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s var(--ease);
  text-decoration: none;
  white-space: nowrap;
}
.btn-sm { font-size: 0.875rem; padding: 10px 20px; }
.btn-md { font-size: 0.925rem; padding: 13px 28px; }
.btn-lg { font-size: 1rem; padding: 16px 36px; }
.btn-full { width: 100%; }
.btn-primary {
  background: var(--gradient);
  color: #fff;
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.25);
}
.btn-primary:hover {
  background: var(--gradient-hover);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.35);
  transform: translateY(-1px);
}
.btn-outline {
  background: transparent;
  color: var(--text);
  border: 1.5px solid var(--border);
}
.btn-outline:hover {
  border-color: var(--text-tertiary);
  background: var(--bg-alt);
}
.btn-ghost {
  background: var(--surface);
  color: var(--text);
  border: 1.5px solid var(--border);
}
.btn-ghost:hover {
  border-color: var(--text-tertiary);
  transform: translateY(-1px);
}

/* ── Hero ── */
.hero {
  position: relative;
  padding: 100px 0 80px;
  overflow: hidden;
  text-align: center;
}
.hero-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.dark .hero-glow {
  background: radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%);
}
.hero-content {
  position: relative;
  max-width: 800px;
}
.hero-badge {
  display: inline-block;
  font-size: 0.825rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin-bottom: 24px;
}
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  color: var(--text);
}
.hero-sub {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 36px;
}
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-trust {
  margin-top: 40px;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

/* ── Sections ── */
.section {
  padding: 80px 0;
}
.section-alt { background: var(--bg-alt); }
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.section-sub {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto 48px;
  line-height: 1.7;
}

.page-hero {
  padding: 120px 0 60px;
  text-align: center;
  background: var(--bg-alt);
}
.page-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.page-hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Pillars ── */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.pillar-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.pillar-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.pillar-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(13,148,136,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #0ea5e9;
}
.dark .pillar-icon {
  background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(13,148,136,0.15));
}
.pillar-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.pillar-card p {
  color: var(--text-secondary);
  font-size: 0.925rem;
  line-height: 1.65;
}

@media (max-width: 768px) {
  .pillars-grid { grid-template-columns: 1fr; }
}

/* ── Tier Cards ── */
.tiers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.tier-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.tier-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.tier-featured {
  border-color: #0ea5e9;
  position: relative;
}
.tier-featured::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-lg);
  background: var(--gradient);
  z-index: -1;
  opacity: 0.12;
}
.tier-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 100px;
  margin-bottom: 20px;
  width: fit-content;
}
.tier-badge-featured {
  color: #0ea5e9;
  border-color: rgba(14,165,233,0.3);
  background: rgba(14,165,233,0.06);
}
.tier-card h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.tier-desc {
  color: var(--text-secondary);
  font-size: 0.925rem;
  line-height: 1.65;
  margin-bottom: 24px;
}
.tier-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  flex: 1;
}
.tier-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.925rem;
  color: var(--text-secondary);
}
.tier-features li svg { color: #0d9488; flex-shrink: 0; }

@media (max-width: 768px) {
  .tiers-grid { grid-template-columns: 1fr; }
}

/* ── Process ── */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.process-step {
  text-align: center;
  position: relative;
}
.process-num {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.3;
  display: block;
  margin-bottom: 8px;
}
.process-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(13,148,136,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #0ea5e9;
}
.dark .process-icon {
  background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(13,148,136,0.15));
}
.process-step h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.process-step p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .process-grid { grid-template-columns: 1fr; gap: 32px; }
}

/* ── Portfolio ── */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.portfolio-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.portfolio-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.portfolio-thumb {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}
.portfolio-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-alt), var(--border));
  display: flex;
  align-items: center;
  justify-content: center;
}
.portfolio-placeholder span {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.portfolio-placeholder.large span { font-size: 3.5rem; }
.portfolio-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14,165,233,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.portfolio-overlay span {
  color: #fff;
  font-weight: 600;
  font-size: 0.925rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.portfolio-card:hover .portfolio-overlay { opacity: 1; }
.portfolio-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s var(--ease);
}
.portfolio-card:hover .portfolio-img,
.case-thumb .portfolio-img:hover { transform: scale(1.04); }
.portfolio-info { padding: 20px; }
.portfolio-demo-btn {
  margin-top: 14px;
  font-size: 0.8rem !important;
  padding: 8px 16px !important;
}
.case-demo-btn {
  margin-top: 18px;
  display: inline-flex;
}
.portfolio-type {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0ea5e9;
}
.portfolio-info h3 {
  font-size: 1.1rem;
  margin: 6px 0 8px;
}
.portfolio-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.55;
}

@media (max-width: 768px) {
  .portfolio-grid { grid-template-columns: 1fr; }
}

/* ── Testimonials ── */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.testimonial-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.testimonial-stars {
  display: flex;
  gap: 2px;
  color: #f59e0b;
  margin-bottom: 16px;
}
.testimonial-quote {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-style: italic;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}
.testimonial-author strong {
  display: block;
  font-size: 0.9rem;
}
.testimonial-author span {
  display: block;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}

/* ── CTA Section ── */
.cta-section {
  background: linear-gradient(135deg, rgba(14,165,233,0.05), rgba(13,148,136,0.05));
}
.dark .cta-section {
  background: linear-gradient(135deg, rgba(14,165,233,0.08), rgba(13,148,136,0.08));
}
.cta-content {
  text-align: center;
  max-width: 600px;
}
.cta-content h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.cta-content p {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 32px;
  line-height: 1.7;
}

/* ── Comparison Table ── */
.comparison-table {
  max-width: 700px;
  margin: 48px auto 0;
}
.comp-header, .comp-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 1px;
}
.comp-header {
  font-weight: 700;
  font-size: 0.9rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 12px;
  margin-bottom: 8px;
}
.comp-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}
.comp-feature {
  font-weight: 600;
}
.comp-col {
  color: var(--text-secondary);
  text-align: center;
}
.comp-col-featured {
  color: #0ea5e9;
  font-weight: 600;
}

/* ── Who Grid ── */
.who-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 700px;
  margin: 48px auto 0;
}
.who-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: var(--text-secondary);
}
.who-item svg { color: #0d9488; }

@media (max-width: 768px) {
  .who-grid { grid-template-columns: 1fr; }
}

/* ── Addons ── */
.addons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.addon-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.addon-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.addon-card h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}
.addon-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .addons-grid { grid-template-columns: 1fr; }
}

/* ── Case Studies ── */
.case-studies {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.case-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: grid;
  grid-template-columns: 320px 1fr;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.case-card:hover {
  box-shadow: var(--shadow-lg);
}
.case-thumb {
  aspect-ratio: 4/3;
  overflow: hidden;
}
.case-body {
  padding: 28px;
}
.case-body h3 {
  font-size: 1.2rem;
  margin: 6px 0 16px;
}
.case-section {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.case-section strong { color: var(--text); }
.case-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.case-tag {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 100px;
  background: rgba(14,165,233,0.08);
  color: #0ea5e9;
}
.dark .case-tag { background: rgba(14,165,233,0.15); }

.demo-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(245,158,11,0.1);
  color: #d97706;
  border: 1px solid rgba(245,158,11,0.2);
}
.dark .demo-badge {
  background: rgba(245,158,11,0.15);
  color: #fbbf24;
  border-color: rgba(245,158,11,0.25);
}

@media (max-width: 768px) {
  .case-card { grid-template-columns: 1fr; }
  .case-thumb { aspect-ratio: 16/9; }
}

/* ── About ── */
.about-content {
  max-width: 720px;
}
.about-block {
  margin-bottom: 48px;
}
.about-block h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.about-block p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
}

/* ── Contact Form ── */
.contact-layout { max-width: 680px; }
.contact-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-full { margin-bottom: 24px; }
.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}
.form-group input,
.form-group select,
.form-group textarea {
  font-family: var(--font-body);
  font-size: 0.925rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}
.form-group textarea { resize: vertical; }
.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 10px;
}
.btn-loading {
  opacity: 0.75;
  pointer-events: none;
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .contact-form { padding: 24px; }
}

/* ── Success ── */
.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.success-icon svg { width: 40px; height: 40px; }

/* ── Legal ── */
.legal-content {
  max-width: 720px;
}
.legal-content h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  margin: 36px 0 12px;
}
.legal-content h2:first-child { margin-top: 0; }
.legal-content p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.75;
  margin-bottom: 12px;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--border);
  padding: 64px 0 32px;
  margin-top: 0;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 48px;
}
.footer-tagline {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 12px;
  line-height: 1.6;
}
.footer-col h4 {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}
.footer-col .nav-link {
  display: block;
  padding: 4px 0;
  font-size: 0.9rem;
}
.footer-contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.footer-contact-item svg { color: var(--text-tertiary); }
.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-bottom p {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}
.footer-legal {
  display: flex;
  gap: 16px;
}
.footer-legal .nav-link { font-size: 0.8rem; padding: 0; }
.footer-credit {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
  .hero { padding: 80px 0 60px; }
  .section { padding: 60px 0; }
  .page-hero { padding: 100px 0 48px; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { width: 100%; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
      `}</style>
      <Header />
      <AppRoutes />
      <Footer />
    </div>
  );
}
