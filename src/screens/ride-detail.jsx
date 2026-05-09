import React, {  useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function RideDetailScreen({ ride, currentUser, onBack, onRequest, isMine, onCancel }) {
  const driver = HITCH_USER_BY_ID(ride.driverId) || currentUser;
  const [seats, setSeats] = useState(1);
  const [pickup, setPickup] = useState('');
  const [note, setNote] = useState('');
  const toast = useToast();

  const departIn = new Date(ride.departAt) - new Date();
  const departHrs = departIn / 3600000;

  const submit = () => {
    if (!pickup) return toast('Add a pickup point so the driver can find you');
    onRequest({ rideId: ride.id, seats: Number(seats), pickup, note });
  };

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <button className="btn ghost sm" onClick={onBack} style={{ marginBottom: 18 }}>← Back to browse</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'flex-start' }}>
        <div className="col gap-20">
          <div className="card" style={{ padding: 28 }}>
            <div className="row gap-16" style={{ marginBottom: 24, alignItems: 'flex-start' }}>
              <Avatar user={driver} size="lg" />
              <div className="col flex-1">
                <div className="row gap-8" style={{ alignItems: 'baseline' }}>
                  <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{driver?.name}</div>
                  {driver?.verified && <span className="badge ok"><Icon.Shield /> KYC verified</span>}
                </div>
                <div className="row gap-8" style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>
                  <span className="row gap-4"><Icon.Star /> <span className="mono">{driver?.rating?.toFixed(1)}</span></span>
                  <span>·</span><span>{driver?.rides} rides shared</span>
                  <span>·</span><span>Member since {driver?.since}</span>
                </div>
              </div>
              <div className="col" style={{ alignItems: 'flex-end' }}>
                <div className="eyebrow">{HITCH_FMT_DATE(ride.departAt)}</div>
                <div className="ride-time">{HITCH_FMT_TIME(ride.departAt)}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{HITCH_FMT_REL(ride.departAt)}</div>
              </div>
            </div>

            <div className="route" style={{ marginBottom: 24 }}>
              <div className="nodes">
                <div className="node-line"></div>
                <div className="node-dot"></div>
                <div className="node-dot end"></div>
              </div>
              <div className="col gap-16">
                <div>
                  <div className="eyebrow">From</div>
                  <div className="place" style={{ fontSize: 20 }}>{ride.from}</div>
                  <div className="place-meta">{ride.fromMeta}</div>
                </div>
                <div>
                  <div className="eyebrow">To</div>
                  <div className="place" style={{ fontSize: 20 }}>{ride.to}</div>
                  <div className="place-meta">{ride.toMeta}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div className="stat"><div className="v">{ride.distanceKm}<span style={{ fontSize: 16, color: 'var(--ink-3)', marginLeft: 4 }}>km</span></div><div className="l">Distance</div></div>
              <div className="stat"><div className="v">{ride.durationMin}<span style={{ fontSize: 16, color: 'var(--ink-3)', marginLeft: 4 }}>min</span></div><div className="l">Est. duration</div></div>
              <div className="stat"><div className="v">{ride.seats}</div><div className="l">Seats open</div></div>
              <div className="stat"><div className="v" style={{ fontSize: 22 }}><VehicleIcon type={ride.vehicleType} /></div><div className="l"><VehicleLabel type={ride.vehicleType} /></div></div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Vehicle</div>
            <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
              <div className="col">
                <div style={{ fontWeight: 600 }}>{ride.vehicleModel}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 13 }}><VehicleLabel type={ride.vehicleType} /></div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 14, padding: '8px 12px', border: '1px solid var(--ink)', borderRadius: 4, letterSpacing: '0.04em' }}>
                {ride.vehicleNo}
              </div>
            </div>
          </div>

          {ride.note && (
            <div className="card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Driver's note</div>
              <div style={{ fontSize: 15, lineHeight: 1.55 }}>{ride.note}</div>
            </div>
          )}
        </div>

        <div className="col gap-20" style={{ position: 'sticky', top: 84 }}>
          {isMine ? (
            <div className="card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Your slot</div>
              <h3 style={{ margin: '0 0 14px', fontWeight: 600, letterSpacing: '-0.01em' }}>You're driving this one.</h3>
              <div style={{ color: 'var(--ink-3)', fontSize: 13, marginBottom: 18 }}>
                Riders nearby can see your slot and send requests. You'll be notified — accept or reject before <span className="mono" style={{ color: 'var(--ink)' }}>1 hour</span> of departure.
              </div>
              <button className="btn block danger" onClick={() => { onCancel?.(ride); }}>Cancel slot</button>
            </div>
          ) : (
            <div className="card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Request to join</div>
              <h3 style={{ margin: '0 0 4px', fontWeight: 600, letterSpacing: '-0.01em' }}>Free ride.</h3>
              <div style={{ color: 'var(--ink-3)', fontSize: 13, marginBottom: 18 }}>
                Hitch is non-commercial. No money, no commission. {departHrs >= 1 ? <>Driver has until <span className="mono" style={{ color: 'var(--ink)' }}>1h before departure</span> to accept.</> : <>Less than an hour to go — driver may not be able to accept.</>}
              </div>

              <div className="col gap-12">
                <div className="field">
                  <label className="field-label">Seats needed</label>
                  <select className="select input" value={seats} onChange={e => setSeats(e.target.value)}>
                    {Array.from({ length: ride.seats }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Pickup point</label>
                  <input className="input" placeholder="100ft Road, near metro pillar 22" value={pickup} onChange={e => setPickup(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">Message <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--ink-4)' }}>(optional)</span></label>
                  <textarea className="textarea" placeholder="Hi, hoping to hitch from your route. I'll be on time." value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <button className="btn primary lg block" onClick={submit}>Send request <Icon.Send /></button>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
                  Chat unlocks once the driver accepts.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RideDetailScreen;
