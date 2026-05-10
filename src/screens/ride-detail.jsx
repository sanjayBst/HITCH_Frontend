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
    <div className="max-w-[1080px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <button className="btn btn-ghost btn-sm mb-[18px]" onClick={onBack}>← Back to browse</button>

      <div className="grid grid-cols-[1.4fr_1fr] gap-7 items-start md:grid-cols-1">
        <div className="flex flex-col gap-5">
          <div className="card-base p-7">
            <div className="flex items-start gap-4 mb-6">
              <Avatar user={driver} size="lg" />
              <div className="flex flex-col flex-1">
                <div className="flex items-baseline gap-2">
                  <div className="text-[22px] font-semibold tracking-tight">{driver?.name}</div>
                  {driver?.verified && <span className="badge-base bg-ok text-white"><Icon.Shield /> KYC verified</span>}
                </div>
                <div className="flex items-center gap-2 text-ink-3 text-[13px] mt-1">
                  <span className="flex items-center gap-1"><Icon.Star /> <span className="font-mono">{driver?.rating?.toFixed(1)}</span></span>
                  <span>·</span><span>{driver?.rides} journeys hosted</span>
                  <span>·</span><span>Member since {driver?.since}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">{HITCH_FMT_DATE(ride.departAt)}</div>
                <div className="text-[28px] font-semibold tracking-tight font-mono tabular-nums">{HITCH_FMT_TIME(ride.departAt)}</div>
                <div className="font-mono text-[11px] text-ink-3">{HITCH_FMT_REL(ride.departAt)}</div>
              </div>
            </div>

            <div className="grid grid-cols-[14px_1fr] gap-x-3.5 mb-6">
              <div className="grid grid-rows-[auto_auto] gap-[18px] relative">
                <div className="absolute top-3.5 bottom-3.5 left-1 w-[1px] bg-[repeating-linear-gradient(to_bottom,var(--ink-4)_0_4px,transparent_4px_8px)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-ink mt-1.5 relative z-10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-accent border border-ink mt-1.5 relative z-10"></div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">From</div>
                  <div className="text-[20px] font-medium tracking-tight">{ride.from}</div>
                  <div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{ride.fromMeta}</div>
                </div>
                <div>
                  <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">To</div>
                  <div className="text-[20px] font-medium tracking-tight">{ride.to}</div>
                  <div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{ride.toMeta}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{ride.distanceKm}<span className="text-base text-ink-3 ml-1">km</span></div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Distance</div></div>
              <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{ride.durationMin}<span className="text-base text-ink-3 ml-1">min</span></div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Est. duration</div></div>
              <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{ride.seats}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Seats open</div></div>
              <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[22px] font-semibold tracking-tight font-mono"><VehicleIcon type={ride.vehicleType} /></div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1"><VehicleLabel type={ride.vehicleType} /></div></div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mb-2">Vehicle</div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <div className="font-semibold">{ride.vehicleModel}</div>
                <div className="text-ink-3 text-[13px]"><VehicleLabel type={ride.vehicleType} /></div>
              </div>
              <div className="ml-auto font-mono text-sm px-3 py-2 border border-ink rounded tracking-wider">
                {ride.vehicleNo}
              </div>
            </div>
          </div>

          {ride.note && (
            <div className="card-base p-6">
              <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mb-2">Pilot's note</div>
              <div className="text-[15px] leading-[1.55]">{ride.note}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 sticky top-[84px] md:relative md:top-0">
          {isMine ? (
            <div className="card-base p-6">
              <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mb-2">Your slot</div>
              <h3 className="m-0 mb-3.5 font-semibold tracking-tight">You're the Pilot for this journey.</h3>
              <div className="text-ink-3 text-[13px] mb-[18px]">
                Voyagers nearby can see your slot and send requests. You'll be notified — accept or reject before <span className="font-mono text-ink">1 hour</span> of departure.
              </div>
              <button className="btn btn-block btn-danger" onClick={() => { onCancel?.(ride); }}>Cancel slot</button>
            </div>
          ) : (
            <div className="card-base p-6">
              <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mb-2">Request to join</div>
              <h3 className="m-0 mb-1 font-semibold tracking-tight">Free ride.</h3>
              <div className="text-ink-3 text-[13px] mb-[18px]">
                Hitch is non-commercial. No money, no commission. {departHrs >= 1 ? <>Pilot has until <span className="font-mono text-ink">1h before departure</span> to accept.</> : <>Less than an hour to go — pilot may not be able to accept.</>}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Seats needed</label>
                  <select className="input-base" value={seats} onChange={e => setSeats(e.target.value)}>
                    {Array.from({ length: ride.seats }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Pickup point</label>
                  <input className="input-base" placeholder="100ft Road, near metro pillar 22" value={pickup} onChange={e => setPickup(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Message <span className="normal-case tracking-normal text-ink-4">(optional)</span></label>
                  <textarea className="input-base min-h-[96px] resize-y font-[family:inherit]" placeholder="Hi, hoping to hitch from your route. I'll be on time." value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-lg btn-block" onClick={submit}>Send request <Icon.Send /></button>
                <div className="text-[12px] text-ink-3 text-center">
                  Chat unlocks once the pilot accepts.
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
