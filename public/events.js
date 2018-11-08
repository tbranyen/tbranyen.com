const bus = {};
const get = e => (bus[e] = bus[e] || new Set());

export const listeners = new Proxy(bus, { get });
export const emit = (e, ...args) => listeners[e].forEach(fn => fn(...args));
