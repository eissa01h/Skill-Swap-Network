// Global test setup and environment polyfills
const storageMap = new Map();

if (!globalThis.localStorage) {
  globalThis.localStorage = {
    getItem: (key) => storageMap.get(key) || null,
    setItem: (key, value) => storageMap.set(key, String(value)),
    removeItem: (key) => storageMap.delete(key),
    clear: () => storageMap.clear(),
  };
}

export function resetStorage() {
  storageMap.clear();
}

