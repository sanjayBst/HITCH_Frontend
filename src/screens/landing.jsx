import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon } from '../components/SharedComponents';

function LandingScreen({ onGetStarted }) {
  const scope = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".hero-text > *", { opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: "power4.out" })
      .from(".hero-image", { opacity: 0, scale: 0.8, x: 50, duration: 1, ease: "power3.out" }, "-=0.6")
      .from(".bento-card", { opacity: 0, y: 40, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.4");
  }, { scope });

  return (
    <div ref={scope} className="min-h-screen bg-bg text-ink overflow-x-hidden relative">
      {/* Background Pattern with mask to clear center text area */}
      <div
        className="absolute inset-0 bg-[radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.06] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at 25% 35%, transparent 10%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 25% 35%, transparent 10%, black 60%)'
        }}
      ></div>

      {/* Hero Section */}
      <section className="relative max-w-[1240px] mx-auto px-7 pt-12 pb-20 grid grid-cols-[1.2fr_1fr] gap-12 items-center md:grid-cols-1 md:pt-8 md:pb-16">
        <div className="hero-text relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-ink font-mono text-[11px] font-bold tracking-widest uppercase mb-6 shadow-[0_4px_15px_rgba(215,255,58,0.25)]">
            <span className="w-2 h-2 bg-accent-ink rounded-full animate-pulse"></span> The Future of Commuting
          </div>
          <h1 className="text-[72px] md:text-[48px] font-bold tracking-tighter leading-[0.95] mb-6">
            Share the road. <br />
            <span className="text-ink-3">Save the world.</span>
          </h1>
          <p className="text-[20px] md:text-lg text-ink-3 leading-relaxed mb-8 max-w-[500px]">
            Hitch connects verified Pilots with curious Voyagers heading the same way. It's safe, social, and 100% non-commercial.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              className="btn btn-primary btn-lg px-10 text-lg h-[56px] shadow-[0_4px_20px_rgba(215,255,58,0.2)] hover:shadow-[0_4px_25px_rgba(215,255,58,0.4)]" 
              onClick={onGetStarted}
            >
              Get Started <Icon.ArrowRight />
            </button>
            <button className="btn btn-ghost btn-lg h-[56px] border border-line-soft hover:bg-bg-elev">How it works</button>
          </div>
          <div className="flex items-center gap-10 mt-12 md:mt-10 text-ink-3">
            <div>
              <div className="text-[28px] font-bold text-ink tracking-tight">5.2k+</div>
              <div className="text-[11px] uppercase tracking-widest font-mono mt-1 text-ink-4">Voyagers</div>
            </div>
            <div className="w-[1px] h-10 bg-line-soft"></div>
            <div>
              <div className="text-[28px] font-bold text-ink tracking-tight">1.8k+</div>
              <div className="text-[11px] uppercase tracking-widest font-mono mt-1 text-ink-4">Pilots</div>
            </div>
            <div className="w-[1px] h-10 bg-line-soft"></div>
            <div>
              <div className="text-[28px] font-bold text-ink tracking-tight">12.4t</div>
              <div className="text-[11px] uppercase tracking-widest font-mono mt-1 text-ink-4">CO₂ Saved</div>
            </div>
          </div>
        </div>

        <div className="hero-image relative flex justify-center w-full">
          <div className="absolute -inset-10 bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
          {/* Image removed as per request */}
        </div>
      </section>

      {/* Features Section - Bento Box Grid */}
      <section className="bg-bg-elev/50 border-t border-line-soft py-32 relative z-10">
        <div className="max-w-[1240px] mx-auto px-7">
          <div className="text-center mb-20">
            <h2 className="text-[56px] md:text-[42px] font-bold tracking-tighter mb-6">Why Hitch?</h2>
            <p className="text-ink-3 max-w-[600px] mx-auto text-[20px] leading-relaxed">
              We're rebuilding urban mobility by putting trust, transparency, and community back at the center of the journey.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
            {/* Bento Item 1: Wide Card */}
            <div className="bento-card col-span-2 md:col-span-1 rounded-[32px] bg-bg border border-line-soft hover:border-ink/50 transition-colors group p-12 md:p-8 flex flex-col justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-bg-elev border border-line-soft flex items-center justify-center text-ink mb-6"><Icon.Shield size={24} /></div>
              <h3 className="text-[32px] font-bold mb-4 tracking-tight">Verified Community</h3>
              <p className="text-[18px] text-ink-3 leading-relaxed max-w-[500px]">Every Pilot and Voyager undergoes mandatory KYC verification. No anonymous profiles, just real people you can trust.</p>
            </div>

            {/* Bento Item 2: Tall Card */}
            <div className="bento-card col-span-1 rounded-[32px] bg-bg border border-line-soft hover:border-ink/50 transition-colors group p-10 flex flex-col justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-bg-elev border border-line-soft flex items-center justify-center text-ink mb-6"><Icon.Zap size={24} /></div>
              <h3 className="text-[28px] font-bold mb-3 tracking-tight">Zero Commission</h3>
              <p className="text-[16px] text-ink-3 leading-relaxed">Hitch is 100% non-commercial. No hidden fees or surge pricing. Just fair carpooling.</p>
            </div>

            {/* Bento Item 3: Full Width Card */}
            <div className="bento-card col-span-3 md:col-span-1 rounded-[32px] bg-bg border border-line-soft hover:border-ink/50 transition-colors group p-12 md:p-8 flex flex-col justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-bg-elev border border-line-soft flex items-center justify-center text-ink mb-6 shadow-sm"><Icon.Pin size={24} /></div>
              <h3 className="text-[36px] font-bold mb-4 tracking-tight">Intelligent Routing</h3>
              <p className="text-[18px] text-ink-3 leading-relaxed max-w-[600px]">Our smart matching algorithm finds the best connections along your daily commute routes, making drop-offs seamless and completely out of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-bg border-t border-line-soft">
        <div className="max-w-[1240px] mx-auto px-7 flex justify-between items-center md:flex-col md:gap-8">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-3xl tracking-tighter inline-flex items-center gap-2"><span className="w-4 h-4 bg-ink rounded relative after:content-[''] after:w-1.5 after:h-1.5 after:bg-accent after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full"></span> HITCH</div>
            <div className="text-ink-4 text-sm font-medium">© 2026 Hitch Technologies. All rights reserved.</div>
          </div>
          <div className="flex gap-10 text-[15px] font-medium text-ink-3">
            <a href="#" className="hover:text-accent transition-colors">About</a>
            <a href="#" className="hover:text-accent transition-colors">Safety</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingScreen;
