import React from 'react';
import { Icon, Avatar, VehicleIcon } from './SharedComponents';
import { HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';

export function RideCard({ ride, onOpen, badge }) {
  const driver = HITCH_USER_BY_ID(ride.driverId);
  return (
    <div className="ride-card" onClick={onOpen}>
      <div className="col">
        <div className="row gap-12" style={{ marginBottom: 14 }}>
          <Avatar user={driver} />
          <div className="col" style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 500 }}>{driver?.name}</div>
            <div className="row gap-6" style={{ color: 'var(--ink-3)', fontSize: 12 }}>
              <Icon.Star /> <span className="mono">{driver?.rating.toFixed(1)}</span>
              <span>·</span><span>{driver?.rides} rides</span>
              {driver?.verified && <><span>·</span><span className="row gap-4" style={{ color: 'var(--ok)' }}><Icon.Shield /> KYC</span></>}
            </div>
          </div>
          {badge && <div style={{ marginLeft: 'auto' }}><span className={`badge ${badge.tone || 'outline'}`}>{badge.text}</span></div>}
        </div>

        <div className="route">
          <div className="nodes">
            <div className="node-line"></div>
            <div className="node-dot"></div>
            <div className="node-dot end"></div>
          </div>
          <div className="col gap-12">
            <div>
              <div className="place">{ride.from}</div>
              <div className="place-meta">{ride.fromMeta}</div>
            </div>
            <div>
              <div className="place">{ride.to}</div>
              <div className="place-meta">{ride.toMeta}</div>
            </div>
          </div>
        </div>

        <div className="ride-meta">
          <span className="vmeta"><VehicleIcon type={ride.vehicleType} /> {ride.vehicleModel}</span>
          <span className="vmeta"><Icon.Seat /> {ride.seats} seat{ride.seats > 1 ? 's' : ''}</span>
          <span className="vmeta"><Icon.Pin /> {ride.distanceKm} km · {ride.durationMin} min</span>
        </div>
      </div>

      <div className="ride-side">
        <div>
          <div className="eyebrow">{HITCH_FMT_DATE(ride.departAt)}</div>
          <div className="ride-time">{HITCH_FMT_TIME(ride.departAt)}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{HITCH_FMT_REL(ride.departAt)}</div>
        </div>
        <button className="btn ink sm">View <Icon.ArrowRight /></button>
      </div>
    </div>
  );
}