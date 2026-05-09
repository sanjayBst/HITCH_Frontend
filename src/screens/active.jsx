import React, {  useState, useEffect, useRef  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function ActiveRideScreen({ match, currentUser, onComplete, onBack }) {
  const ride = match.ride;
  const driver = HITCH_USER_BY_ID(ride.driverId);
  const rider = HITCH_USER_BY_ID(match.riderId) || currentUser;
  const iAmDriver = ride.driverId === currentUser.id;
  const them = iAmDriver ? rider : driver;

  const [messages, setMessages] = useState(match.messages || [
    { id: 'm0', who: 'system', text: 'Match confirmed. Chat is active until the ride is completed.' },
    { id: 'm1', who: ride.driverId, text: `Hey! I'll be at ${ride.from} around ${HITCH_FMT_TIME(ride.departAt)}. Look for ${ride.vehicleModel}, plate ${ride.vehicleNo}.`, ts: '09:14' },
  ]);
  const [draft, setDraft] = useState('');
  const bodyRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages(m => [...m, {
      id: 'm' + Date.now(), who: currentUser.id, text: draft.trim(),
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }]);
    setDraft('');
    // Simulate auto-reply
    setTimeout(() => {
      const replies = [
        'On my way 👍',
        'See you in 5.',
        'I\'m at the pickup point.',
        'Got it. Thanks!',
      ];
      setMessages(m => [...m, {
        id: 'r' + Date.now(), who: them.id, text: replies[Math.floor(Math.random() * replies.length)],
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      }]);
    }, 1100);
  };

  const myCompleted = iAmDriver ? match.driverCompleted : match.riderCompleted;
  const theyCompleted = iAmDriver ? match.riderCompleted : match.driverCompleted;

  const handleComplete = () => {
    const next = { ...match };
    if (iAmDriver) next.driverCompleted = true; else next.riderCompleted = true;
    if (next.driverCompleted && next.riderCompleted) {
      toast('Ride completed. Chat closed and cleared.', { tone: 'accent' });
      onComplete(next, true);
    } else {
      toast(`Marked complete. Waiting for ${them.name.split(' ')[0]}.`);
      onComplete(next, false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 1240 }}>
      <button className="btn ghost sm" onClick={onBack} style={{ marginBottom: 14 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        <div className="col gap-20">
          <div className="card" style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span className="badge accent">ACTIVE RIDE</span>
                <h2 style={{ margin: '12px 0 4px', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600 }}>
                  {ride.from} <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>→</span> {ride.to}
                </h2>
                <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>
                  {HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)} · {ride.vehicleModel}
                </div>
              </div>
              <div className="col" style={{ alignItems: 'flex-end' }}>
                <div className="eyebrow">Vehicle</div>
                <div className="mono" style={{ padding: '6px 10px', border: '1px solid var(--ink)', borderRadius: 4, fontSize: 13, marginTop: 6 }}>{ride.vehicleNo}</div>
              </div>
            </div>

            <div className="route" style={{ marginBottom: 18 }}>
              <div className="nodes">
                <div className="node-line"></div>
                <div className="node-dot"></div>
                <div className="node-dot end"></div>
              </div>
              <div className="col gap-12">
                <div><div className="place">{ride.from}</div><div className="place-meta">Pickup: {match.pickup}</div></div>
                <div><div className="place">{ride.to}</div><div className="place-meta">{ride.toMeta}</div></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <CompleteTile label={iAmDriver ? 'You (driver)' : 'You (rider)'} done={myCompleted} self />
              <CompleteTile label={`${them.name.split(' ')[0]} (${iAmDriver ? 'rider' : 'driver'})`} done={theyCompleted} />
            </div>

            <div style={{ marginTop: 16 }}>
              <button className={`btn block lg ${myCompleted ? '' : 'primary'}`} onClick={handleComplete} disabled={myCompleted}>
                {myCompleted ? <>Marked complete · waiting for {them.name.split(' ')[0]}</> : <>Complete ride <Icon.Check /></>}
              </button>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 8 }}>
                Chat closes and the connection breaks once both sides confirm.
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Co-rider</div>
            <div className="row gap-12" style={{ alignItems: 'center' }}>
              <Avatar user={them} size="lg" />
              <div className="col flex-1">
                <div style={{ fontWeight: 600, fontSize: 16 }}>{them.name}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 13 }} className="row gap-8">
                  <span className="row gap-4"><Icon.Star /> <span className="mono">{them.rating?.toFixed?.(1)}</span></span>
                  <span>·</span><span>{them.rides} rides</span>
                </div>
              </div>
              <button className="icon-btn" title="Call"><Icon.Phone /></button>
            </div>
          </div>
        </div>

        <div className="chat-frame">
          <div className="chat-head">
            <Avatar user={them} />
            <div className="col" style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600 }}>{them.name}</div>
              <div className="row gap-6" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                <span style={{ width: 6, height: 6, background: 'var(--ok)', borderRadius: 999 }}></span>
                <span className="mono">ENCRYPTED · ACTIVE UNTIL COMPLETION</span>
              </div>
            </div>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map(m => {
              if (m.who === 'system') return <div key={m.id} className="bubble system">{m.text}</div>;
              const me = m.who === currentUser.id;
              return (
                <div key={m.id} className={`bubble ${me ? 'me' : 'them'}`}>
                  <div>{m.text}</div>
                  {m.ts && <div className="meta">{m.ts}</div>}
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <input className="input" placeholder="Type a message…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="btn ink" onClick={send}><Icon.Send /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompleteTile({ label, done, self }) {
  return (
    <div style={{
      padding: 14,
      border: '1px solid ' + (done ? 'var(--ok)' : 'var(--line-soft)'),
      borderRadius: 4,
      background: done ? 'color-mix(in oklab, var(--ok) 8%, var(--bg-elev))' : 'var(--bg-elev)',
    }}>
      <div className="eyebrow">{label}</div>
      <div className="row gap-8" style={{ marginTop: 6, alignItems: 'center' }}>
        {done
          ? <span className="row gap-6" style={{ color: 'var(--ok)', fontWeight: 600 }}><Icon.Check /> Completed</span>
          : <span style={{ color: 'var(--ink-3)' }}>Pending</span>}
      </div>
    </div>
  );
}

export default ActiveRideScreen;
