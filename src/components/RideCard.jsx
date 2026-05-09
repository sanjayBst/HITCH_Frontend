import React from 'react';
import { Icon, Avatar, VehicleIcon } from './SharedComponents';
import { HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';

export function RideCard({ ride, onOpen, badge }) {
  const driver = HITCH_USER_BY_ID(ride.driverId);
  return (
    <div className="card-base p-[22px] grid grid-cols-[1fr_auto] gap-5 cursor-pointer transition-all hover:border-ink" onClick={onOpen}>
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-3.5">
          <Avatar user={driver} />
          <div className="flex flex-col" style={{ lineHeight: 1.3 }}>
            <div className="font-medium">{driver?.name}</div>
            <div className="flex items-center gap-1.5 text-ink-3 text-[12px]">
              <Icon.Star /> <span className="font-mono">{driver?.rating.toFixed(1)}</span>
              <span>·</span><span>{driver?.rides} rides</span>
              {driver?.verified && <><span>·</span><span className="flex items-center gap-1 text-ok"><Icon.Shield /> KYC</span></>}
            </div>
          </div>
          {badge && <div className="ml-auto"><span className={`badge-base ${badge.tone === 'outline' ? 'border border-line-soft text-ink-2' : badge.tone === 'ok' ? 'bg-ok text-white' : badge.tone === 'danger' ? 'bg-danger text-white' : badge.tone === 'accent' ? 'bg-accent text-accent-ink' : 'bg-ink text-bg'}`}>{badge.text}</span></div>}
        </div>

        <div className="grid grid-cols-[14px_1fr] gap-x-3.5">
          <div className="grid grid-rows-[auto_auto] gap-[18px] relative">
            <div className="absolute top-3.5 bottom-3.5 left-1 w-[1px] bg-[repeating-linear-gradient(to_bottom,var(--ink-4)_0_4px,transparent_4px_8px)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-ink mt-1.5 relative z-10"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-accent border border-ink mt-1.5 relative z-10"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-base font-medium tracking-tight">{ride.from}</div>
              <div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{ride.fromMeta}</div>
            </div>
            <div>
              <div className="text-base font-medium tracking-tight">{ride.to}</div>
              <div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{ride.toMeta}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-3.5 flex-wrap text-ink-3 text-[13px]">
          <span className="inline-flex gap-1.5 items-center"><VehicleIcon type={ride.vehicleType} /> {ride.vehicleModel}</span>
          <span className="inline-flex gap-1.5 items-center"><Icon.Seat /> {ride.seats} seat{ride.seats > 1 ? 's' : ''}</span>
          <span className="inline-flex gap-1.5 items-center"><Icon.Pin /> {ride.distanceKm} km · {ride.durationMin} min</span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3.5 text-right">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">{HITCH_FMT_DATE(ride.departAt)}</div>
          <div className="text-[28px] font-semibold tracking-tight font-mono tabular-nums">{HITCH_FMT_TIME(ride.departAt)}</div>
          <div className="font-mono text-[11px] text-ink-3 mt-0.5">{HITCH_FMT_REL(ride.departAt)}</div>
        </div>
        <button className="btn btn-ink btn-sm">View <Icon.ArrowRight /></button>
      </div>
    </div>
  );
}