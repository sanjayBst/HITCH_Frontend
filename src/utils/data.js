// Seed data for Hitch
export const HITCH_SEED = (function () {
  const users = [
    { id: 'u_anya', name: 'Anya Kowalski', initials: 'AK', verified: true, rating: 4.9, rides: 47, since: '2024-08' },
    { id: 'u_dev',  name: 'Devraj Menon',   initials: 'DM', verified: true, rating: 4.8, rides: 22, since: '2025-01' },
    { id: 'u_priya',name: 'Priya Shenoy',   initials: 'PS', verified: true, rating: 5.0, rides: 88, since: '2024-03' },
    { id: 'u_omar', name: 'Omar Haddad',    initials: 'OH', verified: true, rating: 4.7, rides: 14, since: '2025-04' },
    { id: 'u_lin',  name: 'Lin Wei',        initials: 'LW', verified: true, rating: 4.9, rides: 63, since: '2024-06' },
    { id: 'u_sara', name: 'Sara Müller',    initials: 'SM', verified: true, rating: 4.8, rides: 31, since: '2024-11' },
  ];

  const today = new Date();
  const t = (h, m) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    if (d < new Date()) d.setDate(d.getDate() + 1);
    return d.toISOString();
  };

  const rides = [
    {
      id: 'r1', driverId: 'u_anya',
      from: 'Indiranagar', fromMeta: '100ft Road · Bangalore',
      to: 'Whitefield', toMeta: 'ITPL Main Road · Bangalore',
      vehicleType: 'four', vehicleNo: 'KA·05·MX·2241', vehicleModel: 'Hyundai Aura',
      seats: 3, departAt: t(18, 30), distanceKm: 18, durationMin: 52,
      note: 'Office route. AC on. No smoking. Fine with one quick stop near Marathahalli.',
    },
    {
      id: 'r2', driverId: 'u_priya',
      from: 'Koramangala', fromMeta: '5th Block · Bangalore',
      to: 'Electronic City', toMeta: 'Phase 1 Gate · Bangalore',
      vehicleType: 'four', vehicleNo: 'KA·01·HJ·8890', vehicleModel: 'Honda City',
      seats: 2, departAt: t(8, 45), distanceKm: 22, durationMin: 65,
      note: 'Daily drive. I leave on time — be ready at the meeting point.',
    },
    {
      id: 'r3', driverId: 'u_dev',
      from: 'HSR Layout', fromMeta: 'Sector 1 · Bangalore',
      to: 'MG Road Metro', toMeta: 'Brigade Road · Bangalore',
      vehicleType: 'two', vehicleNo: 'KA·03·BC·1145', vehicleModel: 'Royal Enfield Classic 350',
      seats: 1, departAt: t(19, 15), distanceKm: 12, durationMin: 35,
      note: 'Helmet provided. Carry only a small bag please.',
    },
    {
      id: 'r4', driverId: 'u_lin',
      from: 'Jayanagar', fromMeta: '4th Block · Bangalore',
      to: 'Manyata Tech Park', toMeta: 'Outer Ring Road · Bangalore',
      vehicleType: 'four', vehicleNo: 'KA·02·QT·4067', vehicleModel: 'Tata Nexon EV',
      seats: 3, departAt: t(9, 0), distanceKm: 24, durationMin: 70,
      note: 'EV — silent ride. Charging at office, return drop also possible.',
    },
    {
      id: 'r5', driverId: 'u_omar',
      from: 'BTM Layout', fromMeta: 'Stage 2 · Bangalore',
      to: 'Bellandur', toMeta: 'Outer Ring Road · Bangalore',
      vehicleType: 'two', vehicleNo: 'KA·05·LP·3322', vehicleModel: 'Honda Activa 6G',
      seats: 1, departAt: t(17, 45), distanceKm: 9, durationMin: 28,
      note: 'Quick hop. Pillion only.',
    },
    {
      id: 'r6', driverId: 'u_sara',
      from: 'Whitefield', fromMeta: 'Brookefield · Bangalore',
      to: 'Indiranagar', toMeta: 'CMH Road · Bangalore',
      vehicleType: 'four', vehicleNo: 'KA·04·NB·9921', vehicleModel: 'Maruti Baleno',
      seats: 2, departAt: t(20, 0), distanceKm: 17, durationMin: 50,
      note: 'Return trip. Music on, conversation optional.',
    },
  ];

  const placeOptions = [
    'All', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Electronic City',
    'Jayanagar', 'BTM Layout', 'Manyata Tech Park', 'MG Road Metro', 'Bellandur', 'Marathahalli'
  ];

  return { users, rides, placeOptions };
})();

export const HITCH_USER_BY_ID = function (id) {
  return (HITCH_SEED.users || []).find(u => u.id === id);
};

export const HITCH_FMT_TIME = function (iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};
export const HITCH_FMT_DATE = function (iso) {
  const d = new Date(iso);
  const today = new Date();
  const tom = new Date(); tom.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tom.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
};
export const HITCH_FMT_REL = function (iso) {
  const d = new Date(iso); const now = new Date();
  const mins = Math.round((d - now) / 60000);
  if (mins < 0) return `${Math.abs(mins)}m ago`;
  if (mins < 60) return `in ${mins}m`;
  const h = Math.floor(mins / 60); const m = mins % 60;
  if (h < 24) return `in ${h}h ${m}m`;
  return HITCH_FMT_DATE(iso);
};
