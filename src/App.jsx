import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon, Avatar, ToastHost } from './components/SharedComponents';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from './components/TweaksPanel';
import { HITCH_SEED } from './utils/data';
import AuthScreen from './screens/auth';
import HomeScreen from './screens/home';
import BrowseScreen from './screens/browse';
import OfferScreen from './screens/offer';
import RideDetailScreen from './screens/ride-detail';
import MyRidesScreen from './screens/my-rides';
import ActiveRideScreen from './screens/active';
import ProfileScreen from './screens/profile';
import LandingScreen from './screens/landing';



const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#D7FF3A",
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState({ name: 'home', payload: null });
  const [rides, setRides] = useState(HITCH_SEED.rides);
  const [mySlots, setMySlots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeMatches, setActiveMatches] = useState([]);
  const [seedReqId, setSeedReqId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);
  const container = useRef();

  const triggerAuth = () => {
    setIsAuthTransitioning(true);
  };

  useGSAP(() => {
    // Animate everything inside the main page content
    gsap.fromTo(".page-content",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.inOut" }
    );

    // Subtle staggered slide-up for immediate children
    gsap.fromTo(".page-content > div > section, .page-content > div > div",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.1 }
    );
  }, { dependencies: [route.name], scope: container });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
  }, [tweaks.theme]);

  // Apply accent
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
  }, [tweaks.accent]);

  const setTheme = (t) => setTweak('theme', t);

  // Seed an incoming request when user logs in (so My Rides has content)
  useEffect(() => {
    if (user && !seedReqId) {
      const myFirstSlot = {
        id: 'r_seed_self', driverId: user.id,
        from: 'Indiranagar', fromMeta: '100ft Road · Bangalore',
        to: 'Whitefield', toMeta: 'ITPL Main Road · Bangalore',
        vehicleType: 'four', vehicleNo: 'KA·05·MX·2241', vehicleModel: 'Hyundai Aura',
        seats: 3,
        departAt: (() => { const d = new Date(); d.setHours(d.getHours() + 4); return d.toISOString(); })(),
        distanceKm: 18, durationMin: 52,
        note: 'Office route. AC on. No smoking.', mine: true,
      };
      setMySlots([myFirstSlot]);

      const seedReq = {
        id: 'req_' + Math.random().toString(36).slice(2, 7),
        rideId: myFirstSlot.id, ride: myFirstSlot,
        riderId: 'u_priya', driverId: user.id,
        seats: 1, pickup: '100ft Road, near Pillar 22',
        note: 'Hi! I\'m heading to ITPL too — would be great to hitch.',
        status: 'pending',
      };
      setRequests([seedReq]);
      setSeedReqId(seedReq.id);
    }
  }, [user]);

  // ---- handlers ----
  const goto = (name, payload) => setRoute({ name, payload });

  const handleCreateSlot = (slot) => {
    setMySlots(s => [slot, ...s]);
    setRides(r => [slot, ...r]);
    goto('my-rides');
  };

  const handleRequestRide = ({ rideId, seats, pickup, note }) => {
    const ride = rides.find(r => r.id === rideId);
    const req = {
      id: 'req_' + Math.random().toString(36).slice(2, 8),
      rideId, ride,
      riderId: user.id,
      driverId: ride.driverId,
      seats, pickup, note,
      status: 'pending',
    };
    setRequests(rs => [req, ...rs]);

    // Auto-respond after 1.6s for demo realism
    setTimeout(() => {
      setRequests(rs => rs.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
      setActiveMatches(ms => [...ms, {
        id: 'match_' + req.id,
        ride: req.ride,
        riderId: req.riderId,
        pickup: req.pickup,
        driverCompleted: false,
        riderCompleted: false,
      }]);
    }, 1600);

    goto('my-rides');
  };

  const handleAcceptIncoming = (req) => {
    setRequests(rs => rs.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
    const match = {
      id: 'match_' + req.id,
      ride: req.ride,
      riderId: req.riderId,
      pickup: req.pickup,
      driverCompleted: false,
      riderCompleted: false,
    };
    setActiveMatches(ms => [...ms, match]);
    goto('active', match);
  };

  const handleRejectIncoming = (req) => {
    setRequests(rs => rs.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
  };

  const handleCancelRequest = (req) => {
    setRequests(rs => rs.filter(r => r.id !== req.id));
  };

  const handleOpenChat = (req) => {
    const match = activeMatches.find(m => m.id === 'match_' + req.id);
    if (match) goto('active', match);
  };

  const handleCompleteRide = (matchUpdated, fullyDone) => {
    if (fullyDone) {
      setActiveMatches(ms => ms.filter(m => m.id !== matchUpdated.id));
      goto('home');
    } else {
      setActiveMatches(ms => ms.map(m => m.id === matchUpdated.id ? matchUpdated : m));
    }
  };

  const handleCancelSlot = (slot) => {
    setMySlots(s => s.filter(x => x.id !== slot.id));
    setRides(r => r.filter(x => x.id !== slot.id));
    goto('home');
  };

  // ---- footer mouse-tracking spotlight ----
  const handleFooterMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // ---- nav badge counts ----
  const incomingPendingCount = user ? requests.filter(r => r.driverId === user.id && r.status === 'pending').length : 0;

  // ---- Tweaks panel ----
  const tweaksPanel = (
    <TweaksPanel>
      <TweakSection title="Appearance">
        <TweakRadio label="Theme" value={tweaks.theme} onChange={v => setTweak('theme', v)} options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]} />
        <TweakColor label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)} options={[
          '#D7FF3A', '#FF6A3D', '#3D8BFF', '#1FB87C', '#E0B341'
        ]} />
      </TweakSection>
    </TweaksPanel>
  );

  // ---- Render route ----
  let body;

  if (!user) {
    if (showAuth) {
      body = <AuthScreen onLogin={(u) => { setUser(u); setShowAuth(false); }} theme={tweaks.theme} setTheme={setTheme} onBack={() => setShowAuth(false)} />;
    } else {
      body = <LandingScreen onGetStarted={triggerAuth} />;
    }
  } else if (route.name === 'home') {
    body = <HomeScreen
      user={user} rides={rides} mySlots={mySlots} requests={requests} activeMatches={activeMatches}
      onGoto={goto}
      onOpenRide={(r) => goto('ride', r)}
      onOpenMatch={(m) => goto('active', m)}
    />;
  } else if (route.name === 'browse') {
    body = <BrowseScreen rides={rides.filter(r => r.driverId !== user.id)} onOpen={(r) => goto('ride', r)} />;
  } else if (route.name === 'offer') {
    body = <OfferScreen onCreate={handleCreateSlot} currentUser={user} />;
  } else if (route.name === 'ride') {
    const ride = route.payload;
    body = <RideDetailScreen ride={ride} currentUser={user} onBack={() => goto('browse')} onRequest={handleRequestRide} isMine={ride.driverId === user.id} onCancel={handleCancelSlot} />;
  } else if (route.name === 'my-rides') {
    body = <MyRidesScreen requests={requests} mySlots={mySlots} currentUser={user} onAccept={handleAcceptIncoming} onReject={handleRejectIncoming} onOpenChat={handleOpenChat} onCancelRequest={handleCancelRequest} />;
  } else if (route.name === 'active') {
    body = <ActiveRideScreen match={route.payload} currentUser={user} onComplete={handleCompleteRide} onBack={() => goto('home')} />;
  } else if (route.name === 'profile') {
    body = <ProfileScreen user={user} onLogout={() => setUser(null)} theme={tweaks.theme} setTheme={setTheme} />;
  }

  return (
    <div ref={container} className="grid grid-rows-[64px_1fr] h-screen">
      <header className="flex items-center justify-between px-7 border-b border-line-soft bg-bg/85 backdrop-blur-md sticky top-0 z-50 md:px-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),_0_4px_6px_-2px_rgba(0,0,0,0.01)]">
        <div className="flex items-center">
          <button className="inline-flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer text-inherit" onClick={() => goto('home')}>
            <HitchLogo className="h-8 w-auto" />
          </button>
        </div>

        <nav className="flex gap-1.5 items-center bg-bg-elev/80 border border-line-soft/80 p-1 rounded-full md:absolute md:left-1/2 md:-translate-x-1/2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          <NavItem label="Home" active={route.name === 'home' && user} onClick={() => user ? goto('home') : setShowAuth(false)} />
          <NavItem label="Explore" active={route.name === 'browse'} onClick={() => user ? goto('browse') : triggerAuth()} />
          {user && (
            <>
              <NavItem label="Offer" active={route.name === 'offer'} onClick={() => goto('offer')} />
              <NavItem label="Activity" active={route.name === 'my-rides'} onClick={() => goto('my-rides')} badge={incomingPendingCount} />
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full border border-line-soft bg-bg-elev/80 text-ink flex items-center justify-center hover:border-ink hover:bg-bg-sunk transition-all duration-200 hover:scale-[1.03]" onClick={() => setTheme(tweaks.theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {tweaks.theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          </button>
          {!user ? (
            <button className="btn btn-primary btn-sm rounded-full px-5 py-2 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200" onClick={triggerAuth}>Join / Login</button>
          ) : (
            <>
              <button className="w-9 h-9 rounded-full border border-line-soft bg-bg-elev/80 text-ink flex items-center justify-center hover:border-ink hover:bg-bg-sunk transition-all duration-200 hover:scale-[1.03]" title="Notifications"><Icon.Bell /></button>
              <button onClick={() => goto('profile')} className="flex items-center gap-2 bg-bg-elev/80 border border-line-soft rounded-full py-1 pl-3 pr-1 cursor-pointer hover:border-ink hover:bg-bg-sunk transition-all duration-200 hover:scale-[1.02]" style={{ borderRadius: 9999 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                <Avatar user={user} size="sm" />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="overflow-y-auto page-content flex flex-col justify-between min-h-0" data-screen-label="App">
        <div className="flex-1">
          {body}
        </div>
        {user && (
          <footer 
            onMouseMove={handleFooterMouseMove}
            className="py-16 bg-bg-elev/95 border-t border-line-soft mt-20 relative overflow-hidden shrink-0 footer-glow"
          >
            {/* Ambient Background Glow Effect */}
            <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
            <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

            <div className="max-w-[1240px] mx-auto px-7 flex flex-col gap-12 relative z-10">
              
              {/* Upper Section: Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Brand Pitch Column */}
                <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <HitchLogo className="h-7 w-auto" />
                    <span className="font-mono text-[9px] tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 uppercase font-bold">BETA 2.0</span>
                  </div>
                  <p className="text-[13px] text-ink-3 max-w-[40ch] leading-relaxed">
                    Premium hyper-local commuter networks. Share lifts, reduce carbon footprints, and cruise together securely.
                  </p>
                  
                  {/* Decorative Tech Badges */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg border border-line-soft font-mono text-[9px] text-ink-3 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1FB87C] animate-pulse" /> KYC Verified
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg border border-line-soft font-mono text-[9px] text-ink-3 uppercase">
                      <svg className="w-2.5 h-2.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg> Secured
                    </span>
                  </div>
                </div>

                {/* Structured Navigation Column */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink-4 font-bold">Platform</div>
                  <div className="flex flex-col gap-2.5 text-[13px] font-medium text-ink-3">
                    <button onClick={() => goto('home')} className="hover:text-accent hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer text-left w-fit p-0">Dashboard</button>
                    <button onClick={() => goto('browse')} className="hover:text-accent hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer text-left w-fit p-0">Explore Rides</button>
                    <button onClick={() => goto('offer')} className="hover:text-accent hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer text-left w-fit p-0">Publish Slot</button>
                    <button onClick={() => goto('my-rides')} className="hover:text-accent hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer text-left w-fit p-0">Active Commutes</button>
                    <button onClick={() => goto('profile')} className="hover:text-accent hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer text-left w-fit p-0">My Account</button>
                  </div>
                </div>

                {/* System Diagnostics / Help Column */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink-4 font-bold">System Status</div>
                  <div className="p-4 bg-bg border border-line-soft rounded-xl flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ink-3">Operational Status</span>
                      <span className="w-2 h-2 rounded-full bg-[#1FB87C] shadow-[0_0_8px_#1FB87C] animate-[ping_1.5s_infinite]" />
                    </div>
                    <div className="text-[11px] font-mono text-ink-4 leading-normal">
                      All regional lift servers online. Latency 14ms.
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Separator line */}
              <div className="h-[1px] bg-line-soft opacity-30" />

              {/* Bottom Section: Trademarks, Made with Love Signature, & Compliance */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Copyright */}
                <div className="text-xs text-ink-4 font-medium order-3 lg:order-1">
                  <span>© 2026 Hitch Technologies. All rights reserved.</span>
                </div>

                {/* Made with Love Signature (Beautifully Accented Capsule) */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg/50 border border-line-soft/60 rounded-full font-mono text-[11px] text-ink-3 order-1 lg:order-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  <span>Made with</span>
                  <span className="text-[#FF6A3D] animate-[pulse_1.2s_infinite] inline-block font-sans text-xs">❤️</span>
                  <span>by</span>
                  <a 
                    href="https://github.com/sanjaybst" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-ink hover:text-accent font-semibold transition-colors duration-200"
                  >
                    sanjayBst
                  </a>
                </div>

                {/* Terms & Privacy */}
                <div className="flex gap-4 text-xs font-mono text-ink-4 order-2 lg:order-3">
                  <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
                  <span>·</span>
                  <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
                  <span>·</span>
                  <a href="#" className="hover:text-ink transition-colors">Secured</a>
                </div>

              </div>

            </div>
          </footer>
        )}
      </main>

      {tweaksPanel}
      {isAuthTransitioning && (
        <BikeSmokeTransition
          onComplete={() => setShowAuth(true)}
          onFinish={() => setIsAuthTransitioning(false)}
        />
      )}
    </div>
  );
}

function NavItem({ label, active, onClick, badge }) {
  return (
    <button className={`px-4 py-1.5 rounded-full text-ink-3 cursor-pointer text-sm font-semibold transition-all duration-200 hover:text-ink hover:bg-ink/5 ${active ? '!text-bg bg-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:!bg-ink hover:!text-bg' : ''}`} onClick={onClick}>
      {label}
      {badge > 0 && <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full ml-1.5 align-middle"></span>}
    </button>
  );
}

function HitchLogo({ className }) {
  return (
    <svg viewBox="0 0 420 120" className={className} xmlns="http://www.w3.org/2000/svg" style={{ height: '32px' }}>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="#0B0B0B" stroke="var(--color-ink)" strokeWidth="4" strokeOpacity="0.6" />
      <circle cx="84" cy="84" r="16" fill="var(--color-accent)" />
      <text x="150" y="95" fill="var(--color-ink)" style={{ fontSize: '72px', fontWeight: '800', letterSpacing: '-0.05em', fontFamily: 'var(--font-sans)' }}>HITCH</text>
    </svg>
  );
}

function BikeSVG() {
  return (
    <svg viewBox="0 0 140 90" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Front Wheel (Futuristic neon hubless ring) */}
      <g className="bike-wheel" transform="translate(105, 60)">
        <circle cx="0" cy="0" r="18" stroke="#000000" strokeWidth="4" />
        <circle cx="0" cy="0" r="15" stroke="var(--color-accent)" strokeWidth="3.5" />
        {/* Futuristic spoke lines */}
        <line x1="-12" y1="-12" x2="12" y2="12" stroke="#000000" strokeWidth="2.5" />
        <line x1="-12" y1="12" x2="12" y2="-12" stroke="#000000" strokeWidth="2.5" />
      </g>

      {/* Back Wheel (Futuristic neon hubless ring) */}
      <g className="bike-wheel" transform="translate(30, 60)">
        <circle cx="0" cy="0" r="18" stroke="#000000" strokeWidth="4" />
        <circle cx="0" cy="0" r="15" stroke="var(--color-accent)" strokeWidth="3.5" />
        {/* Futuristic spoke lines */}
        <line x1="-12" y1="-12" x2="12" y2="12" stroke="#000000" strokeWidth="2.5" />
        <line x1="-12" y1="12" x2="12" y2="-12" stroke="#000000" strokeWidth="2.5" />
      </g>

      {/* Futuristic Angular Carbon Frame */}
      <path d="M 30 60 L 52 35 L 82 35 L 105 60" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 52 35 L 60 18 L 88 18 Q 96 18, 100 24 L 105 60" stroke="#000000" strokeWidth="4" strokeLinecap="round" />

      {/* Sleek Horizontal Neon Battery Deck */}
      <path d="M 44 48 H 86" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 46 48 H 84" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" />

      {/* Sleek Leaning Rider (Futuristic Cyberpunk Voyager) */}
      <g className="bike-rider">
        {/* Rider Torso Leaning Forward */}
        <path d="M 46 25 Q 60 12, 74 22" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        {/* Arm stretching to handlebars */}
        <path d="M 72 20 L 88 24 L 92 30" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Rider Legs */}
        <path d="M 46 25 L 56 46 L 70 46" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Cyberpunk Helmet with Neon Visor */}
        <circle cx="76" cy="14" r="8" fill="#000000" />
        {/* Visor */}
        <path d="M 78 10 Q 86 10, 82 18" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Futuristic Angular Front Headlight */}
      <polygon points="98,22 108,22 104,28 98,26" fill="#000000" />
      <polygon points="106,22 135,16 135,32 104,26" fill="url(#headlight-beam)" opacity="0.4" />

      {/* Rear High-Energy Exhaust Thruster */}
      <path d="M 24 50 L 10 52" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
      <circle cx="9" cy="52" r="3.5" fill="var(--color-accent)" />

      <defs>
        <linearGradient id="headlight-beam" x1="104" y1="24" x2="135" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BikeSmokeTransition({ onComplete, onFinish }) {
  const containerRef = useRef();
  const puffCount = 18;
  const puffs = Array.from({ length: puffCount });

  useGSAP(() => {
    const container = containerRef.current;
    const bike = container.querySelector(".bike-container");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 1. Setup GPU-accelerated Master Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onFinish, 600);
      }
    });

    // 2. Rotate wheels infinitely
    gsap.to(".bike-wheel", {
      rotation: 360,
      transformOrigin: "center center",
      repeat: -1,
      ease: "none",
      duration: 0.4
    });

    // 3. Add high-speed chassis vibration to futuristic bike
    gsap.to(bike, {
      y: "-=3",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 0.06
    });

    // 4. Smoothly drive the bike across the screen in 1.8s
    tl.fromTo(bike,
      { x: -200, y: screenHeight * 0.55 },
      { x: screenWidth + 200, y: screenHeight * 0.55, duration: 1.8, ease: "power2.inOut" },
      0
    );

    // 5. Fade backdrop overlay mask to 1 opacity in the center to completely hide page swap
    tl.fromTo(".transition-backdrop",
      { opacity: 0 },
      { opacity: 1, duration: 0.75, ease: "power2.inOut" },
      0.1
    );

    // 6. Trigger the pre-rendered liquid smoke puffs to expand and glow as the bike passes
    tl.fromTo(".smoke-puff",
      { scale: 0.05, opacity: 0 },
      {
        scale: (i) => (i > 4 && i < 14 ? 26 : 14), // massive in the center to merge into a single solid wall
        opacity: 0.95,
        duration: 0.7,
        stagger: {
          each: 1.25 / puffCount,
        },
        ease: "power2.out"
      },
      0.05
    );

    // 7. Organic liquid drift and rotation of the gooey clouds
    tl.to(".smoke-puff", {
      x: "-=45",
      y: "-=25",
      rotation: "random(-180, 180)",
      duration: 0.95,
      stagger: {
        each: 1.25 / puffCount,
      },
      ease: "power1.out"
    }, 0.1);

    // 8. Behind-the-scenes page switch at 0.9s (fully masked by 100% solid color & liquid smoke)
    gsap.delayedCall(0.9, () => {
      onComplete();
    });

    // 9. Fade background mask back to transparent after swap
    tl.to(".transition-backdrop", {
      opacity: 0,
      duration: 0.75,
      ease: "power2.inOut"
    }, 0.95);

    // 10. Melt/dissipate the gooey liquid smoke clouds cleanly
    tl.to(".smoke-puff", {
      opacity: 0,
      scale: (i) => (i > 4 && i < 14 ? 32 : 18),
      duration: 0.8,
      stagger: {
        each: 1.25 / puffCount,
      },
      ease: "power1.in"
    }, 0.5);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* 100% Opaque Solid Backdrop Mask (Fades to 1.0 to guarantee zero-flash transitions) */}
      <div className="transition-backdrop absolute inset-0 bg-bg pointer-events-auto" style={{ opacity: 0 }}></div>

      {/* SVG Liquid Gooey Filter Definition (Creates organic mercury/cloud merging effect) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="gooey-smoke">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Pre-rendered Pool of Smoke Clouds with Liquid Gooey Filter applied */}
      <div className="smoke-container absolute inset-0" style={{ filter: "url(#gooey-smoke)" }}>
        {puffs.map((_, i) => (
          <div
            key={i}
            className="smoke-puff absolute rounded-full pointer-events-none"
            style={{
              // Volumetric, rich glowing neon yellow liquid gradient
              background: `radial-gradient(circle at center, var(--color-accent) 0%, rgba(215, 255, 58, 0.85) 40%, rgba(215, 255, 58, 0.3) 70%, transparent 100%)`,
              width: i > 4 && i < 14 ? "120px" : "64px",
              height: i > 4 && i < 14 ? "120px" : "64px",
              transform: "translate(-50%, -50%) scale(0.05)",
              opacity: 0,
              // Distribute evenly along the screen width
              left: `${(i / (puffCount - 1)) * 100}%`,
              // Add a smooth sine wave offset, centered exactly at the bike's exhaust (55vh + 88px)
              top: `calc(55vh + 88px + ${Math.sin(i * 1.6) * 30}px)`
            }}
          />
        ))}
      </div>

      {/* Cyberpunk Futuristic Electric Bike Container (Large, with premium glowing neon halo drop shadow) */}
      <div className="bike-container absolute w-60 h-[154px] pointer-events-none drop-shadow-[0_0_25px_rgba(215,255,58,0.65)]">
        <BikeSVG />
      </div>
    </div>
  );
}

export default App;
