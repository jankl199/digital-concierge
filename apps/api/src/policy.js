export function resolveStayPhase({ now, checkIn, checkOut }) {
  const t = now.getTime();
  if (t < new Date(checkIn).getTime()) return 'pre_stay';
  if (t <= new Date(checkOut).getTime()) return 'active_stay';
  return 'post_stay';
}

export function canRevealSensitive({ isAuthenticated, phase, withinValidity }) {
  return Boolean(isAuthenticated && phase === 'active_stay' && withinValidity);
}

export function roleAllowed(role, allowedRoles = []) {
  return allowedRoles.includes(role);
}
