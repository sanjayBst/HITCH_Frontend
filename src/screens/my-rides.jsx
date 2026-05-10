import React, {  useState  } from 'react';
import { RideCard } from '../components/RideCard';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function MyRidesScreen({ requests, mySlots, onAccept, onReject, onOpenChat, currentUser, onCancelRequest }) {
  const [tab, setTab] = useState('incoming'); // incoming | outgoing | offered

  // incoming: requests where I'm the driver and status is pending
  const incoming = requests.filter(r => r.driverId === currentUser.id && r.status === 'pending');
  const outgoing = requests.filter(r => r.riderId === currentUser.id);
  const myOffered = mySlots;

  return (
    <div className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">My Journeys</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">Your activity.</h1>
          <div className="text-ink-3 text-sm mt-2 max-w-[60ch]">Manage connections, slots you've offered, and pending matches. Once both sides confirm, chat opens for the duration of the journey.</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-[22px]">
        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${tab === 'incoming' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setTab('incoming')}>Incoming · {incoming.length}</button>
        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${tab === 'outgoing' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setTab('outgoing')}>Outgoing · {outgoing.length}</button>
        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${tab === 'offered' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setTab('offered')}>Offered · {myOffered.length}</button>
      </div>

      {tab === 'incoming' && (
        incoming.length === 0
          ? <div className="p-[60px_20px] text-center border border-dashed border-line-soft rounded-lg text-ink-3"><h3 className="text-ink mb-2 font-semibold tracking-tight">No join requests yet.</h3><div>When Voyagers request to join your journey, they'll appear here.</div></div>
          : <div className="flex flex-col gap-3">{incoming.map(req => <IncomingCard key={req.id} req={req} onAccept={() => onAccept(req)} onReject={() => onReject(req)} />)}</div>
      )}

      {tab === 'outgoing' && (
        outgoing.length === 0
          ? <div className="p-[60px_20px] text-center border border-dashed border-line-soft rounded-lg text-ink-3"><h3 className="text-ink mb-2 font-semibold tracking-tight">No outgoing requests.</h3><div>Browse available rides and send one.</div></div>
          : <div className="flex flex-col gap-3">{outgoing.map(req => <OutgoingCard key={req.id} req={req} onChat={() => onOpenChat(req)} onCancel={() => onCancelRequest(req)} />)}</div>
      )}

      {tab === 'offered' && (
        myOffered.length === 0
          ? <div className="p-[60px_20px] text-center border border-dashed border-line-soft rounded-lg text-ink-3"><h3 className="text-ink mb-2 font-semibold tracking-tight">You haven't offered any slots yet.</h3><div>Heading somewhere? Release a slot — someone might be on the same route.</div></div>
          : <div className="flex flex-col gap-3">{myOffered.map(r => <RideCard key={r.id} ride={r} onOpen={() => {}} badge={{ text: 'Yours', tone: 'ink' }} />)}</div>
      )}
    </div>
  );
}

function IncomingCard({ req, onAccept, onReject }) {
  const ride = req.ride;
  const rider = HITCH_USER_BY_ID(req.riderId) || { name: 'Voyager', initials: 'V', rating: 5, rides: 1, verified: true };
  return (
    <div className="card-base p-[22px]">
      <div className="flex items-start gap-4 mb-3.5">
        <Avatar user={rider} />
        <div className="flex flex-col flex-1">
          <div className="flex items-baseline gap-2">
            <div className="font-semibold">{rider.name}</div>
            <span className="badge-base bg-accent text-accent-ink">REQUEST</span>
          </div>
          <div className="text-ink-3 text-[12px] mt-0.5">
            <Icon.Star /> <span className="font-mono">{rider.rating?.toFixed?.(1) || '—'}</span> · {rider.rides} rides · {rider.verified ? 'KYC verified' : 'pending'}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">{HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)}</div>
          <div className="font-mono text-[12px] text-ink-3">{HITCH_FMT_REL(ride.departAt)}</div>
        </div>
      </div>

      <div className="grid grid-cols-[14px_1fr] gap-x-3.5 mb-3.5">
        <div className="grid grid-rows-[auto_auto] gap-[18px] relative">
          <div className="absolute top-3.5 bottom-3.5 left-1 w-[1px] bg-[repeating-linear-gradient(to_bottom,var(--ink-4)_0_4px,transparent_4px_8px)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-ink mt-1.5 relative z-10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent border border-ink mt-1.5 relative z-10"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div><div className="text-base font-medium tracking-tight">{ride.from}</div><div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">Pickup: {req.pickup}</div></div>
          <div><div className="text-base font-medium tracking-tight">{ride.to}</div><div className="font-mono text-[11px] text-ink-3 tracking-wider uppercase mt-0.5">{req.seats} seat{req.seats > 1 ? 's' : ''} requested</div></div>
        </div>
      </div>

      {req.note && <div className="p-3 bg-bg-sunk rounded text-[13px] mb-3.5">"{req.note}"</div>}
      <div className="flex items-center gap-2">
        <button className="btn btn-danger" onClick={onReject}><Icon.X /> Reject</button>
        <div className="flex-1"></div>
        <button className="btn btn-primary" onClick={onAccept}><Icon.Check /> Accept &amp; open chat</button>
      </div>
    </div>
  );
}

function OutgoingCard({ req, onChat, onCancel }) {
  const ride = req.ride;
  const driver = HITCH_USER_BY_ID(ride.driverId);
  const toneClass = req.status === 'accepted' ? 'bg-ok text-white' : req.status === 'rejected' ? 'bg-danger text-white' : 'border border-line-soft text-ink-2';
  const label = req.status === 'accepted' ? 'ACCEPTED' : req.status === 'rejected' ? 'REJECTED' : 'PENDING';
  return (
    <div className="card-base p-[22px]">
      <div className="flex items-start gap-4 mb-3.5">
        <Avatar user={driver} />
        <div className="flex flex-col flex-1">
          <div className="font-semibold">{driver?.name}</div>
          <div className="text-ink-3 text-[12px] mt-0.5">{ride.from} → {ride.to}</div>
        </div>
        <span className={`badge-base ${toneClass}`}>{label}</span>
      </div>
      <div className="flex items-center gap-4 text-ink-3 text-[13px]">
        <span className="flex items-center gap-1.5"><Icon.Clock /> {HITCH_FMT_DATE(ride.departAt)} · {HITCH_FMT_TIME(ride.departAt)}</span>
        <span className="flex items-center gap-1.5"><VehicleIcon type={ride.vehicleType} /> {ride.vehicleModel}</span>
        <span className="flex items-center gap-1.5"><Icon.Pin /> Pickup: {req.pickup}</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {req.status === 'accepted' && <button className="btn btn-ink" onClick={onChat}>Open chat <Icon.ArrowRight /></button>}
        {req.status === 'pending' && <button className="btn" onClick={onCancel}>Cancel request</button>}
      </div>
    </div>
  );
}

export default MyRidesScreen;
