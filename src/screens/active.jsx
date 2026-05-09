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
    <div className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <button className="btn btn-ghost btn-sm mb-3.5" onClick={onBack}>← Back</button>

      <div className="grid grid-cols-[1.1fr_1fr] gap-6 items-start md:grid-cols-1">
        <div className="flex flex-col gap-5">
          <div className="card-base p-[22px]">
            <div className="flex justify-between mb-4">
              <div>
                <span className="badge-base bg-accent text-accent-ink">ACTIVE RIDE</span>
                <h2 className="m-0 mt-3 mb-1 text-[28px] tracking-tight font-semibold">
                  {ride.from} <span className="text-ink-3 font-normal">→</span> {ride.to}
                </h2>
                <div className="text-ink-3 text-[13px]">
                  {HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)} · {ride.vehicleModel}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Vehicle</div>
                <div className="font-mono px-2.5 py-1.5 border border-ink rounded text-[13px] mt-1.5 tracking-wider">{ride.vehicleNo}</div>
              </div>
            </div>

            <div className="grid grid-cols-[14px_1fr] gap-x-3.5 mb-4.5">
              <div className="grid grid-rows-[auto_auto] gap-[18px] relative">
                <div className="absolute top-3.5 bottom-3.5 left-1 w-[1px] bg-[repeating-linear-gradient(to_bottom,var(--ink-4)_0_4px,transparent_4px_8px)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-ink mt-1.5 relative z-10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-accent border border-ink mt-1.5 relative z-10"></div>
              </div>
              <div className="flex flex-col gap-3">
                <div><div className="text-base font-medium tracking-tight">{ride.from}</div><div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">Pickup: {match.pickup}</div></div>
                <div><div className="text-base font-medium tracking-tight">{ride.to}</div><div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{ride.toMeta}</div></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CompleteTile label={iAmDriver ? 'You (driver)' : 'You (rider)'} done={myCompleted} self />
              <CompleteTile label={`${them.name.split(' ')[0]} (${iAmDriver ? 'rider' : 'driver'})`} done={theyCompleted} />
            </div>

            <div className="mt-4">
              <button className={`btn btn-block btn-lg ${myCompleted ? '' : 'btn-primary'}`} onClick={handleComplete} disabled={myCompleted}>
                {myCompleted ? <>Marked complete · waiting for {them.name.split(' ')[0]}</> : <>Complete ride <Icon.Check /></>}
              </button>
              <div className="text-[12px] text-ink-3 text-center mt-2">
                Chat closes and the connection breaks once both sides confirm.
              </div>
            </div>
          </div>

          <div className="card-base p-[22px]">
            <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mb-3">Co-rider</div>
            <div className="flex items-center gap-3">
              <Avatar user={them} size="lg" />
              <div className="flex flex-col flex-1">
                <div className="font-semibold text-base">{them.name}</div>
                <div className="text-ink-3 text-[13px] flex items-center gap-2">
                  <span className="flex items-center gap-1"><Icon.Star /> <span className="font-mono">{them.rating?.toFixed?.(1)}</span></span>
                  <span>·</span><span>{them.rides} rides</span>
                </div>
              </div>
              <button className="w-9 h-9 rounded border border-line-soft bg-bg-elev text-ink flex items-center justify-center hover:border-ink" title="Call"><Icon.Phone /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col border border-line-soft rounded-lg bg-bg h-[600px] overflow-hidden">
          <div className="p-[18px_22px] border-b border-line-soft flex items-center gap-3">
            <Avatar user={them} />
            <div className="flex flex-col" style={{ lineHeight: 1.2 }}>
              <div className="font-semibold">{them.name}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
                <span className="w-1.5 h-1.5 bg-ok rounded-full"></span>
                <span className="font-mono">ENCRYPTED · ACTIVE UNTIL COMPLETION</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3" ref={bodyRef}>
            {messages.map(m => {
              if (m.who === 'system') return <div key={m.id} className="text-[11px] font-mono tracking-widest uppercase text-ink-3 text-center my-3 py-1.5 border-y border-line-soft bg-bg-elev">{m.text}</div>;
              const me = m.who === currentUser.id;
              return (
                <div key={m.id} className={`max-w-[85%] p-[10px_14px] rounded-lg text-sm leading-relaxed ${me ? 'bg-ink text-bg self-end rounded-br-none' : 'bg-bg-elev text-ink border border-line-soft self-start rounded-bl-none'}`}>
                  <div>{m.text}</div>
                  {m.ts && <div className="font-mono text-[10px] text-ink-3 mt-1 uppercase tracking-wider">{m.ts}</div>}
                </div>
              );
            })}
          </div>
          <div className="p-3.5 border-t border-line-soft flex gap-2">
            <input className="input-base flex-1" placeholder="Type a message…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="btn btn-ink" onClick={send}><Icon.Send /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompleteTile({ label, done, self }) {
  return (
    <div className={`p-3.5 border rounded ${done ? 'border-ok bg-[color-mix(in_oklab,var(--ok)_8%,var(--bg-elev))]' : 'border-line-soft bg-bg-elev'}`}>
      <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">{label}</div>
      <div className="flex items-center gap-2 mt-1.5">
        {done
          ? <span className="flex items-center gap-1.5 text-ok font-semibold"><Icon.Check /> Completed</span>
          : <span className="text-ink-3">Pending</span>}
      </div>
    </div>
  );
}

export default ActiveRideScreen;
