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
  "theme": "light",
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
        id: 'req_' + Math.random().toString(36).slice(2,7),
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

      <main className="overflow-y-auto page-content" data-screen-label="App">
        {body}
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
    <svg viewBox="0 0 100 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bike Chassis Outline */}
      <path d="M 20 42 L 38 42 L 52 26 L 72 26" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 38 42 L 46 22 L 70 22 L 72 26" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="3" />
      {/* Handlebars */}
      <path d="M 70 22 L 66 10 L 58 12 M 66 10 L 74 8" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Seat */}
      <path d="M 40 22 Q 33 22, 30 27 L 48 27 Z" fill="var(--color-ink)" />
      
      {/* Wheel Left */}
      <g className="bike-wheel" transform="translate(25, 42)">
        <circle cx="0" cy="0" r="10" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
        <circle cx="0" cy="0" r="3" fill="var(--color-accent)" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--color-ink)" strokeWidth="1.5" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="var(--color-ink)" strokeWidth="1.5" />
      </g>

      {/* Wheel Right */}
      <g className="bike-wheel" transform="translate(75, 42)">
        <circle cx="0" cy="0" r="10" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
        <circle cx="0" cy="0" r="3" fill="var(--color-accent)" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--color-ink)" strokeWidth="1.5" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="var(--color-ink)" strokeWidth="1.5" />
      </g>

      {/* Exhaust Pipe & Exhaust glow */}
      <path d="M 18 38 L 8 40" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="7" cy="40" r="2.5" fill="var(--color-ink)" />
    </svg>
  );
}

function BikeSmokeTransition({ onComplete, onFinish }) {
  const containerRef = useRef();

  useGSAP(() => {
    const container = containerRef.current;
    const bike = container.querySelector(".bike-container");
    const smokeContainer = container.querySelector(".smoke-container");

    // 1. Rotate the wheels infinitely
    gsap.to(".bike-wheel", {
      rotation: 360,
      transformOrigin: "center center",
      repeat: -1,
      ease: "none",
      duration: 0.5
    });

    // 2. Add organic vertical rumble to the bike
    gsap.to(bike, {
      y: "-=3",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 0.08
    });

    // 3. Drive the bike across the viewport
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // exhaust position offset inside container
    const exhaustXOffset = 8;
    const exhaustYOffset = 42;

    let lastSpawnTime = 0;

    gsap.fromTo(bike, 
      { x: -160, y: screenHeight * 0.55 },
      { 
        x: screenWidth + 160, 
        y: screenHeight * 0.55,
        duration: 2.0, 
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = this.progress();
          const currentX = gsap.getProperty(bike, "x");
          const currentY = gsap.getProperty(bike, "y");

          const now = Date.now();
          if (now - lastSpawnTime > 50 && progress < 0.95) {
            lastSpawnTime = now;
            spawnPuff(currentX + exhaustXOffset, currentY + exhaustYOffset, progress);
          }
        },
        onComplete: () => {
          setTimeout(() => {
            onFinish();
          }, 800);
        }
      }
    );

    // Call state switch midway when glowing smoke fully covers screen
    gsap.delayedCall(1.0, () => {
      onComplete();
    });

    function spawnPuff(x, y, progress) {
      const puff = document.createElement("div");
      puff.className = "absolute rounded-full pointer-events-none";
      
      // Luxury glowing yellow/lime HITCH palette
      const colors = ["#D7FF3A", "#FFF066", "#FAF8F5", "#F6E05E", "#ECC94B"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      puff.style.backgroundColor = randomColor;
      puff.style.left = `${x}px`;
      puff.style.top = `${y}px`;
      
      // Puffs grow larger and denser in the center of the screen to mask transitions
      const baseSize = (progress > 0.25 && progress < 0.75) ? 46 : 24;
      puff.style.width = `${baseSize}px`;
      puff.style.height = `${baseSize}px`;
      puff.style.transform = "translate(-50%, -50%)";
      
      // Intense neon yellow glowing shadows
      puff.style.boxShadow = `0 0 45px 20px ${randomColor}44`;
      puff.style.opacity = 0;

      smokeContainer.appendChild(puff);

      // Scaled up puffs merge together to create a solid opaque wall of glowing yellow energy
      const targetScale = (progress > 0.25 && progress < 0.75) ? 26 : 14;
      
      gsap.timeline()
        .to(puff, {
          x: "-=30",
          y: "-=15",
          scale: targetScale,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(puff, {
          opacity: 0,
          scale: targetScale * 1.3,
          duration: 0.9,
          ease: "power1.in",
          onComplete: () => puff.remove()
        });
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Dim backdrop to elevate the glow */}
      <div className="absolute inset-0 bg-bg/5 pointer-events-auto transition-colors duration-500"></div>
      
      {/* Particle clouds container */}
      <div className="smoke-container absolute inset-0"></div>

      {/* Vector Bike */}
      <div className="bike-container absolute w-24 h-16 pointer-events-none">
        <BikeSVG />
      </div>
    </div>
  );
}

export default App;
