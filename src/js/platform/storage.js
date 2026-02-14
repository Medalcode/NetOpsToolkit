// Plataforma: wrapper para localStorage con JSON (silencioso en fallos)
export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("storage.get error", err);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("storage.set error", err);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("storage.remove error", err);
    }
  },
};
