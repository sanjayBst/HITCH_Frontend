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
  const container = useRef();

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

  if (!user) {
    return <AuthScreen onLogin={u => { setUser(u); setRoute({ name: 'home' }); }} />;
  }

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
  const incomingPendingCount = requests.filter(r => r.driverId === user.id && r.status === 'pending').length;

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
  if (route.name === 'home') {
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
      <header className="flex items-center justify-between px-7 border-b border-line-soft bg-bg sticky top-0 z-50 md:px-4">
        <div className="flex items-center">
          <button className="inline-flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer text-inherit" onClick={() => goto('home')}>
            <HitchLogo className="h-8 w-auto" />
          </button>
        </div>

        <nav className="flex gap-1 items-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <NavItem label="Home" active={route.name === 'home'} onClick={() => goto('home')} />
          <NavItem label="Explore" active={route.name === 'browse'} onClick={() => goto('browse')} />
          <NavItem label="Offer" active={route.name === 'offer'} onClick={() => goto('offer')} />
          <NavItem label="Activity" active={route.name === 'my-rides'} onClick={() => goto('my-rides')} badge={incomingPendingCount} />
        </nav>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded border border-line-soft bg-bg-elev text-ink flex items-center justify-center hover:border-ink" onClick={() => setTheme(tweaks.theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {tweaks.theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          </button>
          <button className="w-9 h-9 rounded border border-line-soft bg-bg-elev text-ink flex items-center justify-center hover:border-ink" title="Notifications"><Icon.Bell /></button>
          <button onClick={() => goto('profile')} className="flex items-center gap-2 bg-transparent border border-line-soft rounded py-1 pl-3 pr-1 cursor-pointer" style={{ borderRadius: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
            <Avatar user={user} size="sm" />
          </button>
        </div>
      </header>

      <main className="overflow-y-auto page-content" data-screen-label="App">
        {body}
      </main>

      {tweaksPanel}
    </div>
  );
}

function NavItem({ label, active, onClick, badge }) {
  return (
    <button className={`px-3.5 py-2 rounded text-ink-3 cursor-pointer text-sm font-medium border border-transparent transition-colors hover:text-ink ${active ? '!text-ink bg-bg-sunk' : ''}`} onClick={onClick}>
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

export default App;
