import { StoreApi, UseBoundStore } from "zustand";
import { PersistStorage } from "zustand/middleware";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

// Adds selector hooks on the "use" property
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export function getLocalStorageConfig<T>({
  migrateCallback,
  fillCallback,
}: {
  migrateCallback?: (state: any) => void; // Use for migrating to  Zustand format
  fillCallback?: (state: any) => void; // Use for adding new props to object state
} = {}): PersistStorage<T> {
  return {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) {
        return null;
      }

      try {
        const data = JSON.parse(str);

        // If in old format before Zustand
        if (!("state" in data)) {
          const migratedData = migrateCallback ? migrateCallback(data) : data;
          const filledData = fillCallback
            ? fillCallback(migratedData)
            : migratedData;

          return {
            state: filledData,
            version: 0,
          };
        }

        const filledState = fillCallback
          ? fillCallback(data.state)
          : data.state;

        return {
          state: filledState,
          version: data.version,
        };
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => localStorage.removeItem(name),
  };
}
