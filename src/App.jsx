import React, { useState, useEffect } from 'react';
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
    <div className="app-shell">
      <header className="topbar">
        <div className="row gap-32" style={{ alignItems: 'center' }}>
          <button className="brand" onClick={() => goto('home')} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>
            <span className="brand-mark"></span> HITCH
          </button>
          <nav className="nav">
            <NavItem label="Home" active={route.name === 'home'} onClick={() => goto('home')} />
            <NavItem label="Browse" active={route.name === 'browse'} onClick={() => goto('browse')} />
            <NavItem label="Offer" active={route.name === 'offer'} onClick={() => goto('offer')} />
            <NavItem label="My Rides" active={route.name === 'my-rides'} onClick={() => goto('my-rides')} badge={incomingPendingCount} />
          </nav>
        </div>
        <div className="row gap-8">
          <button className="icon-btn" onClick={() => setTheme(tweaks.theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {tweaks.theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          </button>
          <button className="icon-btn" title="Notifications"><Icon.Bell /></button>
          <button onClick={() => goto('profile')} className="row gap-8" style={{ background: 'transparent', border: '1px solid var(--line-soft)', borderRadius: 4, padding: '4px 4px 4px 12px', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
            <Avatar user={user} size="sm" />
          </button>
        </div>
      </header>

      <main className="app-body" data-screen-label="App">
        {body}
      </main>

      {tweaksPanel}
    </div>
  );
}

function NavItem({ label, active, onClick, badge }) {
  return (
    <button className={`nav-link ${active ? 'active' : ''}`} onClick={onClick} style={{ background: 'transparent', border: 'none' }}>
      {label}
      {badge > 0 && <span className="dot"></span>}
    </button>
  );
}

export default App;
