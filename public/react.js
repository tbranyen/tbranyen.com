const bind = f => ({ set(t, p, v) { t[p] = v; f(); return !0; } });

export function react(obj, callback) {
  return new Proxy(obj, bind(callback));
}
