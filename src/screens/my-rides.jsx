import React, {  useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function MyRidesScreen({ requests, mySlots, onAccept, onReject, onOpenChat, currentUser, onCancelRequest }) {
  const [tab, setTab] = useState('incoming'); // incoming | outgoing | offered

  // incoming: requests where I'm the driver and status is pending
  const incoming = requests.filter(r => r.driverId === currentUser.id && r.status === 'pending');
  const outgoing = requests.filter(r => r.riderId === currentUser.id);
  const myOffered = mySlots;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">My Rides</div>
          <h1 className="page-title">Your activity.</h1>
          <div className="page-sub">Manage requests, slots you've offered, and pending matches. Once both sides confirm, chat opens for the duration of the ride.</div>
        </div>
      </div>

      <div className="row gap-8" style={{ marginBottom: 22 }}>
        <button className={`chip ${tab === 'incoming' ? 'on' : ''}`} onClick={() => setTab('incoming')}>Incoming · {incoming.length}</button>
        <button className={`chip ${tab === 'outgoing' ? 'on' : ''}`} onClick={() => setTab('outgoing')}>Outgoing · {outgoing.length}</button>
        <button className={`chip ${tab === 'offered' ? 'on' : ''}`} onClick={() => setTab('offered')}>Offered · {myOffered.length}</button>
      </div>

      {tab === 'incoming' && (
        incoming.length === 0
          ? <div className="empty"><h3>No incoming requests yet.</h3><div>When riders request your slots they'll appear here.</div></div>
          : <div className="col gap-12">{incoming.map(req => <IncomingCard key={req.id} req={req} onAccept={() => onAccept(req)} onReject={() => onReject(req)} />)}</div>
      )}

      {tab === 'outgoing' && (
        outgoing.length === 0
          ? <div className="empty"><h3>No outgoing requests.</h3><div>Browse available rides and send one.</div></div>
          : <div className="col gap-12">{outgoing.map(req => <OutgoingCard key={req.id} req={req} onChat={() => onOpenChat(req)} onCancel={() => onCancelRequest(req)} />)}</div>
      )}

      {tab === 'offered' && (
        myOffered.length === 0
          ? <div className="empty"><h3>You haven't offered any slots yet.</h3><div>Heading somewhere? Release a slot — someone might be on the same route.</div></div>
          : <div className="col gap-12">{myOffered.map(r => <RideCard key={r.id} ride={r} onOpen={() => {}} badge={{ text: 'Yours', tone: 'ink' }} />)}</div>
      )}
    </div>
  );
}

function IncomingCard({ req, onAccept, onReject }) {
  const ride = req.ride;
  const rider = HITCH_USER_BY_ID(req.riderId) || { name: 'Rider', initials: 'R', rating: 5, rides: 1, verified: true };
  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="row gap-16" style={{ marginBottom: 14, alignItems: 'flex-start' }}>
        <Avatar user={rider} />
        <div className="col flex-1">
          <div className="row gap-8" style={{ alignItems: 'baseline' }}>
            <div style={{ fontWeight: 600 }}>{rider.name}</div>
            <span className="badge accent">REQUEST</span>
          </div>
          <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>
            <Icon.Star /> <span className="mono">{rider.rating?.toFixed?.(1) || '—'}</span> · {rider.rides} rides · {rider.verified ? 'KYC verified' : 'pending'}
          </div>
        </div>
        <div className="col" style={{ alignItems: 'flex-end' }}>
          <div className="eyebrow">{HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)}</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{HITCH_FMT_REL(ride.departAt)}</div>
        </div>
      </div>
      <div className="route" style={{ marginBottom: 14 }}>
        <div className="nodes">
          <div className="node-line"></div>
          <div className="node-dot"></div>
          <div className="node-dot end"></div>
        </div>
        <div className="col gap-8">
          <div><div className="place">{ride.from}</div><div className="place-meta">Pickup: {req.pickup}</div></div>
          <div><div className="place">{ride.to}</div><div className="place-meta">{req.seats} seat{req.seats > 1 ? 's' : ''} requested</div></div>
        </div>
      </div>
      {req.note && <div style={{ padding: 12, background: 'var(--bg-sunk)', borderRadius: 4, fontSize: 13, marginBottom: 14 }}>"{req.note}"</div>}
      <div className="row gap-8">
        <button className="btn danger" onClick={onReject}><Icon.X /> Reject</button>
        <div className="spacer"></div>
        <button className="btn primary" onClick={onAccept}><Icon.Check /> Accept &amp; open chat</button>
      </div>
    </div>
  );
}

function OutgoingCard({ req, onChat, onCancel }) {
  const ride = req.ride;
  const driver = HITCH_USER_BY_ID(ride.driverId);
  const tone = req.status === 'accepted' ? 'ok' : req.status === 'rejected' ? 'danger' : 'outline';
  const label = req.status === 'accepted' ? 'ACCEPTED' : req.status === 'rejected' ? 'REJECTED' : 'PENDING';
  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="row gap-16" style={{ marginBottom: 14, alignItems: 'flex-start' }}>
        <Avatar user={driver} />
        <div className="col flex-1">
          <div style={{ fontWeight: 600 }}>{driver?.name}</div>
          <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{ride.from} → {ride.to}</div>
        </div>
        <span className={`badge ${tone}`}>{label}</span>
      </div>
      <div className="row gap-16" style={{ color: 'var(--ink-3)', fontSize: 13 }}>
        <span className="row gap-6"><Icon.Clock /> {HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)}</span>
        <span className="row gap-6"><VehicleIcon type={ride.vehicleType} /> {ride.vehicleModel}</span>
        <span className="row gap-6"><Icon.Pin /> Pickup: {req.pickup}</span>
      </div>
      <div className="row gap-8" style={{ marginTop: 16 }}>
        {req.status === 'accepted' && <button className="btn ink" onClick={onChat}>Open chat <Icon.ArrowRight /></button>}
        {req.status === 'pending' && <button className="btn" onClick={onCancel}>Cancel request</button>}
      </div>
    </div>
  );
}

export default MyRidesScreen;
